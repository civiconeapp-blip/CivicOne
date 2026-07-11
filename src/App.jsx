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
