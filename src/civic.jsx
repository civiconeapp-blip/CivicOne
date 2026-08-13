/* Civic UI — the shared "gov portal" chrome and the code-drawn San Francisco
   artwork. Everything here is drawn in SVG/CSS rather than loaded as an image:
   no third-party requests (which would leak resident IPs and break the privacy
   promise in the footer), no licensing questions, and it stays sharp on any
   screen while costing a few KB on an old phone.

   Motion is a first-class concern in the other direction too: every animation
   in this file is switched off by the prefers-reduced-motion rule in
   styles.css. Residents who ask their device for less movement get a still
   page, not a negotiated one. */

import { useEffect, useRef, useState } from "react";

export const C = {
  paper: "#FFFFFF",
  ink: "#1B1B1B",
  navy: "#14315C",
  navySoft: "#1D4E96",
  gold: "#0A5CB8",
  goldLine: "#9CC3F0",
  hairline: "#D4DAE1",
  muted: "#4A5568",
  open: "#B50909",
  progress: "#C05600",
  closed: "#2E7D32",
  cream: "#EAF1FB",
};

const sans = { fontFamily: "'Rubik', system-ui, sans-serif" };
const serif = { fontFamily: "'Rubik', system-ui, sans-serif" };
const caps = {
  ...sans,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 600,
};

/* ---------- Reveal on scroll ----------
   Sections lift into place as they come into view, which is what makes a
   long civic page feel awake rather than dumped. Falls back to "just show
   it" wherever IntersectionObserver is missing, so content is never
   trapped behind a capability check. */
export function Reveal({ children, delay = 0, style, as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={shown ? "cv-reveal cv-reveal-in" : "cv-reveal"}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- Live indicator ----------
   A quiet pulse next to anything fed by live DataSF numbers, so "live"
   reads as a property of the data instead of a word in a caption. */
export function LiveDot({ color = C.closed, size = 7 }) {
  return (
    <span
      aria-hidden="true"
      className="cv-live"
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: "50%",
        display: "inline-block",
        flex: "none",
      }}
    />
  );
}

/* ---------- Status chip ----------
   311 statuses as chips rather than bare coloured words: scannable at a
   glance, and the tone carries meaning without relying on colour alone
   (the label is always spelled out). */
export function StatusChip({ label, tone = "open" }) {
  const color = { open: C.open, inProgress: C.progress, closed: C.closed }[tone] || C.muted;
  return (
    <span
      style={{
        ...caps,
        fontSize: 9,
        letterSpacing: "0.14em",
        color,
        border: `1px solid ${color}33`,
        background: `${color}0F`,
        padding: "4px 8px",
        borderRadius: 2,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }}
      />
      {label}
    </span>
  );
}

/* ---------- Civic mark ----------
   CivicOne's own mark — deliberately NOT a reproduction of the City's
   official seal. This app is built for residents, not published by the
   City, and dressing it in the real seal would misrepresent who is
   speaking. A compass rose reads civic and wayfinding without pretending
   to be a government emblem. */
export function CivicMark({ size = 34, tone = C.gold }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label="Civic One"
      style={{ display: "block", flex: "none" }}
    >
      <circle cx="24" cy="24" r="21" fill="none" stroke={tone} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="16.5" fill="none" stroke={tone} strokeWidth="0.75" opacity="0.6" />
      <path d="M24 7 L28 22 L24 41 L20 22 Z" fill={tone} opacity="0.92" />
      <path d="M7 24 L22 20 L41 24 L22 28 Z" fill={tone} opacity="0.5" />
      <circle cx="24" cy="24" r="2.4" fill={C.paper} stroke={tone} strokeWidth="1.25" />
    </svg>
  );
}

/* ---------- Site header ----------
   Modelled on SF.gov's masthead: white ground, mark + wordmark on the left,
   plain-language nav, language control on the right, a rule underneath.

   What it deliberately does NOT copy is the City seal, the "SF.gov"
   wordmark, or any "official website" claim. Matching a public design
   language is fine; wearing the City's identity on a site the City does
   not publish would tell residents something untrue about who is
   answering them. */
export function SiteHeader({ brand, nav, children, rtl }) {
  return (
    <header style={{ background: "#FFFFFF", borderBottom: `1px solid ${C.hairline}` }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {brand}
        {nav && (
          <nav style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
            {nav}
          </nav>
        )}
        <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" style={{ flex: "none" }}
               fill="none" stroke={C.ink} strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3.2 9.5h17.6M3.2 14.5h17.6M12 3a15 15 0 0 1 0 18A15 15 0 0 1 12 3Z" />
          </svg>
          {children}
        </div>
      </div>
    </header>
  );
}

export function NavLink({ children, ...rest }) {
  return (
    <a
      {...rest}
      className="cv-nav"
      style={{ ...sans, fontSize: 16, fontWeight: 500, color: C.ink, textDecoration: "none", whiteSpace: "nowrap" }}
    >
      {children}
    </a>
  );
}

/* ---------- Hero ----------
   SF.gov's shape: a big plain-language headline and a paragraph on the
   left, a rounded product tile on the right. Their tile is a photo-ish app
   badge; ours holds the drawn skyline, so the page still loads nothing
   from a third-party host. */
export function HeroBlock({ title, subtitle, tileLabel, children, rtl }) {
  return (
    <section style={{ background: "#FFFFFF" }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(30px, 4.5vw, 52px) 24px clamp(26px, 3.5vw, 40px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
          gap: "clamp(24px, 5vw, 60px)",
          alignItems: "center",
        }}
        className="cv-hero-grid"
      >
        <div>
          <h1
            className="cv-rise"
            style={{
              ...sans,
              fontSize: "clamp(34px, 6.6vw, 58px)",
              lineHeight: 1.08,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.02em",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="cv-rise"
              style={{
                ...sans,
                fontSize: "clamp(17px, 2.2vw, 21px)",
                color: C.ink,
                margin: "20px 0 0",
                lineHeight: 1.55,
                maxWidth: 640,
                animationDelay: "0.09s",
              }}
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className="cv-rise" style={{ marginTop: 28, animationDelay: "0.18s" }}>
              {children}
            </div>
          )}
        </div>
        <SkylineTile label={tileLabel} />
      </div>
    </section>
  );
}

/* The product tile: SF.gov puts a rounded app badge here. Ours is the city
   at dawn, drawn, with fog crossing it so the page has something alive in
   it from the first screen. */
export function SkylineTile({ label }) {
  return (
    <div
      className="cv-tile cv-rise"
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        aspectRatio: "1 / 1",
        maxWidth: 340,
        marginInlineStart: "auto",
        width: "100%",
        background: "linear-gradient(#0E3D7C 0%, #14509E 52%, #2F6FC0 100%)",
        boxShadow: "0 18px 44px -28px rgba(11, 45, 92, 0.85)",
        animationDelay: "0.12s",
      }}
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="cvTileSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C3468" stopOpacity="0" />
            <stop offset="100%" stopColor="#8FC2F5" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="cvTileFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="cvTileSoft" x="-30%" y="-260%" width="160%" height="620%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <rect x="0" y="180" width="400" height="220" fill="url(#cvTileSky)" />
        <circle cx="300" cy="120" r="34" fill="#FFC15E" opacity="0.9" className="cv-sun" />

        {/* Golden Gate towers — the one silhouette everyone reads instantly */}
        <g stroke="#F26722" strokeWidth="7" fill="none" strokeLinecap="square">
          <path d="M78 300 V150 M78 150 h34 M78 178 h34 M78 206 h34" />
          <path d="M112 300 V150" />
          <path d="M258 300 V150 M258 150 h34 M258 178 h34 M258 206 h34" />
          <path d="M292 300 V150" />
        </g>
        <g stroke="#F26722" strokeWidth="6" fill="none">
          <path d="M0 232 Q40 210 78 158" />
          <path d="M112 158 Q186 268 258 158" />
          <path d="M292 158 Q346 212 400 232" />
        </g>
        <rect x="0" y="296" width="400" height="9" fill="#F26722" />

        {/* Bay + fog */}
        <rect x="0" y="305" width="400" height="95" fill="#0B2F5E" opacity="0.55" />
        <g filter="url(#cvTileSoft)">
          <ellipse className="cv-fog cv-fog-1" cx="140" cy="272" rx="210" ry="15" fill="url(#cvTileFog)" />
          <ellipse className="cv-fog cv-fog-2" cx="280" cy="292" rx="240" ry="12" fill="url(#cvTileFog)" />
        </g>
      </svg>
    </div>
  );
}


/* Wide skyline for the pale-blue band — the reference uses a photograph of
   the city here; this is the drawn equivalent so the page still pulls
   nothing from a third-party host. */
export function SkylineStrip({ label }) {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        background: "linear-gradient(#BBD9F7 0%, #DCEBFB 62%, #EEF5FD 100%)",
        border: `1px solid ${C.hairline}`,
        lineHeight: 0,
      }}
    >
      <svg viewBox="0 0 520 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}
           style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="cvStripFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="cvStripSoft" x="-30%" y="-300%" width="160%" height="700%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* clouds */}
        <g fill="#FFFFFF" opacity="0.85">
          <ellipse cx="90" cy="58" rx="46" ry="17" />
          <ellipse cx="126" cy="50" rx="32" ry="14" />
          <ellipse cx="392" cy="44" rx="52" ry="16" />
          <ellipse cx="352" cy="52" rx="30" ry="12" />
        </g>

        {/* hills */}
        <path d="M0 236 L70 196 L118 222 L166 186 L232 236 Z" fill="#7FA8CF" opacity="0.5" />

        {/* skyline */}
        <g fill="#2F5E93">
          <rect x="150" y="188" width="24" height="60" />
          <rect x="178" y="170" width="18" height="78" />
          <path d="M214 248 L230 128 L246 248 Z" />
          <rect x="228.5" y="112" width="3" height="18" />
          <rect x="256" y="182" width="22" height="66" />
          <path d="M292 248 L292 118 Q302 100 312 118 L312 248 Z" />
          <rect x="322" y="176" width="20" height="72" />
          <rect x="348" y="196" width="18" height="52" />
          <rect x="392" y="186" width="16" height="62" />
          <path d="M392 186 L400 172 L408 186 Z" />
          <rect x="376" y="212" width="48" height="36" />
          <rect x="436" y="180" width="22" height="68" />
          <rect x="464" y="200" width="18" height="48" />
        </g>

        {/* bay */}
        <rect x="0" y="248" width="520" height="52" fill="#69A3D8" opacity="0.45" />
        <g filter="url(#cvStripSoft)">
          <ellipse className="cv-fog cv-fog-1" cx="150" cy="228" rx="220" ry="12" fill="url(#cvStripFog)" />
          <ellipse className="cv-fog cv-fog-2" cx="380" cy="244" rx="240" ry="10" fill="url(#cvStripFog)" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- Pale-blue band ----------
   The "We're here to help" panel from the reference: tinted background,
   artwork on one side, heading + copy + action on the other. */
export function HelpBand({ title, body, art, children, rtl }) {
  return (
    <section style={{ background: C.cream }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(28px, 5vw, 52px) 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "clamp(22px, 4vw, 48px)",
          alignItems: "center",
        }}
        className="cv-hero-grid"
      >
        {art}
        <div>
          <h2 style={{ ...sans, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: C.navy, margin: 0, lineHeight: 1.15 }}>
            {title}
          </h2>
          {body && (
            <p style={{ ...sans, fontSize: 17, color: C.ink, margin: "16px 0 0", lineHeight: 1.6 }}>{body}</p>
          )}
          {children && <div style={{ marginTop: 24 }}>{children}</div>}
        </div>
      </div>
    </section>
  );
}

/* Primary action, SF.gov style: solid blue, square-ish, no ornament. */
export function ActionButton({ label, rtl }) {
  return (
    <span className="cv-btn" style={{ ...sans, fontSize: 17, fontWeight: 500 }}>
      {label}
      <span aria-hidden="true" className="cv-btn-arrow">{rtl ? "←" : "→"}</span>
    </span>
  );
}

/* ---------- Service card ----------
   Cards instead of a plain list: a bigger tap target for a resident on a
   phone, room for an icon that survives translation into five languages,
   and a hover/press state so the thing you're about to open answers back. */
export function ServiceCard({ title, desc, icon, rtl, onClick, children }) {
  return (
    <div className="cv-card" onClick={onClick} style={{ borderColor: C.hairline }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span
          aria-hidden="true"
          className="cv-card-icon"
          style={{
            width: 38,
            height: 38,
            border: `1px solid ${C.goldLine}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            background: C.cream,
          }}
        >
          {icon}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span
            className="cv-card-title"
            style={{ ...serif, fontSize: 20, fontWeight: 500, color: C.ink, display: "block", lineHeight: 1.25 }}
          >
            {title}
          </span>
          <span style={{ ...sans, fontSize: 13, color: C.muted, marginTop: 5, display: "block", lineHeight: 1.5 }}>
            {desc}
          </span>
          {children}
        </span>
        <span className="cv-card-arrow" style={{ ...serif, color: C.gold, fontSize: 20, flex: "none" }}>
          {rtl ? "←" : "→"}
        </span>
      </div>
    </div>
  );
}

/* Line-art glyphs for the service cards. Stroked, not filled, so they sit
   with the etched skyline rather than looking like app-store icons. */
const glyph = { fill: "none", stroke: C.gold, strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

export const ICONS = {
  report: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  ),
  transit: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <rect x="5" y="3.5" width="14" height="13" rx="2.5" />
      <path d="M5 11h14M8.5 20l1.5-3.5M15.5 20 14 16.5" />
      <circle cx="8.8" cy="13.8" r="0.9" fill={C.gold} stroke="none" />
      <circle cx="15.2" cy="13.8" r="0.9" fill={C.gold} stroke="none" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <path d="M5.6 8h12.8l-1.1 11.7a1.6 1.6 0 0 1-1.6 1.4H8.3a1.6 1.6 0 0 1-1.6-1.4Z" />
      <path d="M9.2 8V6.3a2.8 2.8 0 0 1 5.6 0V8" />
    </svg>
  ),
  housing: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <path d="M12 20.5S4 15.6 4 9.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.7-8 10.6-8 10.6Z" />
      <path d="M9.4 12h1.8l.8-1.8 1 3 .8-1.2h1.8" />
    </svg>
  ),
  access: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <circle cx="12" cy="4.6" r="1.8" />
      <path d="M8.5 8.5h7M12 8.5V14h4.5M12 14a4.8 4.8 0 1 0 4 4.6" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" width="19" height="19" {...glyph}>
      <circle cx="8.5" cy="8" r="2.6" />
      <circle cx="16" cy="9.5" r="2.1" />
      <path d="M3.5 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8M15 14.4c2.5 0 4.5 1.7 4.5 4.2" />
    </svg>
  ),
};
