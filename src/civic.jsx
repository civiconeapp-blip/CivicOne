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
  paper: "#F7F5F0",
  ink: "#101826",
  navy: "#152B45",
  navySoft: "#24405F",
  gold: "#A9863A",
  goldLine: "#C9B27A",
  hairline: "#E4E0D6",
  muted: "#6B7280",
  open: "#A6431F",
  progress: "#8A6414",
  closed: "#2F6B4F",
  cream: "#F5F2EA",
};

const sans = { fontFamily: "'Public Sans', sans-serif" };
const serif = { fontFamily: "'Newsreader', serif" };
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

/* ---------- Government utility bar ----------
   The thin bar every serious government service opens with. It carries the
   jurisdiction and the language switcher, which is exactly what a resident
   who doesn't read English needs first.

   Note the wording: this says the service is FOR San Francisco residents,
   never that it is an official City website. CivicOne isn't published by
   the City, and a bar claiming otherwise would be impersonation — the one
   govtech convention worth breaking. */
export function GovBar({ jurisdiction, children, rtl }) {
  return (
    <div style={{ background: C.navy, borderBottom: `3px solid ${C.gold}` }}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "9px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            ...caps,
            fontSize: 9.5,
            letterSpacing: "0.16em",
            color: "rgba(245,242,234,0.82)",
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" style={{ flex: "none" }}>
            <path d="M8 1 L14 4.2 V8 c0 3.4-2.5 5.8-6 7-3.5-1.2-6-3.6-6-7V4.2Z" fill={C.goldLine} />
          </svg>
          {jurisdiction}
        </span>
        {children}
      </div>
    </div>
  );
}

/* ---------- Hero ----------
   A San Francisco dawn, full-bleed and dark, with the headline set INTO the
   scene rather than politely above it. The first screen is the one thing a
   resident will remember, so it commits: deep navy sky burning to amber at
   the horizon, the skyline in near-black, and four banks of fog crossing at
   four speeds.

   Everything is drawn — no photograph is loaded from anywhere. Hotlinking
   stock imagery would hand every resident's IP to a third-party CDN, which
   is precisely what the "no cookies, no personal information" line in the
   footer promises not to do. */
export function HeroScene({ eyebrow, title, subtitle, caption, children, brand, rtl }) {
  return (
    <section
      className="cv-hero"
      style={{
        position: "relative",
        width: "100vw",
        marginInline: "calc(50% - 50vw)",
        minHeight: "clamp(440px, 68vh, 600px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        background: "linear-gradient(#0A1422 0%, #12233A 42%, #35405A 66%, #8A6A3E 86%, #D9A25C 100%)",
        borderBottom: `3px solid ${C.gold}`,
      }}
    >
      <svg
        viewBox="0 0 800 424"
        preserveAspectRatio="xMidYMax slice"
        aria-label={caption}
        role="img"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="cvGlow" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#FFD79A" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F0B168" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F0B168" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cvHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC98A" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFC07A" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="cvBank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DCE6EE" stopOpacity="0" />
            <stop offset="42%" stopColor="#DCE6EE" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#DCE6EE" stopOpacity="0" />
          </linearGradient>
          <filter id="cvSoft" x="-35%" y="-260%" width="170%" height="620%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          {/* Film grain — keeps the flat gradient from banding on cheap panels */}
          <filter id="cvGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* Dawn burning off behind the hills */}
        <rect x="0" y="250" width="800" height="174" fill="url(#cvHaze)" />
        <g className="cv-sun">
          <circle cx="596" cy="352" r="132" fill="url(#cvGlow)" />
          <circle cx="596" cy="352" r="26" fill="#FFDCA4" opacity="0.96" />
        </g>

        {/* Twin Peaks + Sutro Tower */}
        <g fill="#0C1927" opacity="0.62">
          <path d="M0 372 L74 300 L128 342 L196 282 L286 372 Z" />
          <g stroke="#0C1927" strokeWidth="4" fill="none">
            <path d="M196 282 L196 224" />
            <path d="M182 244 L210 244 M178 262 L214 262" strokeWidth="3" />
          </g>
        </g>

        {/* Far bank */}
        <g fill="#101F31" opacity="0.72">
          <rect x="150" y="330" width="34" height="52" />
          <rect x="192" y="312" width="26" height="70" />
          <rect x="392" y="322" width="30" height="60" />
          <rect x="430" y="336" width="38" height="46" />
          <rect x="676" y="326" width="36" height="56" />
          <rect x="720" y="342" width="30" height="40" />
        </g>

        {/* Telegraph Hill + Coit Tower */}
        <g fill="#0A1522">
          <path d="M56 384 Q120 336 190 384 Z" />
          <rect x="114" y="292" width="19" height="56" rx="2" />
          <rect x="111" y="286" width="25" height="9" rx="2" />
        </g>

        {/* Downtown, near-black */}
        <g fill="#08111C">
          <rect x="236" y="300" width="38" height="84" />
          <rect x="278" y="272" width="28" height="112" />
          <path d="M330 384 L356 190 L382 384 Z" />
          <rect x="354" y="152" width="4" height="40" />
          <rect x="396" y="288" width="32" height="96" />
          <path d="M452 384 L452 168 Q466 138 480 168 L480 384 Z" />
          <rect x="494" y="278" width="30" height="106" />
          <rect x="530" y="308" width="26" height="76" />
          <rect x="604" y="316" width="24" height="68" />
          <path d="M604 316 L616 292 L628 316 Z" />
          <rect x="578" y="352" width="78" height="32" />
          <rect x="668" y="296" width="34" height="88" />
          <rect x="708" y="326" width="28" height="58" />
        </g>

        {/* Lit windows */}
        <g fill="#F2C879" className="cv-windows">
          <rect x="246" y="316" width="5" height="8" />
          <rect x="258" y="340" width="5" height="8" />
          <rect x="288" y="292" width="5" height="8" />
          <rect x="406" y="306" width="5" height="8" />
          <rect x="461" y="196" width="5" height="8" />
          <rect x="469" y="242" width="5" height="8" />
          <rect x="504" y="300" width="5" height="8" />
          <rect x="678" y="318" width="5" height="8" />
          <rect x="540" y="330" width="5" height="8" />
          <circle cx="616" cy="330" r="4.5" fill="none" stroke="#F2C879" strokeWidth="1.6" />
        </g>

        {/* Fog: four banks, four speeds — the city's only constant motion */}
        <g filter="url(#cvSoft)">
          <ellipse className="cv-fog cv-fog-1" cx="180" cy="344" rx="330" ry="21" fill="url(#cvBank)" />
          <ellipse className="cv-fog cv-fog-2" cx="580" cy="368" rx="380" ry="17" fill="url(#cvBank)" />
          <ellipse className="cv-fog cv-fog-3" cx="380" cy="318" rx="270" ry="13" fill="url(#cvBank)" />
          <ellipse className="cv-fog cv-fog-4" cx="460" cy="386" rx="430" ry="15" fill="url(#cvBank)" />
        </g>

        <rect x="0" y="0" width="800" height="424" filter="url(#cvGrain)" opacity="0.05" />
        {/* Weight under the type so it stays legible over the brightest dawn */}
        <rect x="0" y="120" width="800" height="304" fill="url(#cvScrim)" />
        <defs>
          <linearGradient id="cvScrim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050B14" stopOpacity="0" />
            <stop offset="70%" stopColor="#050B14" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#050B14" stopOpacity="0.52" />
          </linearGradient>
        </defs>
      </svg>

      {brand && (
        <div
          dir={rtl ? "rtl" : "ltr"}
          className="cv-rise"
          style={{
            position: "relative",
            maxWidth: 680,
            width: "100%",
            margin: "0 auto",
            padding: "24px 24px 0",
          }}
        >
          {brand}
        </div>
      )}

      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          position: "relative",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          padding: "0 24px 46px",
        }}
      >
        {eyebrow && (
          <div className="cv-rise" style={{ ...caps, fontSize: 10, color: C.goldLine, marginBottom: 16, animationDelay: "0.05s" }}>
            {eyebrow}
          </div>
        )}
        <h2
          className="cv-rise"
          style={{
            ...serif,
            fontSize: "clamp(46px, 12vw, 88px)",
            lineHeight: 0.92,
            fontWeight: 500,
            color: "#FBF7EF",
            letterSpacing: "-0.028em",
            margin: 0,
            textWrap: "balance",
            animationDelay: "0.14s",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="cv-rise"
            style={{
              ...serif,
              fontSize: "clamp(17px, 4.4vw, 21px)",
              fontStyle: "italic",
              color: "rgba(251,247,239,0.82)",
              margin: "18px 0 0",
              lineHeight: 1.5,
              maxWidth: 430,
              animationDelay: "0.24s",
            }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="cv-rise" style={{ marginTop: 30, animationDelay: "0.34s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/* The hero's primary action — the whole reason most residents open this. */
export function HeroAction({ label, rtl }) {
  return (
    <span className="cv-cta" style={{ ...caps, fontSize: 11, color: C.ink }}>
      {label}
      <span aria-hidden="true" className="cv-cta-arrow">{rtl ? "←" : "→"}</span>
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
