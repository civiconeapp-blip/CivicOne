import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import { LANGS, T } from "./i18n.js";
import ReportForm from "./ReportForm.jsx";
import { DISTRICTS, getDistrict, isActive } from "./districts.js";
import { translateCategory } from "./cat311.js";
import ProgramGuideRoute from "./ProgramGuide.jsx";
import EventsCalendar from "./EventsCalendar.jsx";
import { upcomingEvents } from "./events.js";
import { SiteHeader, NavLink, CivicMark, HeroBlock, HelpBand, SkylineStrip, ActionButton, Reveal, LiveDot, StatusChip, ServiceCard, ICONS } from "./civic.jsx";

/* ---------- Phase 2: device-side personalization (no accounts, nothing sent to any server) ---------- */
const LANG_KEY = "civicone.lang";
const DISTRICT_KEY = "civicone.district";
const LANG_CODES = LANGS.map((l) => l.code);

// <html lang> values. Chinese ships Traditional (zh-Hant) everywhere.
const HTML_LANG = { en: "en", es: "es", zh: "zh-Hant", vi: "vi", ar: "ar" };

// First-visit guess from the browser's preferred languages. Maps only to the
// five supported codes; defaults to English. Never overrides a saved choice —
// that check lives in getInitialLang().
function guessLang() {
  const list =
    (typeof navigator !== "undefined" &&
      (navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language])) ||
    [];
  for (const raw of list) {
    const primary = String(raw || "").toLowerCase().split("-")[0];
    if (LANG_CODES.includes(primary)) return primary;
  }
  return "en";
}

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && LANG_CODES.includes(saved)) return saved; // saved choice always wins
  } catch (e) {}
  return guessLang();
}

// A stored district id, but only if it is still an active district.
function getStoredDistrict() {
  try {
    const raw = localStorage.getItem(DISTRICT_KEY);
    const n = Number(raw);
    if (raw && Number.isInteger(n) && isActive(n)) return n;
  } catch (e) {}
  return null;
}

/* ---------- Design tokens: "City Briefing" system ---------- */
const C = {
  paper: "#FFFFFF",
  ink: "#1B1B1B",
  navy: "#14315C",
  gold: "#0A5CB8",
  goldLine: "#9CC3F0",
  hairline: "#D4DAE1",
  muted: "#4A5568",
  open: "#B50909",
  progress: "#C05600",
  closed: "#2E7D32",
  cream: "#EAF1FB",
};

const serif = { fontFamily: "'Rubik', system-ui, sans-serif" };
const sans = { fontFamily: "'Rubik', system-ui, sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const caps = {
  ...sans,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 600,
};

/* ---------- Live DataSF 311 (District 5) ---------- */
const datasfUrl = (districtId) =>
  "https://data.sfgov.org/resource/vw6y-z8j6.json" +
  "?$limit=6&$order=requested_datetime%20DESC&supervisor_district=" + districtId;

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
  s3: "https://www.getcalfresh.org",
  s4: "https://housing.sfgov.org",
  s7: "https://btwcsc.org/programs/",
};

/* ---------- Bay Bridge etching ---------- */
function BayBridge({ caption }) {
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
        {caption}
      </div>
    </div>
  );
}


/* ---------- Shared chrome ----------
   The utility bar and masthead every page opens with. Pulled out of the
   individual routes so the language switcher and the district badge can't
   drift apart between the district page and the 311 page. */
function LangNav({ lang, setLang, t, tone = "dark" }) {
  const on = tone === "dark" ? C.cream : C.ink;
  const off = tone === "dark" ? "rgba(245,242,234,0.6)" : C.muted;
  return (
    <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }} aria-label={t.langNav}>
      {LANGS.map((l) => (
        <button
          type="button"
          key={l.code}
          onClick={() => { setLang(l.code); if (window.umami) window.umami.track("language_switch", { lang: l.code }); }}
          aria-current={lang === l.code ? "true" : undefined}
          style={{
            ...sans,
            fontSize: 12,
            padding: "0 0 2px",
            color: lang === l.code ? on : off,
            fontWeight: lang === l.code ? 600 : 400,
            borderBottom: lang === l.code ? `1.5px solid ${C.gold}` : "1.5px solid transparent",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}


/* Wordmark lockup — CivicOne's own mark and name, never the City seal. */
function BrandLockup({ badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <CivicMark size={34} tone={C.gold} />
      <div style={{ minWidth: 0 }}>
        <div style={{ ...sans, fontSize: 23, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Civic One
        </div>
        {badge && <div style={{ ...sans, fontSize: 12, color: C.muted, marginTop: 1 }}>{badge}</div>}
      </div>
    </div>
  );
}

function Masthead({ t, lang, setLang, rtl, badge, districtId }) {
  return (
    <SiteHeader
      rtl={rtl}
      brand={
        <Link to={districtId ? "/district/" + districtId : "/"} style={{ textDecoration: "none" }}>
          <BrandLockup badge={badge} />
        </Link>
      }
      nav={
        districtId ? (
          <>
            <NavLink href={"/district/" + districtId + "/report"}>{t.r311Label}</NavLink>
            <NavLink href={"/district/" + districtId + "/events"}>{t.evLabel}</NavLink>
          </>
        ) : null
      }
    >
      <LangNav lang={lang} setLang={setLang} t={t} tone="light" />
    </SiteHeader>
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
function ServiceRow({ title, desc, rtl, href, to, icon, delay = 0 }) {
  const Tag = to ? Link : "a";
  const linkProps = to ? { to } : { href, target: "_blank", rel: "noopener noreferrer" };
  return (
    <Reveal delay={delay}>
      <Tag
        {...linkProps}
        onClick={() => { if (window.umami) window.umami.track("service_tap", { service: to || href }); }}
        style={{ textDecoration: "none", display: "block" }}
      >
        <ServiceCard title={title} desc={desc} icon={icon} rtl={rtl} />
      </Tag>
    </Reveal>
  );
}


/* ---------- District view (the full page for one district) ---------- */
function DistrictView({ district, lang, setLang }) {
  const d = district.id;
  const featured = !!district.featured;
  const [loaded, setLoaded] = useState(false);

  const t = T[lang];
  const rtl = lang === "ar";

  useEffect(() => {
    setLoaded(true);
  }, []);

  const fade = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ background: C.paper, minHeight: "100vh", ...sans }}>
      <Masthead t={t} lang={lang} setLang={setLang} rtl={rtl} districtId={d} badge={featured ? t.district : t.districtFmt.replace("{n}", d)} />

      <HeroBlock
        rtl={rtl}
        title={t.hello}
        subtitle={featured ? t.intro : t.introGeneric}
        tileLabel={t.skylineCaption}
      >
        <Link
          to={"/district/" + d + "/report"}
          onClick={() => { if (window.umami) window.umami.track("hero_cta", { district: d }); }}
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          <ActionButton label={t.s1} rtl={rtl} />
        </Link>
      </HeroBlock>

      <HelpBand
        rtl={rtl}
        title={t.helpTitle}
        body={t.r311What}
        art={<SkylineStrip label={t.skylineCaption} />}
      >
        <Link to={"/district/" + d + "/report"} style={{ textDecoration: "none", display: "inline-block" }}>
          <ActionButton label={t.s1} rtl={rtl} />
        </Link>
      </HelpBand>

      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}
      >


        <section style={{ paddingBottom: 64, ...fade(0.3) }}>
          <SectionLabel>{t.servicesLabel}</SectionLabel>
          <div style={{ display: "grid", gap: 12 }}>
            <ServiceRow title={t.s1} desc={t.s1d} rtl={rtl} icon={ICONS.report} to={"/district/" + d + "/report"} delay={0} />
            <ServiceRow title={t.s2} desc={t.s2d} rtl={rtl} icon={ICONS.transit} to="/apply/transit" delay={0.05} />
            <ServiceRow title={t.s3} desc={t.s3d} rtl={rtl} icon={ICONS.food} to="/apply/food" delay={0.1} />
            <ServiceRow title={t.s4} desc={t.s4d} rtl={rtl} icon={ICONS.housing} to="/apply/housing" delay={0.15} />
            <ServiceRow title={t.sHealth} desc={t.sHealthd} rtl={rtl} icon={ICONS.health} to="/apply/health" delay={0.2} />
            {featured && (
              <>
                <ServiceRow title={t.s5} desc={t.s5d} rtl={rtl} icon={ICONS.access} to="/apply/paratransit" delay={0.25} />
                <ServiceRow title={t.s7} desc={t.s7d} rtl={rtl} icon={ICONS.community} href={LINKS.s7} delay={0.3} />
              </>
            )}
          </div>
          {!featured && (
            <p style={{ ...serif, fontSize: 15, color: C.muted, marginTop: 20 }}>
              {t.programsSoon}
            </p>
          )}
        </section>

        <section style={fade(0.6)}>
          <div style={{ background: C.navy, padding: "40px 36px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, insetInlineStart: 0, width: "100%", height: 3, background: C.gold }} />
            <span style={{ ...caps, fontSize: 10.5, color: C.goldLine }}>{t.districtLabel}</span>
            <h3 style={{ ...serif, fontSize: 30, color: C.cream, fontWeight: 500, marginTop: 10 }}>
              {t.supervisor} {district.supervisor}
            </h3>
            {featured && (
              <p style={{ ...sans, fontSize: 12.5, color: "rgba(245,242,234,0.65)", marginTop: 8 }}>{t.hours}</p>
            )}
            {district.neighborhoods && (
              <p style={{ ...serif, fontSize: 14.5, color: "rgba(245,242,234,0.6)", marginTop: 24 }}>
                {district.neighborhoods}
              </p>
            )}
            <a
              href={district.page}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...sans, fontSize: 12.5, color: C.goldLine, display: "inline-block", marginTop: 20, textDecoration: "none", borderBottom: `1px solid ${C.goldLine}` }}
            >
              {t.officialPage} {rtl ? "←" : "→"}
            </a>
          </div>
        </section>

        <section style={{ paddingTop: 56, paddingBottom: 56, ...fade(0.5) }}>
          <SectionLabel>{t.evLabel}</SectionLabel>
          <Link
            to={"/district/" + d + "/events" }
            onClick={() => { if (window.umami) window.umami.track("events_open", { district: d }); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textDecoration: "none", padding: "18px 0", borderTop: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}` }}
          >
            <span style={{ ...serif, fontSize: 17.5, color: C.ink }}>
              {t.evView} ({upcomingEvents(d).length})
            </span>
            <span style={{ ...sans, fontSize: 16, color: C.gold }}>{rtl ? "←" : "→"}</span>
          </Link>
        </section>

        <section style={{ paddingTop: 56, ...fade(0.65) }}>
          <SectionLabel>{t.pickerLabel}</SectionLabel>
          <p style={{ ...sans, fontSize: 12.5, color: C.muted, margin: "-16px 0 20px" }}>{t.pickerHint}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {DISTRICTS.filter((dd) => isActive(dd.id)).map((dd) => (
              <Link
                key={dd.id}
                to={"/district/" + dd.id}
                onClick={() => {
                  try { localStorage.setItem(DISTRICT_KEY, String(dd.id)); } catch (e) {}
                  if (window.umami) window.umami.track("district_switch", { district: dd.id });
                }}
                style={{
                  textDecoration: "none",
                  border: `1px solid ${dd.id === d ? C.gold : C.hairline}`,
                  background: dd.id === d ? C.cream : "transparent",
                  padding: "14px 14px",
                  minHeight: 44,
                }}
              >
                <div style={{ ...caps, fontSize: 10, color: dd.id === d ? C.gold : C.muted }}>
                  {t.districtFmt.replace("{n}", dd.id)}
                </div>
                <div style={{ ...serif, fontSize: 15.5, color: C.ink, marginTop: 4 }}>{dd.supervisor}</div>
              </Link>
            ))}
          </div>
        </section>

        <footer style={{ paddingTop: 48, textAlign: "center", ...fade(0.7) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
            <span style={{ ...caps, fontSize: 9.5, color: C.muted }}>{t.footer}</span>
            <div style={{ height: 1, width: 40, background: C.goldLine }} />
                      </div>
          <p style={{ ...sans, fontSize: 10.5, color: C.muted, marginTop: 14 }}>{t.privacy}</p>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Dedicated 311 page ---------- */
function Report311Page({ district, lang, setLang }) {
  const d = district.id;
  const featured = !!district.featured;
  const t = T[lang];
  const rtl = lang === "ar";
  const [requests, setRequests] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [pulse, setPulse] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Live 311 ledger + weekly pulse (DataSF). Moved verbatim from the district
  // page in Phase 3a: "what neighbors are reporting," shown below the report action.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = import.meta.env.VITE_DATASF_TOKEN;
        const base = datasfUrl(d);
        const url = token ? `${base}&$$app_token=${token}` : base;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`DataSF responded ${res.status}`);
        const rows = await res.json();
        if (cancelled) return;
        setRequests(
          rows.map((r) => ({
            id: r.service_request_id || "—",
            name: r.service_name || r.service_subtype || t.requestFallback,
            loc: r.address || r.neighborhoods_sffind_boundaries || t.districtFmt.replace("{n}", d),
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
    setRequests(null);
    setFetchError(false);
    load();
    return () => {
      cancelled = true;
    };
  }, [d, lang]);

  useEffect(() => {
    let cancelled = false;
    async function loadPulse() {
      try {
        const since = new Date(Date.now() - 7 * 24 * 3600 * 1000)
          .toISOString()
          .slice(0, 19);
                const params = new URLSearchParams({
          $select: "service_name,count(*) as n",
          $where: "supervisor_district=" + d + " AND requested_datetime > '" + since + "'",
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
    setPulse(null);
    loadPulse();
    return () => {
      cancelled = true;
    };
  }, [d]);

  return (
    <div style={{ background: C.paper, minHeight: "100vh", ...sans }}>
      <Masthead t={t} lang={lang} setLang={setLang} rtl={rtl} districtId={d} badge={t.districtFmt.replace("{n}", d)} />
      <div dir={rtl ? "rtl" : "ltr"} style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <main>
          <section style={{ padding: "40px 0 44px" }}>
            <Link
              to={"/district/" + d}
              style={{ ...sans, fontSize: 12.5, color: C.muted, textDecoration: "none" }}
            >
              {rtl ? "→" : "←"} {t.r311Back}
            </Link>
            <h2 style={{ ...serif, fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1.1, marginTop: 22 }}>
              {t.r311Label}
            </h2>
            <p style={{ ...serif, fontSize: 17, color: C.muted, margin: "14px 0 0", lineHeight: 1.55, maxWidth: 520 }}>
              {t.r311What}
            </p>
          </section>
          <ReportForm t={t} lang={lang} />

          <section style={{ paddingTop: 8, paddingBottom: 24 }}>
            <SectionLabel>{t.ledgerLabel}</SectionLabel>
            <p style={{ ...sans, fontSize: 11.5, color: C.muted, margin: "-16px 0 20px", display: "flex", alignItems: "center", gap: 7 }}>
              {!fetchError && <LiveDot />}
              {fetchError ? t.ledgerError : featured ? t.ledgerNote : t.ledgerNoteAny.replace("{d}", d)}
            </p>
            {pulse && (
              <p dir="auto" style={{ ...serif, fontSize: 17, color: C.ink, margin: "0 0 22px" }}>
                {(featured ? t.pulse : t.pulseAny.replace("{d}", d)).replace("{n}", pulse.n.toLocaleString()).replace("{c}", translateCategory(pulse.c, lang))}
              </p>
            )}

            {requests === null && (
              <p style={{ ...serif, fontSize: 15, color: C.muted }}>{t.loading}</p>
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
                      <span style={{ ...sans, fontSize: 15, fontWeight: 600, color: C.ink }}>{translateCategory(r.name, lang)}</span>
                      <div style={{ ...sans, fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.loc}</div>
                    </div>
                    <div style={{ textAlign: "end" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <StatusChip label={t[r.status]} tone={r.status} />
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
        </main>

        <footer style={{ paddingTop: 32, textAlign: "center" }}>
          <p style={{ ...sans, fontSize: 11, color: C.muted }}>{t.privacy}</p>
        </footer>
      </div>
    </div>
  );
}

function DistrictEventsRoute({ lang, setLang }) {
  const { id } = useParams();
  const district = getDistrict(id);
  if (!district || !isActive(district.id)) return <Navigate to="/" replace />;
  return <EventsCalendar key={district.id} lang={lang} setLang={setLang} presetDistrict={district.id} />;
}

function Report311Route({ lang, setLang }) {
  const { id } = useParams();
  const district = getDistrict(id);
  if (!district || !isActive(district.id)) return <Navigate to="/" replace />;
  return <Report311Page key={district.id} district={district} lang={lang} setLang={setLang} />;
}

/* ---------- Route wrapper: reads :id, guards invalid ---------- */
function DistrictRoute({ lang, setLang }) {
  const { id } = useParams();
  const district = getDistrict(id);
  if (!district || !isActive(district.id)) return <Navigate to="/" replace />;
  return <DistrictView key={district.id} district={district} lang={lang} setLang={setLang} />;
}

/* ---------- Home route: honor a remembered district ---------- */
function HomeRoute({ lang, setLang }) {
  const stored = getStoredDistrict();
  // D5 is the home/flagship view already rendered at "/", so only redirect away
  // for a different remembered district. Home stays reachable via the picker.
  const remembered = stored && stored !== 5 ? stored : null;
  useEffect(() => {
    if (remembered && window.umami) {
      window.umami.track("district_remembered", { district: remembered });
    }
  }, [remembered]);
  if (remembered) return <Navigate to={"/district/" + remembered} replace />;
  return <DistrictView key="home" district={getDistrict(5)} lang={lang} setLang={setLang} />;
}

/* ---------- App: router + shared language state ---------- */
export default function App() {
  const [lang, setLangState] = useState(getInitialLang); // 2a/2b: saved choice, else guess
  const pendingScroll = useRef(null);

  const setLang = (code) => {
    pendingScroll.current = window.scrollY; // 2e: hold scroll across the switch
    setLangState(code);
    try { localStorage.setItem(LANG_KEY, code); } catch (e) {} // 2a: persist explicit choice
  };

  // 2d: keep <html lang>/<dir> in sync (screen-reader pronunciation + SEO).
  // Layout effect so Arabic (RTL) never flashes LTR on load.
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.lang = HTML_LANG[lang] || "en";
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // 2e: a language switch doesn't navigate, so restore the exact scroll offset
  // in case reflowed copy would otherwise shift the viewport.
  useLayoutEffect(() => {
    if (pendingScroll.current != null) {
      window.scrollTo(0, pendingScroll.current);
      pendingScroll.current = null;
    }
  }, [lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute lang={lang} setLang={setLang} />} />
        <Route path="/district/:id" element={<DistrictRoute lang={lang} setLang={setLang} />} />
        <Route path="/district/:id/report" element={<Report311Route lang={lang} setLang={setLang} />} />
        <Route path="/district/:id/events" element={<DistrictEventsRoute lang={lang} setLang={setLang} />} />
        <Route path="/apply/:slug" element={<ProgramGuideRoute lang={lang} setLang={setLang} />} />
        <Route path="/events" element={<EventsCalendar lang={lang} setLang={setLang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
