import { useState, useEffect } from "react";
import { LANGS, T } from "./i18n.js";
import ReportForm from "./ReportForm.jsx";


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

const STATUS_COLOR = { open: C.open, inProgress: C.progress, closed: C.closed };

/* ---------- Official service destinations ---------- */
const LINKS = {
  s1: "https://www.sf311.org",
  s2: "https://www.sfmta.com",
  s3: "https://www.getcalfresh.org",
  s4: "https://housing.sfgov.org",
  s5: "https://www.sfmta.com/getting-around/accessibility/shop-round",
  s6: "https://www.sfmta.com/getting-around/accessibility/paratransit/essential-trip-card",
  s7: "https://btwcsc.org/programs/",
};

/* ---------- Bay Bridge etching ---------- */
function BayBridge() {
  return (
    <div aria-hidden="true" style={{ margin: "40px 0 0" }}>
      <svg viewBox="0 0 800 110" style={{ width: "100%", display: "block" }}>
        {/* deck */}
        <line x1="0" y1="88" x2="800" y2="88" stroke={C.ink} strokeWidth="2" />
        <line x1="0" y1="94" x2="800" y2="94" stroke={C.ink} strokeWidth="0.75" />
        {/* towers */}
        {[250, 550].map((tx) => (
          <g key={tx} stroke={C.ink} strokeWidth="2" fill="none">
            <line x1={tx - 7} y1="18" x2={tx - 7} y2="88" />
            <line x1={tx + 7} y1="18" x2={tx + 7} y2="88" />
            <line x1={tx - 10} y1="18" x2={tx + 10} y2="18" strokeWidth="3" />
            <line x1={tx - 7} y1="36" x2={tx + 7} y2="36" strokeWidth="1.25" />
            <line x1={tx - 7} y1="58" x2={tx + 7} y2="58" strokeWidth="1.25" />
          </g>
        ))}
        {/* cables */}
        <g stroke={C.gold} strokeWidth="1.5" fill="none">
          <path d="M0,52 Q120,86 243,20" />
          <path d="M257,20 Q400,82 543,20" />
          <path d="M557,20 Q680,86 800,52" />
        </g>
        {/* suspenders, center span */}
        <g stroke={C.gold} strokeWidth="0.75">
          <line x1="325" y1="44" x2="325" y2="88" />
          <line x1="400" y1="51" x2="400" y2="88" />
          <line x1="475" y1="44" x2="475" y2="88" />
        </g>
      </svg>
      <div style={{ ...caps, fontSize: 9, color: C.muted, textAlign: "center", marginTop: 10, letterSpacing: "0.22em" }}>
        San Francisco – Oakland Bay Bridge
      </div>
    </div>
  );
}

/* ---------- Pieces ---------- */
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: C.hairline }} />
    </div>
  );
}
function ServiceRow({ title, desc, rtl, href }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
            onClick={() => { if (window.umami) window.umami.track("service_tap", { service: href }); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: "none",
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
    </a>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const [requests, setRequests] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [pulse, setPulse] = useState(null);

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

  useEffect(() => {
    let cancelled = false;
    async function loadPulse() {
      try {
        const since = new Date(Date.now() - 7 * 24 * 3600 * 1000)
          .toISOString()
          .slice(0, 19);
                const params = new URLSearchParams({
          $select: "service_name,count(*) as n",
          $where: "supervisor_district=5 AND requested_datetime > '" + since + "'",
          $group: "service_name",
          $order: "n DESC",
          $limit: "50",
        });
        const token = import.meta.env.VITE_DATASF_TOKEN;
        if (token) params.set("$$app_token", token);
        const res = await fetch(
          "https://data.sfgov.org/resource/vw6y-z8j6.json?" + params.toString()
        );
        if (!res.ok) return;
        const rows = await res.json();
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        const total = rows.reduce((s, r) => s + Number(r.n || 0), 0);
        if (total > 0) setPulse({ n: total, c: rows[0].service_name });
      } catch (e) {}
    }
    loadPulse();
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

        <section style={{ padding: "56px 0", ...fade(0.15) }}>
          <h2 style={{ ...serif, fontSize: 44, fontWeight: 400, color: C.ink, lineHeight: 1.08, letterSpacing: "-0.015em" }}>
            {t.hello}
          </h2>
          <p style={{ ...serif, fontSize: 19, fontStyle: "italic", color: C.muted, marginTop: 16, lineHeight: 1.55, maxWidth: 460 }}>
            {t.intro}
          </p>
          <BayBridge />
        </section>

        <section style={{ paddingBottom: 64, ...fade(0.3) }}>
          <SectionLabel>{t.servicesLabel}</SectionLabel>
          <div style={{ borderTop: `1px solid ${C.hairline}` }}>
            <ServiceRow title={t.s1} desc={t.s1d} rtl={rtl} href={LINKS.s1} />
            <ServiceRow title={t.s2} desc={t.s2d} rtl={rtl} href={LINKS.s2} />
            <ServiceRow title={t.s3} desc={t.s3d} rtl={rtl} href={LINKS.s3} />
            <ServiceRow title={t.s4} desc={t.s4d} rtl={rtl} href={LINKS.s4} />
            <ServiceRow title={t.s5} desc={t.s5d} rtl={rtl} href={LINKS.s5} />
            <ServiceRow title={t.s6} desc={t.s6d} rtl={rtl} href={LINKS.s6} />
            <ServiceRow title={t.s7} desc={t.s7d} rtl={rtl} href={LINKS.s7} />
          </div>
        </section>

               <ReportForm t={t} />

 <section style={{ paddingBottom: 64, ...fade(0.4) }}>
          <SectionLabel>{t.ledgerLabel}</SectionLabel>
          <p style={{ ...sans, fontSize: 11.5, color: C.muted, margin: "-16px 0 20px" }}>
            {fetchError ? t.ledgerError : t.ledgerNote}
          </p>
             {pulse && (
            <p dir="auto" style={{ ...serif, fontSize: 17, fontStyle: "italic", color: C.ink, margin: "0 0 22px" }}>
              {t.pulse.replace("{n}", pulse.n.toLocaleString()).replace("{c}", pulse.c)}
            </p>
          )}

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
