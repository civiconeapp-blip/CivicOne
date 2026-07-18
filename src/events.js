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
    desc: { ar: "ورشة عمل لترميم وصنع ألواح لحاف النصب التذكاري للإيدز — لا حاجة لخبرة في الخياطة." },
    district: 5,
    title: "National AIDS Memorial Quilt Repair & Panel Making Workshop",
    venue: "Main Library, Steve Silver Music Center (4th Fl), 100 Larkin St",
    date: "2026-08-01",
    time: "12:00 – 4:00 PM",
    url: "https://sfpl.org/events/2026/08/01/workshop-national-aids-memorial-quilt-repair-panel-making-workshop",
    verified: "2026-07-17 Amal", // Amal opened the event page; details confirmed against it same day
  },
  {
    id: "craft-club-asl-2026-07-25",
    desc: { ar: "نادي الحرف اليدوية بلغة الإشارة الأمريكية — لجميع الأعمار." },
    district: 5,
    title: "Craft Club in American Sign Language (ASL)",
    venue: "Main Library, 100 Larkin St",
    date: "2026-07-25",
    time: "1:00 – 2:00 PM",
    url: "https://sfpl.org/events/2026/07/25/activity-craft-club-american-sign-language-asl",
    verified: "2026-07-17 Amal",
  },
  {
    id: "chinese-games-club-2026-08-03",
    desc: { ar: "نادي الشطرنج والألعاب باللغة الصينية." },
    district: 5,
    title: "活動：棋樂無窮 (Chess & Games Club in Chinese)",
    venue: "Main Library, 100 Larkin St",
    date: "2026-08-03",
    time: "10:00 AM – 12:00 PM",
    url: "https://sfpl.org/events/2026/08/03/huodongqilewuqiong",
    verified: "2026-07-17 Amal",
  },
  {
    id: "main-library-tour-2026-08-07",
    desc: { ar: "جولة تعريفية في المكتبة الرئيسية." },
    district: 5,
    title: "Main Library Tour",
    venue: "Main Library, 100 Larkin St",
    date: "2026-08-07",
    time: "12:00 – 1:00 PM",
    url: "https://sfpl.org/events/2026/08/07/social-main-library-tour",
    verified: "2026-07-17 Amal",
  },
  {
    id: "manongs-manangs-tribute-2026-08-08",
    desc: { ar: "احتفال بمجتمع الفلبينيين الأمريكيين وتكريم روّاده الأوائل." },
    district: 5,
    title: "Building Communities — A Tribute to Our Manongs and Manangs",
    venue: "Main Library, 100 Larkin St",
    date: "2026-08-08",
    time: "2:00 – 5:00 PM",
    url: "https://sfpl.org/events/2026/08/08/celebration-building-communities-tribute-our-manongs-and-manangs",
    verified: "2026-07-17 Amal",
  },
  {
    id: "waris-shahs-heer-2026-08-29",
    desc: { ar: "عرض فني لملحمة «هير» للشاعر وارث شاه." },
    district: 5,
    title: "Performance: Waris Shah's Heer",
    venue: "Main Library, 100 Larkin St",
    date: "2026-08-29",
    time: "2:00 – 5:15 PM",
    url: "https://sfpl.org/events/2026/08/29/performance-waris-shahs-heer",
    verified: "2026-07-17 Amal",
  },
  {
    id: "aids-quilt-workshop-2026-09-05",
    desc: { ar: "ورشة عمل لترميم وصنع ألواح لحاف النصب التذكاري للإيدز — لا حاجة لخبرة في الخياطة." },
    district: 5,
    title: "National AIDS Memorial Quilt Repair & Panel Making Workshop",
    venue: "Main Library, Steve Silver Music Center (4th Fl), 100 Larkin St",
    date: "2026-09-05",
    time: "12:00 – 4:00 PM",
    url: "https://sfpl.org/events/2026/09/05/workshop-national-aids-memorial-quilt-repair-panel-making-workshop",
    verified: "2026-07-17 Amal",
  },
  {
    id: "film-chinatown-2026-09-12",
    desc: { ar: "عرض فيلم «Chinatown» (1995)." },
    district: 5,
    title: "Film: Chinatown (1995)",
    venue: "Main Library, 100 Larkin St",
    date: "2026-09-12",
    time: "1:00 – 3:00 PM",
    url: "https://sfpl.org/events/2026/09/12/film-chinatown-1995",
    verified: "2026-07-17 Amal",
  },
  {
    id: "painting-big-feelings-2026-07-25",
    desc: { ar: "ورشة رسم للتعبير عن المشاعر — لجميع الأعمار." },
    district: 9,
    title: "Workshop: Painting Big Feelings",
    venue: "Bernal Heights Branch Library, 500 Cortland Ave",
    date: "2026-07-25",
    time: "3:30 – 5:00 PM",
    url: "https://sfpl.org/events/2026/07/25/workshop-painting-big-feelings",
    verified: "2026-07-17 Amal",
  },
  {
    id: "sample-the-circus-2026-08-19",
    desc: { ar: "ورشة فنون السيرك: التهريج والألعاب البهلوانية — لجميع الأعمار." },
    district: 9,
    title: "Workshop: Clowning, Juggling and More! Sample the Circus",
    venue: "Bernal Heights Branch Library, 500 Cortland Ave",
    date: "2026-08-19",
    time: "5:00 – 6:30 PM",
    url: "https://sfpl.org/events/2026/08/19/workshop-clowning-juggling-and-more-sample-circus",
    verified: "2026-07-17 Amal",
  },
  {
    id: "diapason-resonancia-2026-08-01",
    desc: { ar: "عرض موسيقي لاتيني لجميع الأعمار." },
    district: 5,
    title: "DíaPaSón presents La reSONancia del Barrio",
    venue: "Park Branch Library, 1833 Page St",
    date: "2026-08-01",
    time: "3:00 – 3:45 PM",
    url: "https://sfpl.org/events/2026/08/01/performance-diapason-presents-la-resonancia-del-barrio",
    verified: "2026-07-17 Amal",
  },
  {
    id: "creating-music-ai-2026-08-23",
    desc: { ar: "ورشة إنشاء الموسيقى باستخدام الذكاء الاصطناعي." },
    district: 9,
    title: "Workshop: Creating Music with AI",
    venue: "Portola Branch Library, 380 Bacon St",
    date: "2026-08-23",
    time: "2:00 – 4:00 PM",
    url: "https://sfpl.org/events/2026/08/23/workshop-creating-music-ai",
    verified: "2026-07-17 Amal",
  },
  {
    id: "tiny-art-dropin-2026-09-12",
    desc: { ar: "جلسة رسم حرة بالألوان المائية على لوحات صغيرة." },
    district: 9,
    title: "Tiny Art Painting Canvas and Watercolor Drop-In",
    venue: "Portola Branch Library, 380 Bacon St",
    date: "2026-09-12",
    time: "3:00 – 4:00 PM",
    url: "https://sfpl.org/events/2026/09/12/activity-tiny-art-painting-canvas-and-watercolor-drop",
    verified: "2026-07-17 Amal",
  },
  {
    id: "tiny-art-reception-2026-09-26",
    desc: { ar: "حفل استقبال لمعرض الفن الصغير — مفتوح للجميع." },
    district: 9,
    title: "Tiny Art Show Reception",
    venue: "Portola Branch Library, 380 Bacon St",
    date: "2026-09-26",
    time: "2:00 – 3:00 PM",
    url: "https://sfpl.org/events/2026/09/26/celebration-tiny-art-show-reception",
    verified: "2026-07-17 Amal",
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
