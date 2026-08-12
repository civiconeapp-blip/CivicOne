// api/report.js — CivicOne one-tap 311 filing.
// Photo + GPS in → Gemini identifies the problem and writes the report →
// a headless browser drives SF311's official web form → the real SR case
// number comes back. Uses the same GEMINI_API_KEY as api/triage.js.
//
// Extra env (optional): REPORTER_EMAIL — some SF311 forms require an email
// even for anonymous reports (street cleaning). Without it those categories
// fall back to an error the UI handles gracefully.
// Privacy: photo goes to the AI and to SF311's form, nothing is stored.

import fs from "fs";
import os from "os";
import path from "path";
import { submitReport } from "../lib/submit311.js";
import { forms } from "../lib/forms311.js";

const MODEL = "gemini-3.5-flash";

const GEOCODE =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";

async function reverseGeocode(lat, lng) {
  const u = `${GEOCODE}?f=json&location=${encodeURIComponent(`${lng},${lat}`)}&outSR=4326`;
  const r = await fetch(u);
  const j = await r.json();
  const a = j.address || {};
  return a.Match_addr || a.LongLabel || null;
}

const SYSTEM_PROMPT = `You classify San Francisco street problems from a photo for automatic 311 filing.

1. EMERGENCY CHECK FIRST. If the photo or note shows an emergency — fire,
   medical crisis, violence, a person in danger — set "emergency" to true and
   put a short message in the resident's language (given as lang code) telling
   them to call 911 in "summary_local". Do nothing else.
2. Otherwise pick "form" and "category":
   form "blocked_street_sidewalk" categories: ${Object.keys(forms.blocked_street_sidewalk.categories).join(", ")}
   form "street_cleaning" categories: ${Object.keys(forms.street_cleaning.categories).join(", ")}
   Tents/encampments with people or belongings -> blocked_street_sidewalk / encampment.
   Loose trash, dumping, waste, needles, mattresses, carts -> street_cleaning with the closest category.
3. "description": 1-3 factual English sentences for the city crew. Neutral tone;
   describe objects and conditions, never speculate about people.
4. "locationDescription": short English placement hint (e.g. "on the sidewalk
   near the bus shelter"), from what is visible. Empty string if unclear.
5. "summary_local": 1 sentence in the resident's language (lang code provided)
   stating what is being reported.

Respond with ONLY compact JSON, exactly these keys:
emergency (boolean), form (string), category (string), description (string),
locationDescription (string), summary_local (string).`;

async function classify(photoBase64, mediaType, note, lang) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: mediaType, data: photoBase64 } },
              {
                text:
                  `Resident language code: ${lang || "en"}.` +
                  (note ? `\nResident note: ${note}` : "\nNo note provided."),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    }
  );
  if (!r.ok) throw new Error(`AI classify failed: ${r.status}`);
  const data = await r.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const raw = parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("");
  let out = null;
  const start = raw.indexOf("{");
  let end = raw.lastIndexOf("}");
  while (start >= 0 && end > start && !out) {
    try { out = JSON.parse(raw.slice(start, end + 1)); }
    catch { end = raw.lastIndexOf("}", end - 1); }
  }
  if (!out) throw new Error("AI gave an unreadable answer");

  // Guardrails: never trust the model blindly.
  out.emergency = Boolean(out.emergency);
  if (!forms[out.form]) out.form = "street_cleaning";
  if (!forms[out.form].categories[out.category]) {
    out.category =
      out.form === "street_cleaning"
        ? "other_loose_garbage_debris_yard_waste"
        : "blocked_sidewalk";
  }
  return out;
}

export default async function handler(req, res) {
  // Health check.
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      hasKey: Boolean(process.env.GEMINI_API_KEY),
      hasEmail: Boolean(process.env.REPORTER_EMAIL),
      dryRun: Boolean(process.env.DRY_RUN),
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Server is not configured yet." });
    }
    const { photo, mediaType, lat, lng, note, lang, address: manualAddress } = req.body || {};
    if (!photo) return res.status(400).json({ error: "photo (base64) required" });
    if (photo.length > 8_000_000) return res.status(413).json({ error: "Photo too large" });
    if (!manualAddress && (lat == null || lng == null)) {
      return res.status(400).json({ error: "lat/lng or address required" });
    }

    const address = manualAddress || (await reverseGeocode(lat, lng));
    if (!address) return res.status(422).json({ error: "Could not resolve address from GPS" });

    const ai = await classify(photo, mediaType || "image/jpeg", note, lang);
    if (ai.emergency) {
      return res.status(200).json({ ok: true, emergency: true, summary_local: ai.summary_local });
    }

    const photoPath = path.join(os.tmpdir(), `report_${Date.now()}.jpg`);
    fs.writeFileSync(photoPath, Buffer.from(photo, "base64"));

    const result = await submitReport({
      form: ai.form,
      category: ai.category,
      address,
      locationDescription: ai.locationDescription,
      description: note ? `${ai.description} Reporter note: ${note}` : ai.description,
      photoPath,
      email: process.env.REPORTER_EMAIL,
      dryRun: Boolean(process.env.DRY_RUN),
    });

    fs.unlink(photoPath, () => {});
    return res.status(result.ok ? 200 : 502).json({
      address,
      category: ai.category,
      summary_local: ai.summary_local,
      description: ai.description,
      ...result,
    });
  } catch (err) {
    console.error("Report failure", err);
    return res.status(500).json({ error: err.message || "Something went wrong." });
  }
}
