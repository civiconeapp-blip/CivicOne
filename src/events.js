/**
 * events.js — verified community events, next-two-months window.
 *
 * INTEGRITY RULES (non-negotiable):
 * 1. An event may only be added with verified: "<date> Amal" after Amal
 *    has personally opened the url and confirmed title, date, and venue.
 * 2. No url, no listing. Never invent or approximate an event.
 * 3. The calendar auto-hides past events and anything beyond 60 days,
 *    so stale entries never render — but delete them on the weekly pass.
 *
 * Event shape:
 * {
 *   id: "unique-string",
 *   district: 5,                      // 5, 6, or 9 (active districts)
 *   title: "Event name",              // original language of the source
 *   venue: "Location name",
 *   date: "2026-07-20",               // ISO date
 *   time: "10:00 AM – 12:00 PM",      // display string from the source
 *   url: "https://…",                 // official page, tap-verified
 *   verified: "2026-07-16 Amal",
 * }
 */

export const EVENTS = [
  {
    id: "aids-quilt-workshop-2026-08-01",
    district: 5,
    title: "National AIDS Memorial Quilt Repair & Panel Making Workshop",
    venue: "Main Library, Steve Silver Music Center (4th Fl), 100 Larkin St",
    date: "2026-08-01",
    time: "12:00 – 4:00 PM",
    url: "https://sfpl.org/events/2026/08/01/workshop-national-aids-memorial-quilt-repair-panel-making-workshop",
    verified: "2026-07-17 Amal", // Amal opened the event page; details confirmed against it same day
  },
];

/** Upcoming, verified events within the next `days` days. */
export function upcomingEvents(districtId = null, days = 60) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + days);
  return EVENTS.filter((e) => {
    if (!e.verified || !e.url) return false;
    const d = new Date(e.date + "T00:00:00");
    if (d < now || d > cutoff) return false;
    if (districtId !== null && e.district !== Number(districtId)) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));
}
