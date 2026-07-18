import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LANGS, T } from "./i18n.js";
import { DISTRICTS, ACTIVE_DISTRICTS, isActive } from "./districts.js";
import { upcomingEvents } from "./events.js";

const C = {
  paper: "#F5F2EA",
  cream: "#F5F2EA",
  ink: "#1A1A1A",
  navy: "#1B2A41",
  gold: "#A9863A",
  goldLine: "#C9A961",
  muted: "#6B675E",
  hairline: "#D8D3C6",
};
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const caps = { ...sans, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 };

const LOCALES = { en: "en-US", es: "es", zh: "zh-CN", vi: "vi", ar: "ar" };

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAway(iso) {
  const d = new Date(iso + "T00:00:00");
  return Math.round((d - todayStart()) / 86400000);
}

function relativeLabel(iso, lang) {
  const rtf = new Intl.RelativeTimeFormat(LOCALES[lang] || "en-US", { numeric: "auto" });
  return rtf.format(daysAway(iso), "day");
}

function dateHeading(iso, lang) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(LOCALES[lang] || "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function isoDate(y, m, day) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ---------- Mini month grid ---------- */
function MonthGrid({ year, month, eventDates, selected, onSelect, lang }) {
  const locale = LOCALES[lang] || "en-US";
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = first.getDay();
  const monthTitle = first.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2026, 6, 12 + i).toLocaleDateString(locale, { weekday: "narrow" })
  );
  const today = todayStart();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ minWidth: 240, flex: "1 1 240px", maxWidth: 320 }}>
      <div style={{ ...caps, fontSize: 10.5, color: C.ink, marginBottom: 10 }}>{monthTitle}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {weekdays.map((w, i) => (
          <div key={"w" + i} style={{ ...caps, fontSize: 9, color: C.muted, textAlign: "center", paddingBottom: 4 }}>
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={"e" + i} />;
          const dIso = isoDate(year, month, d);
          const has = eventDates.has(dIso);
          const isPast = new Date(dIso + "T00:00:00") < today;
          const isSel = selected === dIso;
          return (
            <button
              key={dIso}
              onClick={() => has && onSelect(isSel ? null : dIso)}
              disabled={!has}
              aria-label={dIso}
              style={{
                ...sans,
                fontSize: 12.5,
                minHeight: 34,
                border: isSel ? `1.5px solid ${C.gold}` : "1px solid transparent",
                background: isSel ? C.navy : "transparent",
                color: isSel ? "#fff" : isPast ? "#C8C3B6" : has ? C.ink : C.muted,
                fontWeight: has ? 700 : 400,
                cursor: has ? "pointer" : "default",
                position: "relative",
                padding: 0,
              }}
            >
              {d}
              {has && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: isSel ? C.goldLine : C.gold,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Date leaf tile ---------- */
function DateLeaf({ iso, lang }) {
  const d = new Date(iso + "T00:00:00");
  const locale = LOCALES[lang] || "en-US";
  return (
    <div
      aria-hidden="true"
      style={{
        border: `1px solid ${C.hairline}`,
        background: "#fff",
        minWidth: 52,
        textAlign: "center",
        padding: "6px 8px 8px",
        alignSelf: "flex-start",
      }}
    >
      <div style={{ ...caps, fontSize: 8.5, color: C.gold }}>
        {d.toLocaleDateString(locale, { month: "short" })}
      </div>
      <div style={{ ...serif, fontSize: 24, color: C.ink, lineHeight: 1.1 }}>{d.getDate()}</div>
    </div>
  );
}

export default function EventsCalendar({ lang, setLang }) {
  const t = T[lang];
  const rtl = lang === "ar";
  const [params] = useSearchParams();
  const initial = isActive(params.get("d")) ? Number(params.get("d")) : null;
  const [filter, setFilter] = useState(initial);
  const [dayFilter, setDayFilter] = useState(null);

  const allEvents = upcomingEvents(filter);
  const eventDates = new Set(allEvents.map((e) => e.date));
  const events = dayFilter ? allEvents.filter((e) => e.date === dayFilter) : allEvents;
  const byDate = events.reduce((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

  const now = new Date();
  const thisY = now.getFullYear();
  const thisM = now.getMonth();
  const nextY = thisM === 11 ? thisY + 1 : thisY;
  const nextM = (thisM + 1) % 12;

  return (
    <div style={{ background: C.paper, minHeight: "100vh", ...sans }}>
      <div dir={rtl ? "rtl" : "ltr"} style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <header style={{ paddingTop: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ ...caps, fontSize: 10.5, color: C.muted }}>{t.city}</span>
            <span style={{ ...caps, fontSize: 10.5, color: C.gold }}>{t.evUpcoming}</span>
          </div>
          <div style={{ height: 1, background: C.ink, margin: "16px 0" }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{ ...serif, fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>Civic One</h1>
            <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }} aria-label="Language">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); if (window.umami) window.umami.track("language_switch", { lang: l.code }); }}
                  style={{
                    ...sans,
                    fontSize: 12.5,
                    padding: "0 0 2px",
                    color: lang === l.code ? C.ink : C.muted,
                    fontWeight: lang === l.code ? 600 : 400,
                    borderBottom: lang === l.code ? `1.5px solid ${C.gold}` : "1.5px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ height: 1, background: C.hairline, marginTop: 16 }} />
        </header>

        <main>
          <section style={{ padding: "40px 0 0" }}>
            <Link to="/" style={{ ...sans, fontSize: 12.5, color: C.muted, textDecoration: "none" }}>
              {rtl ? "→" : "←"} {t.backLink}
            </Link>
            <h2 style={{ ...serif, fontSize: 36, fontWeight: 400, color: C.ink, lineHeight: 1.1, marginTop: 22 }}>
              {t.evLabel}
            </h2>
            <p style={{ ...sans, fontSize: 12, color: C.muted, marginTop: 10 }}>{t.evLangNote}</p>

            <div style={{ marginTop: 26 }}>
              <label htmlFor="district-filter" style={{ ...caps, fontSize: 10, color: C.muted, display: "block", marginBottom: 8 }}>
                {t.pickerLabel}
              </label>
              <select
                id="district-filter"
                value={filter === null ? "all" : String(filter)}
                onChange={(e) => {
                  const v = e.target.value === "all" ? null : Number(e.target.value);
                  setFilter(v);
                  setDayFilter(null);
                  if (window.umami) window.umami.track("events_filter", { district: v === null ? "all" : v });
                }}
                style={{
                  ...sans,
                  fontSize: 15,
                  padding: "12px 14px",
                  minHeight: 44,
                  width: "100%",
                  maxWidth: 340,
                  border: `1px solid ${C.hairline}`,
                  background: "#fff",
                  color: C.ink,
                  borderRadius: 0,
                  WebkitAppearance: "none",
                }}
              >
                <option value="all">{t.evAll}</option>
                {ACTIVE_DISTRICTS.map((id) => {
                  const dd = DISTRICTS.find((x) => x.id === id);
                  return (
                    <option key={id} value={id}>
                      {t.districtFmt.replace("{n}", id)} — {dd.supervisor}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 34, paddingBottom: 8, borderBottom: `1px solid ${C.hairline}` }}>
              <MonthGrid year={thisY} month={thisM} eventDates={eventDates} selected={dayFilter} onSelect={setDayFilter} lang={lang} />
              <MonthGrid year={nextY} month={nextM} eventDates={eventDates} selected={dayFilter} onSelect={setDayFilter} lang={lang} />
            </div>

            {dayFilter && (
              <button
                onClick={() => setDayFilter(null)}
                style={{ ...caps, fontSize: 10.5, color: C.gold, background: "transparent", border: `1px solid ${C.goldLine}`, padding: "8px 14px", marginTop: 18, cursor: "pointer" }}
              >
                {t.evAllDates} {rtl ? "←" : "→"}
              </button>
            )}

            {events.length === 0 ? (
              <p style={{ ...serif, fontStyle: "italic", fontSize: 16, color: C.muted, marginTop: 40, lineHeight: 1.6 }}>
                {t.evNone}
              </p>
            ) : (
              <div style={{ marginTop: 30 }}>
                {Object.keys(byDate).map((date) => (
                  <div key={date} style={{ marginBottom: 34 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, borderBottom: `1px solid ${C.hairline}`, paddingBottom: 8 }}>
                      <span style={{ ...caps, fontSize: 10.5, color: C.gold }}>{dateHeading(date, lang)}</span>
                      <span style={{ ...sans, fontSize: 12, color: C.muted }}>{relativeLabel(date, lang)}</span>
                    </div>
                    {byDate[date].map((e) => (
                      <a
                        key={e.id}
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { if (window.umami) window.umami.track("event_tap", { event: e.id, district: e.district }); }}
                        style={{ display: "flex", gap: 16, textDecoration: "none", padding: "16px 0", borderBottom: `1px solid ${C.hairline}` }}
                      >
                        <DateLeaf iso={e.date} lang={lang} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ ...serif, fontSize: 17.5, color: C.ink }}>{e.title}</span>
                            <span style={{ ...caps, fontSize: 9.5, color: C.muted, alignSelf: "center" }}>
                              {t.districtFmt.replace("{n}", e.district)}
                            </span>
                          </div>
                          {e.desc && e.desc[lang] && (
                            <div style={{ ...serif, fontStyle: "italic", fontSize: 14.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
                              {e.desc[lang]}
                            </div>
                          )}
                          <div dir="ltr" style={{ ...sans, fontSize: 13, color: C.muted, marginTop: 6, unicodeBidi: "isolate", textAlign: rtl ? "right" : "left" }}>
                            {e.time} · {e.venue}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer style={{ paddingTop: 48, textAlign: "center" }}>
          <p style={{ ...sans, fontSize: 11, color: C.muted }}>{t.privacy}</p>
        </footer>
      </div>
    </div>
  );
}
