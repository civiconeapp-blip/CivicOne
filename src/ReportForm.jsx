import { useRef, useState } from "react";

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

const SF311_FALLBACK = "https://sf.gov/topics--311-online-services/";

/* One-tap 311: photo + GPS -> AI writes the report -> CivicOne's backend
   drives SF311's official web form and returns the real SR case number.
   Filing is anonymous; nothing is stored. */
export default function ReportForm({ t, lang }) {
  const fileRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | locating | filing | done | emergency | needAddress | failed
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [addr, setAddr] = useState("");
  const pendingPhoto = useRef(null);
  const coordsPromiseRef = useRef(null);

  // Ask for location permission the moment the user taps Report (a real user
  // gesture) so the browser reliably shows the prompt, and cache the result.
  function requestLocation() {
    if (!("geolocation" in navigator)) {
      coordsPromiseRef.current = Promise.resolve(null);
      return;
    }
    coordsPromiseRef.current = new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
      );
    });
  }

  const labelStyle = {
    ...caps,
    fontSize: 10,
    color: C.muted,
    display: "block",
    margin: "20px 0 8px",
  };
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

  // Downscale so the upload stays small and fast.
  async function compress(file, maxDim = 1568, quality = 0.8) {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", quality).split(",")[1];
  }

  async function onPhoto(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    pendingPhoto.current = f;
    setResult(null);
    setErrMsg("");
    setPhase("locating");
    // Use the location request kicked off when Report was tapped; if that
    // wasn't started (or was denied/unavailable), try once more, then fall
    // back to manual address entry.
    let coords = null;
    try {
      coords =
        (coordsPromiseRef.current && (await coordsPromiseRef.current)) || null;
      if (!coords) {
        requestLocation();
        coords = await coordsPromiseRef.current;
      }
    } catch {
      coords = null;
    }
    if (!coords) {
      setPhase("needAddress");
      return;
    }
    file(coords, null);
  }

  async function file(coords, manualAddress) {
    setPhase("filing");
    try {
      const b64 = await compress(pendingPhoto.current);
      const r = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: b64,
          mediaType: "image/jpeg",
          lat: coords ? coords.latitude : undefined,
          lng: coords ? coords.longitude : undefined,
          address: manualAddress || undefined,
          note: note.trim() || undefined,
          email: email.trim() || undefined,
          lang,
        }),
      });
      const j = await r.json();
      if (j.emergency) {
        setResult(j);
        setPhase("emergency");
      } else if (j.ok && (j.caseNumber || j.dryRun)) {
        setResult(j);
        setPhase("done");
        if (window.umami)
          window.umami.track("report_filed", { category: j.category || "unknown" });
      } else {
        setErrMsg(j.error || "");
        setPhase("failed");
      }
    } catch (err) {
      setErrMsg(String(err && err.message ? err.message : err));
      setPhase("failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const busy = phase === "locating" || phase === "filing";

  return (
    <section style={{ paddingBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>
          {t.reportLabel}
        </span>
        <div style={{ flex: 1, height: 1, background: C.hairline }} />
      </div>
      <p
        style={{
          ...serif,
          fontSize: 15.5,
          fontStyle: "italic",
          color: C.muted,
          margin: "-10px 0 6px",
          lineHeight: 1.5,
        }}
      >
        {t.rOneTapIntro}
      </p>

      <label htmlFor="report-email" style={labelStyle}>
        {t.rEmailLabel}
      </label>
      <input
        id="report-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        style={inputStyle}
        maxLength={120}
      />

      <label htmlFor="report-note" style={labelStyle}>
        {t.rNoteLabel}
      </label>
      <input
        id="report-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t.rNotePlaceholder}
        style={inputStyle}
        maxLength={300}
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPhoto}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={() => {
          requestLocation();
          if (fileRef.current) fileRef.current.click();
        }}
        disabled={busy}
        style={{
          ...caps,
          fontSize: 11,
          marginTop: 24,
          padding: "18px 22px",
          background: busy ? C.muted : C.navy,
          color: C.cream,
          border: "none",
          width: "100%",
          cursor: busy ? "wait" : "pointer",
        }}
      >
        {phase === "locating"
          ? t.rGettingLoc
          : phase === "filing"
          ? t.rFiling
          : t.rSnap}
      </button>

      <p style={{ ...sans, fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>
        {t.rAnonNote}
      </p>

      {phase === "needAddress" && (
        <div style={{ marginTop: 20, border: `1px solid ${C.gold}`, background: "#FFFFFF", padding: 18 }}>
          <p style={{ ...sans, fontSize: 14, color: C.ink, margin: 0, lineHeight: 1.5 }}>
            {t.rNoLoc}
          </p>
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder={t.rAddrPlaceholder}
            style={{ ...inputStyle, marginTop: 12 }}
          />
          <button
            type="button"
            disabled={!addr.trim()}
            onClick={() => file(null, addr.trim())}
            style={{
              ...caps,
              fontSize: 10.5,
              marginTop: 12,
              padding: "12px 18px",
              background: addr.trim() ? C.navy : C.muted,
              color: C.cream,
              border: "none",
              width: "100%",
              cursor: addr.trim() ? "pointer" : "default",
            }}
          >
            {t.rFileNow}
          </button>
        </div>
      )}

      {phase === "emergency" && result && (
        <div style={{ marginTop: 28, border: `2px solid ${C.alert}`, background: "#FFFFFF", padding: "20px 18px" }}>
          <p dir="auto" style={{ ...sans, fontSize: 16, fontWeight: 600, color: C.alert, margin: 0, lineHeight: 1.5 }}>
            {result.summary_local}
          </p>
          
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

      {phase === "done" && result && (
        <div style={{ marginTop: 28, border: `1px solid ${C.hairline}`, background: "#FFFFFF", padding: "20px 18px" }}>
          <div style={{ ...caps, fontSize: 10, color: C.gold }}>{t.rFiledTitle}</div>
          {result.caseNumber && (
            <div style={{ marginTop: 14 }}>
              <span style={{ ...caps, fontSize: 10, color: C.muted }}>{t.rCaseNo}</span>
              <div style={{ ...mono, fontSize: 22, color: C.ink, marginTop: 4 }}>
                #{result.caseNumber}
              </div>
            </div>
          )}
          {result.summary_local && (
            <p dir="auto" style={{ ...serif, fontSize: 15.5, color: C.ink, margin: "14px 0 0", lineHeight: 1.6 }}>
              {result.summary_local}
            </p>
          )}
          <p style={{ ...sans, fontSize: 12.5, color: C.muted, margin: "12px 0 0", lineHeight: 1.5 }}>
            {result.address}
          </p>
          {result.description && (
            <pre
              dir="auto"
              style={{ ...mono, fontSize: 12.5, color: C.ink, whiteSpace: "pre-wrap", margin: "14px 0 0", textAlign: "start" }}
            >
              {result.description}
            </pre>
          )}
        </div>
      )}

      {phase === "failed" && (
        <div style={{ marginTop: 28, border: `1px solid ${C.alert}`, background: "#FFFFFF", padding: 18 }}>
          <p style={{ ...sans, fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.6 }}>
            {t.rFailNote}
          </p>
          {errMsg ? (
            <p style={{ ...mono, fontSize: 11, color: C.muted, margin: "10px 0 0" }}>{errMsg}</p>
          ) : null}
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              style={{
                ...caps,
                fontSize: 10.5,
                padding: "12px 18px",
                background: "#FFFFFF",
                color: C.ink,
                border: `1px solid ${C.ink}`,
                cursor: "pointer",
                flex: 1,
                minWidth: 140,
              }}
            >
              {t.rTryAgain}
            </button>
            
              href={SF311_FALLBACK}
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
                minWidth: 140,
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
