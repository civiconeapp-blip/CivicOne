/**
 * fetch-recpark-events.js — pulls SF Rec & Parks' "Main Calendar" iCal feed
 * and writes verified events into src/events-auto.js.
 *
 * Provenance (Integrity Law): every event written here carries
 * `source: "SF Rec & Parks iCal — <feed URL>"` instead of a personal
 * `verified` stamp — the official feed IS the verification. No fact is
 * invented: district is assigned only via VENUE_DISTRICT_MAP below, and
 * any venue not in that map is skipped and logged, never guessed.
 *
 * Feed confirmed 2026-08-10 by direct fetch: real iCal (VEVENT) data with
 * SUMMARY/DTSTART/DTEND/LOCATION/DESCRIPTION/UID fields. This is 1 of 16
 * category-specific feeds on https://sfrecpark.org/iCalendar.aspx (the
 * "Main Calendar", catID=14) — the other 15 (Golden Gate Park, Volunteer,
 * Commission, Urban Agriculture, etc.) have NOT been independently
 * verified and are not pulled here; adding them is a follow-up decision.
 *
 * Per-event URLs: the feed's own URL: field just repeats the feed URL
 * (a RecPark quirk). The real per-event page is embedded in DESCRIPTION
 * as "https://sfrecpark.org/calendar.aspx?EID=<n>", and <n> was checked
 * to equal the event's UID for all 140 events in the feed at verification
 * time (2026-08-10) — so the per-event URL is constructed from UID
 * directly, a confirmed pattern rather than a guess.
 *
 * Run manually: node scripts/fetch-recpark-events.js
 * (Not yet on a schedule — see Phase 5 Step 5 notes in the task report.)
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "src", "events-auto.js");

const FEED_URL =
  "https://sfrecpark.org/common/modules/iCalendar/iCalendar.aspx?catID=14&feed=calendar";
const DAYS_WINDOW = 60;

/**
 * Venue -> district lookup. Do NOT extend this by guessing — every entry
 * here was individually verified against an official SF district boundary
 * source before being added.
 *
 *   Sunset Dunes (Great Highway / Upper Great Highway, between Lincoln Way
 *   and Sloat Blvd) -> District 4. Verified 2026-08-10 against the City's
 *   official supervisorial-district metes-and-bounds description
 *   (sfgov.org/ccsfgsa/san-francisco-supervisorial-districts-metes-and-bounds):
 *   District 4's boundary is defined by that exact Lincoln Way / Sloat Blvd
 *   / Pacific Ocean shoreline segment, which is precisely this park.
 *
 *   Union Square (Post St & Stockton St) -> District 3. Verified 2026-08-10
 *   via point-in-polygon test against DataSF's official "Current Supervisor
 *   Districts" boundary dataset (data.sfgov.org, resource f2zs-jevy /
 *   cqbw-m5m3), corroborated by District 3's own supervisor page listing
 *   Union Square among its neighborhoods.
 *
 * Keys are the venue string AFTER normalizeVenue() below (HTML-stripped,
 * iCal-unescaped, whitespace-collapsed) — both textual variants the feed
 * uses for Sunset Dunes are listed explicitly rather than fuzzy-matched,
 * so nothing new can silently map to a district without being added here
 * by a human and re-verified.
 */
const VENUE_DISTRICT_MAP = {
  "Sunset Dunes - Great Highway, between Lincoln and Sloat San Francisco CA 94122": 4,
  "Sunset Dunes and Upper Great Highway - 1611 Upper Great Highway San Francisco CA 94122": 4,
  "Union Square - Post and Stockton San Francisco CA 94108": 3,
};

function fail(message) {
  console.error("\n[fetch-recpark-events] FAILED: " + message);
  console.error("[fetch-recpark-events] No file written. src/events-auto.js left untouched.\n");
  process.exit(1);
}

function unescapeIcal(s) {
  if (!s) return "";
  return s
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function normalizeVenue(raw) {
  return unescapeIcal(raw)
    .replace(/<[^>]*>/g, "") // strip stray HTML tags seen in some LOCATION values
    .replace(/\s+/g, " ")
    .trim();
}

/** RFC 5545 line-unfolding: a newline followed by a space/tab continues the previous line. */
function unfold(raw) {
  return raw.replace(/\r?\n[ \t]/g, "");
}

function parseIcal(raw) {
  const lines = unfold(raw).split(/\r?\n/);
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur) events.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).split(";")[0];
    const val = line.slice(idx + 1);
    cur[key] = val;
  }
  return events;
}

/** "YYYYMMDDTHHMMSS" (local wall-clock, TZID already America/Los_Angeles) -> {date, h, m} */
function parseDT(s) {
  if (!s || s.length < 15) return null;
  return {
    date: `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`,
    h: Number(s.slice(9, 11)),
    m: s.slice(11, 13),
  };
}

function formatClock(h, m) {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { label: `${h12}:${m}`, period };
}

function formatTimeRange(start, end) {
  const s = formatClock(start.h, start.m);
  const e = formatClock(end.h, end.m);
  if (s.period === e.period) return `${s.label} – ${e.label} ${e.period}`;
  return `${s.label} ${s.period} – ${e.label} ${e.period}`;
}

async function main() {
  console.log("[fetch-recpark-events] Fetching " + FEED_URL);
  let res;
  try {
    res = await fetch(FEED_URL, {
      headers: { "User-Agent": "CivicOne/1.0 (+https://github.com/civiconeapp-blip/CivicOne)" },
    });
  } catch (e) {
    fail("network error fetching feed: " + e.message);
    return;
  }
  if (!res.ok) {
    fail(`feed responded HTTP ${res.status}`);
    return;
  }
  const body = await res.text();
  if (!body.includes("BEGIN:VCALENDAR")) {
    fail("response did not contain BEGIN:VCALENDAR — not a real iCal feed");
    return;
  }

  const rawEvents = parseIcal(body);
  if (rawEvents.length === 0) {
    fail("parsed 0 VEVENT blocks from a response that claimed to be iCal — treating as unparseable");
    return;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + DAYS_WINDOW);

  const written = [];
  const skippedUnmapped = [];
  let outOfWindow = 0;

  for (const e of rawEvents) {
    const start = parseDT(e.DTSTART);
    const end = parseDT(e.DTEND) || start;
    if (!start || !e.UID || !e.SUMMARY) continue; // malformed VEVENT, silently ignored (not counted as a real candidate)

    const dateObj = new Date(start.date + "T00:00:00");
    if (dateObj < now || dateObj > cutoff) {
      outOfWindow++;
      continue;
    }

    const venue = normalizeVenue(e.LOCATION || "");
    const district = VENUE_DISTRICT_MAP[venue];
    if (!district) {
      skippedUnmapped.push({ uid: e.UID, title: unescapeIcal(e.SUMMARY), venue: venue || "(no location)" });
      continue;
    }

    written.push({
      id: `recpark-${e.UID}`,
      district,
      title: unescapeIcal(e.SUMMARY),
      venue,
      date: start.date,
      time: formatTimeRange(start, end),
      url: `https://sfrecpark.org/calendar.aspx?EID=${e.UID}`,
      source: `SF Rec & Parks iCal — ${FEED_URL}`,
    });
  }

  written.sort((a, b) => a.date.localeCompare(b.date));

  const header = `/**
 * events-auto.js — AUTO-GENERATED by scripts/fetch-recpark-events.js.
 * DO NOT hand-edit. Re-run the script to refresh.
 *
 * Provenance (Integrity Law): every event here carries a \`source\` field
 * naming the official feed it came from — that feed IS the verification,
 * no personal tap-verify needed. Never add an event to this file by hand;
 * anything hand-entered belongs in src/events.js with a \`verified\` stamp.
 *
 * Generated: ${new Date().toISOString().slice(0, 10)}
 * Source feed: ${FEED_URL}
 */

export const EVENTS_AUTO = ${JSON.stringify(written, null, 2)};
`;

  writeFileSync(OUTPUT_PATH, header, "utf-8");

  console.log("\n[fetch-recpark-events] Done.");
  console.log(`  Total VEVENTs in feed:        ${rawEvents.length}`);
  console.log(`  Outside the ${DAYS_WINDOW}-day window:      ${outOfWindow}`);
  console.log(`  In window, mapped & written:  ${written.length}`);
  console.log(`  In window, unmapped & SKIPPED: ${skippedUnmapped.length}`);
  if (skippedUnmapped.length) {
    console.log("\n  Skipped (venue not in VENUE_DISTRICT_MAP — needs review, never guessed):");
    const byVenue = {};
    for (const s of skippedUnmapped) {
      (byVenue[s.venue] = byVenue[s.venue] || []).push(s.title);
    }
    for (const [venue, titles] of Object.entries(byVenue)) {
      console.log(`    - "${venue}" (${titles.length} event${titles.length === 1 ? "" : "s"}: ${titles.slice(0, 3).join(", ")}${titles.length > 3 ? ", ..." : ""})`);
    }
  }
  console.log(`\n  Wrote ${written.length} events to ${path.relative(process.cwd(), OUTPUT_PATH)}\n`);
}

main();
