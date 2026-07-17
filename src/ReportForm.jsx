import { useState } from "react";

/* Local design tokens (matches App.jsx "City Briefing" system) */
const C = {
  ink: "#101826",
  navy: "#152B45",
  gold: "#A9863A",
  hairline: "#E4E0D6",
  muted: "#6B7280",
  cream: "#F5F2EA",
  alert: "#A6431F",
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

/* Categories mapped to SF311's taxonomy. English always included so
   SF311 staff can route regardless of the writer's language. */
const CATS = [
  { key: "rc1", en: "Street or Sidewalk Cleaning" },
  { key: "rc2", en: "Graffiti" },
  { key: "rc3", en: "Pothole & Street Issues" },
  { key: "rc4", en: "Streetlight Repair" },
  { key: "rc5", en: "Abandoned Vehicle" },
  { key: "rc6", en: "Encampment" },
  { key: "rc7", en: "General Request" },
];
const EN_TO_KEY = Object.fromEntries(CATS.map((c) => [c.en, c.key]));

export default function ReportForm({ t }) {
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ai, setAi] = useState(null); // AI triage result
  const [manual, setManual] = useState(false); // fallback mode if AI is down
  const [copied, setCopied] = useState(false);

  const inputStyle = {
    ...sans,
    fontSize: 15,
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${C.hairline}`,
    borderRadius: 0,
    background: "#FFFFFF",
    color: C.ink,
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
  };
  const labelStyle = {
    ...caps,
    fontSize: 10,
    color: C.muted,
    display: "block",
    margin: "20px 0 8px",
  };

  const manualText = () => {
    const c = CATS.find((x) => x.key === cat) || CATS[6];
    const lines = ["SF311 Report", `Category: ${c.en}`];
    if (loc.trim()) lines.push(`Location: ${loc.trim()}`);
    lines.push(`Description: ${desc.trim()}`);
    return lines.join("\n");
  };

  const aiText = () => {
    const lines = [
      "SF311 Report",
      `Category: ${ai.category}`,
      `Severity: ${ai.severity}/3 — ${ai.severity_reason}`,
    ];
    if (loc.trim()) lines.push(`Location: ${loc.trim()}`);
    lines.push(`Description: ${ai.description_en}`);
    return lines.join("\n");
  };

  const reportText = () => (ai && !manual ? aiText() : manualText());

  const prepare = async () => {
    if (!desc.trim()) {
      setError(true);
      setAi(null);
      setManual(false);
      return;
    }
    setError(false);
    setCopied(false);
    setAi(null);
    setManual(false);
    setLoading(true);
    try {
      const r = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc.trim(),
          location: loc.trim() || undefined,
        }),
      });
      if (!r.ok) throw new Error("triage " + r.status);
      const out = await r.json();
      setAi(out);
      if (window.umami)
        window.umami.track("report_prepared", { category: out.category, ai: "yes" });
    } catch (e) {
      setManual(true);
      if (window.umami)
        window.umami.track("report_prepared", { category: cat || "rc7", ai: "fallback" });
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportText());
      setCopied(true);
      if (window.umami) window.umami.track("report_copied", { category: cat });
    } catch (e) {
      setCopied(false);
    }
  };

  const aiCatLabel =
    ai && EN_TO_KEY[ai.category] ? t[EN_TO_KEY[ai.category]] : ai ? ai.category : "";

  const showEmergency = ai && ai.emergency;
  const showFollowup = ai && !ai.emergency && ai.needs_more_info;
  const showCard = (ai && !ai.emergency && !ai.needs_more_info) || manual;

  return (
    <section style={{ paddingBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>
          {t.reportLabel}
        </span>
        <div style={{ flex: 1, height: 1, background: C.hairline }} />
      </div>
      <p style={{ ...serif, fontSize: 15.5, fontStyle: "italic", color: C.muted, margin: "-10px 0 6px", lineHeight: 1.5 }}>
        {t.reportIntro}
      </p>

      <label style={labelStyle}>{t.rDescription}</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder={t.rDescPlaceholder}
        rows={4}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={labelStyle}>{t.rLocation}</label>
      <input
        value={loc}
        onChange={(e) => setLoc(e.target.value)}
        placeholder={t.rLocPlaceholder}
        style={inputStyle}
      />

      <label style={labelStyle}>{t.rCategory}</label>
      <select value={cat} onChange={(e) => setCat(e.target.value)} style={inputStyle}>
        <option value=""> </option>
        {CATS.map((c) => (
          <option key={c.key} value={c.key}>
            {t[c.key]}
          </option>
        ))}
      </select>

      {error && (
        <p style={{ ...sans, fontSize: 13, color: C.alert, marginTop: 12 }}>{t.rMissing2}</p>
      )}

      <button
        onClick={prepare}
        disabled={loading}
        style={{
          ...caps,
          fontSize: 11,
          marginTop: 24,
          padding: "15px 22px",
          background: loading ? C.muted : C.navy,
          color: C.cream,
          border: "none",
          width: "100%",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? t.rAnalyzing : t.rPrepare}
      </button>

      {showEmergency && (
        <div style={{ marginTop: 28, border: `2px solid ${C.alert}`, background: "#FFFFFF", padding: "20px 18px" }}>
          <p dir="auto" style={{ ...sans, fontSize: 16, fontWeight: 600, color: C.alert, margin: 0, lineHeight: 1.5 }}>
            {ai.summary_local}
          </p>
          <a
            href="tel:911"
            style={{
              ...caps,
              fontSize: 12,
              display: "block",
              marginTop: 16,
              padding: "15px 22px",
              background: C.alert,
              color: "#FFFFFF",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {t.rCall911}
          </a>
        </div>
      )}

      {showFollowup && (
        <div style={{ marginTop: 28, border: `1px solid ${C.gold}`, background: "#FFFFFF", padding: "18px" }}>
          <p dir="auto" style={{ ...sans, fontSize: 14.5, color: C.ink, margin: 0, lineHeight: 1.6 }}>
            {ai.followup_question}
          </p>
        </div>
      )}

      {showCard && (
        <div style={{ marginTop: 28, border: `1px solid ${C.hairline}`, background: "#FFFFFF", padding: "20px 18px" }}>
          <div style={{ ...caps, fontSize: 10, color: C.gold }}>{t.rSummaryTitle}</div>
          {ai && !manual && (
            <p dir="auto" style={{ ...serif, fontSize: 15.5, color: C.ink, margin: "14px 0 0", lineHeight: 1.6 }}>
              {ai.summary_local}
            </p>
          )}
          {ai && !manual && (
            <div style={{ ...caps, fontSize: 10, color: C.muted, marginTop: 14 }}>
              {aiCatLabel}
            </div>
          )}
          {manual && (
            <p style={{ ...sans, fontSize: 12.5, color: C.muted, margin: "12px 0 0", lineHeight: 1.5 }}>
              {t.rFallbackNote}
            </p>
          )}
          <pre
            dir="auto"
            style={{ ...mono, fontSize: 12.5, color: C.ink, whiteSpace: "pre-wrap", margin: "14px 0 0", textAlign: "start" }}
          >
            {reportText()}
          </pre>
          <p style={{ ...sans, fontSize: 12, color: C.muted, marginTop: 14, lineHeight: 1.5 }}>
            {t.rHandoffNote}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={copy}
              style={{
                ...caps,
                fontSize: 10.5,
                padding: "12px 18px",
                background: "#FFFFFF",
                color: C.ink,
                border: `1px solid ${C.ink}`,
                cursor: "pointer",
                flex: 1,
                minWidth: 150,
              }}
            >
              {copied ? t.rCopied : t.rCopy}
            </button>
            <a
              href="https://www.sf311.org"
              onClick={() => {
                if (window.umami) window.umami.track("report_finished", { category: cat });
              }}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...caps,
                fontSize: 10.5,
                padding: "12px 18px",
                background: C.gold,
                color: "#FFFFFF",
                textDecoration: "none",
                textAlign: "center",
                flex: 1,
                minWidth: 150,
              }}
            >
              {t.rFinish}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
