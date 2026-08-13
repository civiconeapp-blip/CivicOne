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

/* ---------- Skyline ----------
   A San Francisco morning, drawn: Twin Peaks, Sutro Tower, Coit Tower on
   Telegraph Hill, the Transamerica Pyramid, Salesforce Tower, the Ferry
   Building clock, and fog rolling through on three layers at different
   speeds. The fog is the whole point — it's the one thing in the city that
   is always moving, so the page reads as alive without a carousel or a
   video autoplaying on someone's data plan. */
export function SkylineHero({ caption }) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          background: "linear-gradient(#F3EEE2 0%, #F7F5F0 58%, #F7F5F0 100%)",
          border: `1px solid ${C.hairline}`,
          lineHeight: 0,
        }}
      >
        {/* meet, not slice: on a narrow phone a cropping fit would cut the sun
            and Twin Peaks off the sides and leave a wall of buildings. */}
        <svg
          viewBox="0 0 800 234"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label={caption}
        >
          <defs>
            <linearGradient id="cvSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EFE4CE" />
              <stop offset="55%" stopColor="#F5F0E4" />
              <stop offset="100%" stopColor="#F7F5F0" />
            </linearGradient>
            <radialGradient id="cvSun">
              <stop offset="0%" stopColor="#E8C87A" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#E8C87A" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#E8C87A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cvFog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <filter id="cvFogBlur" x="-30%" y="-120%" width="160%" height="340%">
              <feGaussianBlur stdDeviation="11" />
            </filter>
            <linearGradient id="cvWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9D4DC" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C9D4DC" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="800" height="234" fill="url(#cvSky)" />
          <g className="cv-sun">
            <circle cx="648" cy="74" r="62" fill="url(#cvSun)" />
            <circle cx="648" cy="74" r="15" fill="#E4BE68" opacity="0.9" />
          </g>

          {/* Twin Peaks and Sutro Tower, far west */}
          <g opacity="0.32">
            <path d="M0 196 L58 150 L96 178 L140 142 L196 196 Z" fill={C.navySoft} />
            <g stroke={C.navySoft} strokeWidth="2" fill="none">
              <path d="M140 142 L140 108" />
              <path d="M131 121 L149 121 M128 133 L152 133" strokeWidth="1.5" />
            </g>
          </g>

          {/* Bay */}
          <rect x="0" y="205" width="800" height="29" fill="url(#cvWater)" />

          {/* Far skyline */}
          <g fill={C.navySoft} opacity="0.34">
            <rect x="206" y="168" width="26" height="42" />
            <rect x="238" y="152" width="20" height="58" />
            <rect x="352" y="160" width="24" height="50" />
            <rect x="384" y="174" width="30" height="36" />
            <rect x="536" y="158" width="22" height="52" />
            <rect x="564" y="170" width="26" height="40" />
            <rect x="700" y="164" width="30" height="46" />
            <rect x="736" y="178" width="24" height="32" />
          </g>

          {/* Telegraph Hill + Coit Tower */}
          <g fill={C.navy} opacity="0.9">
            <path d="M96 210 Q140 178 186 210 Z" />
            <rect x="136" y="150" width="15" height="42" rx="2" />
            <rect x="134" y="146" width="19" height="7" rx="2" />
          </g>

          {/* Downtown */}
          <g fill={C.navy}>
            <rect x="268" y="150" width="30" height="60" />
            <rect x="300" y="132" width="22" height="78" />
            {/* Transamerica Pyramid */}
            <path d="M352 210 L372 96 L392 210 Z" />
            <rect x="370.5" y="74" width="3" height="24" />
            <rect x="404" y="146" width="26" height="64" />
            {/* Salesforce Tower */}
            <path d="M452 210 L452 82 Q463 62 474 82 L474 210 Z" />
            <rect x="486" y="140" width="24" height="70" />
            <rect x="516" y="158" width="20" height="52" />
            {/* Ferry Building clock tower */}
            <rect x="592" y="164" width="20" height="46" />
            <path d="M592 164 L602 148 L612 164 Z" />
            <rect x="570" y="188" width="64" height="22" />
            <rect x="646" y="150" width="28" height="60" />
            <rect x="678" y="170" width="22" height="40" />
          </g>

          {/* Lit windows — the city is awake, but only just */}
          <g fill={C.goldLine} className="cv-windows">
            <rect x="276" y="162" width="4" height="6" />
            <rect x="286" y="176" width="4" height="6" />
            <rect x="308" y="150" width="4" height="6" />
            <rect x="412" y="160" width="4" height="6" />
            <rect x="459" y="104" width="4" height="6" />
            <rect x="465" y="132" width="4" height="6" />
            <rect x="494" y="158" width="4" height="6" />
            <rect x="654" y="168" width="4" height="6" />
            <circle cx="602" cy="172" r="3.4" fill="none" stroke={C.goldLine} strokeWidth="1.2" />
          </g>

          {/* Ground line, letterpress rule */}
          <line x1="0" y1="210" x2="800" y2="210" stroke={C.ink} strokeWidth="1.25" opacity="0.55" />

          {/* Fog: three banks, three speeds */}
          <g filter="url(#cvFogBlur)">
            <ellipse className="cv-fog cv-fog-1" cx="200" cy="188" rx="300" ry="19" fill="url(#cvFog)" />
            <ellipse className="cv-fog cv-fog-2" cx="560" cy="201" rx="350" ry="15" fill="url(#cvFog)" />
            <ellipse className="cv-fog cv-fog-3" cx="380" cy="172" rx="250" ry="11" fill="url(#cvFog)" />
          </g>
        </svg>
      </div>
      {caption && (
        <figcaption
          style={{
            ...caps,
            fontSize: 9,
            letterSpacing: "0.22em",
            color: C.muted,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
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
