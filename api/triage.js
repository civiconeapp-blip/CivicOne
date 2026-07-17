// api/triage.js — CivicOne 311 AI triage (v1, handoff mode)
// Vercel serverless function. Needs GEMINI_API_KEY set in Vercel env vars.
// Privacy: nothing is stored. Report text goes to the AI, comes back, and is gone.

const MODEL = "gemini-2.5-flash";

// Draft list — to be confirmed against SF311's official Open311 services list.
const CATEGORIES = [
  "Street or sidewalk cleaning",
  "Graffiti",
  "Encampment",
  "Streetlight repair",
  "Pothole or street defect",
  "Abandoned vehicle",
  "Tree maintenance",
  "Illegal dumping",
  "Noise",
  "Blocked driveway",
  "Other",
];

const SYSTEM_PROMPT = `You are the intake triage system for CivicOne, a civic
app serving San Francisco District 5 residents in many languages.

A resident describes a neighborhood problem in their own language. Your job:

1. EMERGENCY CHECK FIRST. If the text describes any emergency — fire, medical
   crisis, violence, crime in progress, someone in danger — set "emergency"
   to true and put a short message in the resident's own language telling them
   to call 911 immediately in "summary_local". Do nothing else.
2. Pick "category" ONLY from this exact list: ${CATEGORIES.join("; ")}.
   If nothing fits, use "Other". Never invent a category.
3. Rate "severity" 1 (minor), 2 (moderate), or 3 (safety hazard), with a
   one-line "severity_reason" in English.
4. Write "title" (under 10 words, English) and "description_en": a clear,
   factual English report suitable for the SF311 system. Include the location
   ONLY if the resident provided one. Never guess or invent a location or any
   detail not in the resident's message.
5. Write "summary_local": 1-2 sentences in the SAME language the resident
   wrote in, confirming what is about to be reported.
6. If no location was given, set "needs_more_info" to true and put a polite
   question asking where the problem is, in the resident's language, in
   "followup_question". Otherwise set it to false and followup_question to null.

Respond with ONLY a JSON object with exactly these keys:
emergency (boolean), category (string), severity (number), severity_reason
(string), title (string), description_en (string), summary_local (string),
needs_more_info (boolean), followup_question (string or null).`;

export default async function handler(req, res) {
  // Health check: visit this URL in a browser to confirm deploy + key.
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ok: true, hasKey: Boolean(process.env.GEMINI_API_KEY) });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { description, location } = req.body || {};
  if (typeof description !== "string" || description.trim().length < 3) {
    return res.status(400).json({ error: "Please describe the problem." });
  }
  if (description.length > 1500 || (location && String(location).length > 300)) {
    return res.status(400).json({ error: "Description is too long." });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Server is not configured yet." });
  }

  const userText =
    "Resident's report:\n" +
    description.trim() +
    (location ? "\n\nLocation the resident gave: " + String(location).trim() : "\n\n(No location given.)");

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error", r.status, detail.slice(0, 500));
      return res.status(502).json({ error: "Triage is temporarily unavailable. Please try again." });
    }

    const data = await r.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    let out;
    try {
      out = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: "Triage gave an unreadable answer. Please try again." });
    }

    // Server-side guardrails: never trust the model blindly.
    if (!CATEGORIES.includes(out.category)) out.category = "Other";
    out.severity = Math.min(3, Math.max(1, Number(out.severity) || 1));
    out.emergency = Boolean(out.emergency);
    out.needs_more_info = Boolean(out.needs_more_info);

    return res.status(200).json(out);
  } catch (err) {
    console.error("Triage failure", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
