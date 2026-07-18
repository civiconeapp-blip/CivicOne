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

function dateHeading(iso, lang) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(LOCALES[lang] || "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function EventsCalendar({ lang, setLang }) {
  const t = T[lang];
  const rtl = lang === "ar";
  const [params] = useSearchParams();
  const initial = isActive(params.get("d")) ? Number(params.get("d")) : null;
  const [filter, setFilter] = useState(initial); // null = all

  const events = upcomingEvents(filter);
  const byDate = events.reduce((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

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

            {events.length === 0 ? (
              <p style={{ ...serif, fontStyle: "italic", fontSize: 16, color: C.muted, marginTop: 40, lineHeight: 1.6 }}>
                {t.evNone}
              </p>
            ) : (
              <div style={{ marginTop: 36 }}>
                {Object.keys(byDate).map((date) => (
                  <div key={date} style={{ marginBottom: 34 }}>
                    <div style={{ ...caps, fontSize: 10.5, color: C.gold, borderBottom: `1px solid ${C.hairline}`, paddingBottom: 8 }}>
                      {dateHeading(date, lang)}
                    </div>
                    {byDate[date].map((e) => (
                      <a
                        key={e.id}
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { if (window.umami) window.umami.track("event_tap", { event: e.id, district: e.district }); }}
                        style={{ display: "block", textDecoration: "none", padding: "16px 0", borderBottom: `1px solid ${C.hairline}` }}
                      >
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
