import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getProgram, getPrograms } from "./programs.js";
import { T, LANGS } from "./i18n.js";

/* Local design tokens (matches App.jsx "City Briefing" system) */
const C = {
  paper: "#F7F5F0",
  ink: "#101826",
  navy: "#152B45",
  gold: "#A9863A",
  goldLine: "#C9B27A",
  hairline: "#E4E0D6",
  muted: "#6B7280",
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

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: C.hairline }} />
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: "22px 0",
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div
        style={{
          ...serif,
          fontSize: 22,
          color: C.gold,
          fontWeight: 500,
          flexShrink: 0,
          width: 32,
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div>
        <div style={{ ...serif, fontSize: 19, fontWeight: 500, color: C.ink }}>{title}</div>
        <div style={{ ...sans, fontSize: 14, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

/* ---------- The full guide page for one program ---------- */
function ProgramGuideView({ program, lang, setLang }) {
  const t = T[lang];
  const rtl = lang === "ar";
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const fade = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ background: C.paper, minHeight: "100vh", ...sans }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <header style={{ paddingTop: 48, ...fade(0) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link
              to="/"
              style={{ ...caps, fontSize: 10.5, color: C.muted, textDecoration: "none" }}
            >
              {rtl ? "→" : "←"} Civic One
            </Link>
            <span style={{ ...caps, fontSize: 10.5, color: C.gold }}>{t.guideTag}</span>
          </div>
          <div style={{ height: 1, background: C.ink, margin: "16px 0" }} />
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
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
          <h1 style={{ ...serif, fontSize: 34, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
            {program.title}
          </h1>
          <div style={{ height: 1, background: C.hairline, marginTop: 16 }} />
        </header>

        <section style={{ padding: "40px 0 8px", ...fade(0.1) }}>
          <p style={{ ...serif, fontSize: 19, fontStyle: "italic", color: C.muted, lineHeight: 1.55 }}>
            {program.intro}
          </p>
        </section>

        <section style={{ padding: "32px 0", ...fade(0.18) }}>
          <div style={{ background: C.cream, border: `1px solid ${C.hairline}`, padding: "20px 24px" }}>
            <div style={{ ...caps, fontSize: 10.5, color: C.gold, marginBottom: 8 }}>
              {t.guideBefore}
            </div>
            <p style={{ ...sans, fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}>
              {program.eligibilityNote}
            </p>
          </div>
        </section>

        <section style={{ paddingBottom: 48, ...fade(0.26) }}>
          <SectionLabel>{t.guideNeed}</SectionLabel>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {program.documents.map((doc, i) => (
              <li
                key={i}
                style={{
                  ...sans,
                  fontSize: 14.5,
                  color: C.ink,
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.hairline}`,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ color: C.gold }}>—</span>
                {doc}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ paddingBottom: 48, ...fade(0.34) }}>
          <SectionLabel>{t.guideSteps}</SectionLabel>
          <div style={{ borderTop: `1px solid ${C.hairline}` }}>
            {program.steps.map((s, i) => (
              <Step key={i} n={i + 1} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        <section style={fade(0.42)}>
          <div style={{ background: C.navy, padding: "36px 32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: C.gold }} />
            <span style={{ ...caps, fontSize: 10.5, color: C.goldLine }}>{t.guideReady}</span>
            <p style={{ ...sans, fontSize: 13, color: "rgba(245,242,234,0.75)", marginTop: 12, lineHeight: 1.6 }}>
              {t.guideReadyNote}
            </p>
            <a
              href={program.officialHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...sans,
                fontSize: 14,
                fontWeight: 600,
                color: C.navy,
                background: C.goldLine,
                display: "inline-block",
                marginTop: 20,
                padding: "12px 20px",
                textDecoration: "none",
              }}
            >
              {program.officialLabel} {rtl ? "←" : "→"}
            </a>
            {program.phone && (
              <div style={{ ...mono, fontSize: 12, color: "rgba(245,242,234,0.65)", marginTop: 20 }}>
                {program.phoneLabel}: {program.phone}
              </div>
            )}
          </div>
        </section>

        <section style={{ paddingTop: 48, ...fade(0.5) }}>
          <SectionLabel>{t.guideOther}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {getPrograms(lang).filter((p) => p.slug !== program.slug).map((p) => (
              <Link
                key={p.slug}
                to={"/apply/" + p.slug}
                style={{
                  textDecoration: "none",
                  border: `1px solid ${C.hairline}`,
                  padding: "14px 14px",
                  minHeight: 44,
                  display: "block",
                }}
              >
                <div style={{ ...serif, fontSize: 15.5, color: C.ink }}>{p.navLabel}</div>
                <div style={{ ...sans, fontSize: 11.5, color: C.muted, marginTop: 4 }}>{p.navDesc}</div>
              </Link>
            ))}
          </div>
        </section>

        <footer style={{ paddingTop: 48, textAlign: "center", ...fade(0.55) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
            <span style={{ ...caps, fontSize: 9.5, color: C.muted }}>
              {t.footer}
            </span>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Route wrapper: reads :slug, guards invalid ---------- */
export default function ProgramGuideRoute({ lang, setLang }) {
  const { slug } = useParams();
  const program = getProgram(slug, lang);
  if (!program) return <Navigate to="/" replace />;
  return <ProgramGuideView key={program.slug} program={program} lang={lang} setLang={setLang} />;
}
