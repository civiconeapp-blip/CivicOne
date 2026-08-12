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

/* Filing takes over a minute, so /api/report streams newline-delimited JSON:
   progress lines while it works, then one final "result" line. Reading it as
   a stream (rather than awaiting the whole body) is what lets us show the
   resident real progress instead of a silent wait they assume has died.
   Falls back to plain JSON so an older/other response still parses. */
async function readReport(response, onStep) {
  const isStream = (response.headers.get("content-type") || "").includes("ndjson");
  if (!isStream || !response.body || !response.body.getReader) {
    return response.json();
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let final = null;

  const handle = (line) => {
    const text = line.trim();
    if (!text) return;
    let msg;
    try {
      msg = JSON.parse(text);
    } catch {
      return; // ignore a partial or malformed line rather than failing the filing
    }
    if (msg.type === "progress") onStep({ n: msg.n, total: msg.total });
    else if (msg.type === "result") final = msg;
  };

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    lines.forEach(handle);
  }
  handle(buffer);
  return final;
}

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
  const [locError, setLocError] = useState(null); // null | "denied" | "unavailable" | "unsupported"
  const [step, setStep] = useState(null); // {n, total} while filing
  const [maybeFiled, setMaybeFiled] = useState(false); // connection died mid-filing
  const pendingPhoto = useRef(null);
  const coordsPromiseRef = useRef(null);

  // Ask for location permission the moment the user taps Report (a real user
  // gesture) so the browser reliably shows the prompt, and cache the result.
  function requestLocation() {
    setLocError(null);
    if (!("geolocation" in navigator)) {
      setLocError("unsupported");
      coordsPromiseRef.current = Promise.resolve(null);
      return;
    }
    // Browsers silently refuse geolocation on an insecure (non-HTTPS,
    // non-localhost) origin — no prompt, no error, getCurrentPosition just
    // never resolves usefully. Catch that case explicitly instead of
    // leaving the resident stuck on "Getting your location…".
    if (!window.isSecureContext) {
      console.warn(
        "Geolocation blocked: page is not a secure context (requires HTTPS or localhost)."
      );
      setLocError("unsupported");
      coordsPromiseRef.current = Promise.resolve(null);
      return;
    }
    const GEO_TIMEOUT_MS = 20000;
    const nativeAttempt = new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => {
          console.warn("Geolocation failed:", err && err.code, err && err.message);
          setLocError(err && err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: GEO_TIMEOUT_MS, maximumAge: 60000 }
      );
    });
    // Some browsers never invoke getCurrentPosition's own error/timeout
    // callback at all — e.g. a permission prompt left unanswered — which
    // would otherwise strand the UI on "Getting your location…" forever.
    // A second, independent timer guarantees this always settles.
    const hardTimeout = new Promise((resolve) => {
      setTimeout(() => {
        setLocError((prev) => prev || "unavailable");
        resolve(null);
      }, GEO_TIMEOUT_MS + 2000);
    });
    coordsPromiseRef.current = Promise.race([nativeAttempt, hardTimeout]);
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
    // Use the location request kicked off when Report was tapped. If it
    // wasn't started for some reason, start it now (still worth trying —
    // this handler itself runs from the user's file-picker selection, a
    // gesture most browsers still honor for a permission prompt).
    let coords = null;
    try {
      if (!coordsPromiseRef.current) requestLocation();
      coords = (await coordsPromiseRef.current) || null;
    } catch {
      coords = null;
    }
    if (!coords) {
      setPhase("needAddress");
      return;
    }
    file(coords, null);
  }

  // Lets a resident retry GPS from the manual-address fallback instead of
  // being stuck typing — most "no location" cases are a missed permission
  // prompt or a slow first fix, not a hard denial.
  async function retryLocation() {
    setPhase("locating");
    requestLocation();
    const coords = await coordsPromiseRef.current;
    if (coords) {
      file(coords, null);
    } else {
      setPhase("needAddress");
    }
  }

  async function file(coords, manualAddress) {
    setPhase("filing");
    setStep(null);
    setMaybeFiled(false);
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
      const j = await readReport(r, setStep);
      if (!j) {
        // The stream ended without a result line: the filing was still
        // running when the connection died, so SF311 may well have accepted
        // it. Saying "it failed" here is what gets duplicate cases filed.
        setMaybeFiled(true);
        setPhase("failed");
        return;
      }
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
          ? step
            ? `${t.rFiling} (${step.n}/${step.total})`
            : t.rFiling
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
          {locError === "denied" && (
            <p style={{ ...sans, fontSize: 12.5, color: C.alert, margin: "8px 0 0", lineHeight: 1.5 }}>
              {t.rLocDenied}
            </p>
          )}
          <button
            type="button"
            onClick={retryLocation}
            style={{
              ...caps,
              fontSize: 10.5,
              marginTop: 12,
              padding: "12px 18px",
              background: "#FFFFFF",
              color: C.navy,
              border: `1px solid ${C.navy}`,
              width: "100%",
              cursor: "pointer",
            }}
          >
            {t.rRetryLoc}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.hairline }} />
            <span style={{ ...caps, fontSize: 9.5, color: C.muted }}>{t.rOr}</span>
            <div style={{ flex: 1, height: 1, background: C.hairline }} />
          </div>
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder={t.rAddrPlaceholder}
            style={inputStyle}
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
            {maybeFiled ? t.rMaybeFiled : t.rFailNote}
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
            <a
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
