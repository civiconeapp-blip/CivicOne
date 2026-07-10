import { useState, useEffect } from "react";
import { LANGS, T } from "./i18n.js";

/* ---------- Design tokens: "City Briefing" system ---------- */
const C = {
  paper: "#F7F5F0",
  ink: "#101826",
  navy: "#152B45",
  gold: "#A9863A",
  goldLine: "#C9B27A",
  hairline: "#E4E0D6",
  muted: "#6B7280",
  open: "#A6431F",
  progress: "#8A6414",
  closed: "#2F6B4F",
  cream: "#F5F2EA",
};

const serif = { fontFamily: "'Newsreader', serif" };
const sans = { fontFamily: "'Public Sans', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const caps = {
  ...sans,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 600,
};

/* ---------- Live DataSF 311 (District 5) ---------- */
const DATASF_URL =
  "https://data.sfgov.org/resource/vw6y-z8j6.json" +
  "?$limit=6&$order=requested_datetime%20DESC&supervisor_district=5";

function statusKey(statusDescription) {
  const s = (statusDescription || "").toLowerCase();
  if (s.includes("closed")) return "closed";
  if (s.includes("progress") || s.includes("in process")) return "inProgress";
  return "open";
}

/* ---------- Static content ---------- */
const EVENTS = [
  { day: "11", name: "D5 Community Resource Fair", place: "Ella Hill Hutch Community Center" },
  { day: "19", name: "Fillmore Jazz on the Block", place: "Fillmore St between Eddy & Turk" },
  { day: "24", name: "Tenderloin Family Movie Night", place: "Boeddeker Park" },
];

const STATUS_COLOR = { open: C.open, inProgress: C.progress, closed: C.closed };

/* ---------- Pieces ---------- */
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: C.hairline }} />
    </div>
  );
}

function ServiceRow({ title, desc, rtl }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        textAlign: "start",
        padding: "20px 0",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 24,
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div>
        <span
          style={{
            ...serif,
            fontSize: 21,
            fontWeight: 500,
            color: C.ink,
            borderBottom: hover ? `1px solid ${C.gold}` : "1px solid transparent",
            transition: "border-color 0.2s",
          }}
        >
          {title}
        </span>
        <div style={{ ...sans, fontSize: 13, color: C.muted, marginTop: 5 }}>{desc}</div>
      </div>
      <span style={{ ...serif, color: hover ? C.gold : C.muted, fontSize: 20, transition: "color 0.2s" }}>
        {rtl ? "←" : "→"}
      </span>
    </button>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const [requests, setRequests] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const t = T[lang];
  const rtl = lang === "ar";

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = import.meta.env.VITE_DATASF_TOKEN;
        const url = token ? `${DATASF_URL}&$$app_token=${token}` : DATASF_URL;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`DataSF responded ${res.status}`);
        const rows = await res.json();
        if (cancelled) return;
        setRequests(
          rows.map((r) => ({
            id: r.service_request_id || "—",
            name: r.service_name || r.service_subtype || "311 request",
            loc: r.address || r.neighborhoods_sffind_boundaries || "District 5",
            status: statusKey(r.status_description),
            date: r.requested_datetime ? r.requested_datetime.slice(0, 10) : "",
          }))
        );
      } catch (e) {
        if (!cancelled) {
          setFetchError(true);
          setRequests([]);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fade = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ background: C.paper, minHeight: "100vh", ...sans }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <header style={{ paddingTop: 48, ...fade(0) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ ...caps, fontSize: 10.5, color: C.muted }}>{t.city}</span>
            <span style={{ ...caps, fontSize: 10.5, color: C.gold }}>{t.district}</span>
          </div>
          <div style={{ height: 1, background: C.ink, margin: "16px 0" }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{ ...serif, fontSize: 34, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
              Civic One
            </h1>
            <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
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

        <section style={{ padding: "56px 0", ...fade(0.15) }}>
          <h2 style={{ ...serif, fontSize: 44, fontWeight: 400, color: C.ink, lineHeight: 1.08, letterSpacing: "-0.015em" }}>
            {t.hello}
          </h2>
          <p style={{ ...serif, fontSize: 19, fontStyle: "italic", color: C.muted, marginTop: 16, lineHeight: 1.55, maxWidth: 460 }}>
            {t.intro}
          </p>
          <div style={{ height: 1, width: 56, background: C.goldLine, marginTop: 40 }} />
        </section>

        <section style={{ paddingBottom: 64, ...fade(0.3) }}>
          <SectionLabel>{t.servicesLabel}</SectionLabel>
          <div style={{ borderTop: `1px solid ${C.hairline}` }}>
            <ServiceRow title={t.s1} desc={t.s1d} rtl={rtl} />
            <ServiceRow title={t.s2} desc={t.s2d} rtl={rtl} />
            <ServiceRow title={t.s3} desc={t.s3d} rtl={rtl} />
            <ServiceRow title={t.s4} desc={t.s4d} rtl={rtl} />
          </div>
        </section>

        <section style={{ paddingBottom: 64, ...fade(0.4) }}>
          <SectionLabel>{t.ledgerLabel}</SectionLabel>
          <p style={{ ...sans, fontSize: 11.5, color: C.muted, margin: "-16px 0 20px" }}>
            {fetchError ? t.ledgerError : t.ledgerNote}
          </p>

          {requests === null && (
            <p style={{ ...serif, fontStyle: "italic", fontSize: 15, color: C.muted }}>{t.loading}</p>
          )}

          {requests && requests.length > 0 && (
            <div style={{ borderTop: `1px solid ${C.hairline}` }}>
              {requests.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "16px 0",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    borderBottom: `1px solid ${C.hairline}`,
                  }}
                >
                  <div>
                    <span style={{ ...sans, fontSize: 15, fontWeight: 600, color: C.ink }}>{r.name}</span>
                    <div style={{ ...sans, fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.loc}</div>
                  </div>
                  <div style={{ textAlign: "end" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: STATUS_COLOR[r.status],
                          display: "inline-block",
                        }}
                      />
                      <span style={{ ...sans, fontSize: 12, fontWeight: 600, color: STATUS_COLOR[r.status] }}>
                        {t[r.status]}
                      </span>
                    </div>
                    <div style={{ ...mono, fontSize: 11, color: C.muted, marginTop: 4 }}>
                      № {r.id} · {r.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ paddingBottom: 64, ...fade(0.5) }}>
          <SectionLabel>{t.eventsLabel}</SectionLabel>
          {EVENTS.map((e, i) => (
            <div
              key={e.name}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr",
                gap: 24,
                padding: "20px 0",
                borderBottom: i < EVENTS.length - 1 ? `1px solid ${C.hairline}` : "none",
              }}
            >
              <div>
                <div style={{ ...serif, fontSize: 30, fontWeight: 500, color: C.ink, lineHeight: 1 }}>{e.day}</div>
                <div style={{ ...caps, fontSize: 9.5, color: C.gold, marginTop: 4 }}>{t.jul}</div>
              </div>
              <div>
                <div style={{ ...serif, fontSize: 20, fontWeight: 500, color: C.ink }}>{e.name}</div>
                <div style={{ ...sans, fontSize: 13, color: C.muted, marginTop: 4 }}>{e.place}</div>
                <div style={{ ...caps, fontSize: 9.5, color: C.closed, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: C.closed, display: "inline-block" }} />
                  {t.verified}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section style={fade(0.6)}>
          <div style={{ background: C.navy, padding: "40px 36px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, insetInlineStart: 0, width: "100%", height: 3, background: C.gold }} />
            <span style={{ ...caps, fontSize: 10.5, color: C.goldLine }}>{t.districtLabel}</span>
            <h3 style={{ ...serif, fontSize: 30, color: C.cream, fontWeight: 500, marginTop: 10 }}>
              {t.supervisor} Bilal Mahmood
            </h3>
            <p style={{ ...sans, fontSize: 12.5, color: "rgba(245,242,234,0.65)", marginTop: 8 }}>{t.hours}</p>
            <p style={{ ...serif, fontStyle: "italic", fontSize: 14.5, color: "rgba(245,242,234,0.6)", marginTop: 24 }}>
              {t.hoods}
            </p>
          </div>
        </section>

        <footer style={{ paddingTop: 48, textAlign: "center", ...fade(0.7) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
            <span style={{ ...caps, fontSize: 9.5, color: C.muted }}>{t.footer}</span>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
          </div>
        </footer>
      </div>
    </div>
  );
}
