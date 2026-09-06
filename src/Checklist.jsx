/**
 * Checklist.jsx — "what to bring" for one program, in five languages.
 *
 * Reads programRules.js and renders the machine-checkable part of an
 * application: which documents, how many, over what window, how fresh.
 * No accounts, no storage, no uploads — this page holds nothing.
 *
 * Follows the ProgramGuide.jsx layout system. Requirements whose official
 * source could not be confirmed render as a caveat, never as fact
 * (see the integrity rule at the top of programRules.js).
 *
 * Program names, agencies and notes stay in English — like the events
 * calendar, the page says so rather than machine-translating an official
 * name. The parts a resident acts on (document names, windows, recency)
 * are translated. Translations should be reviewed by a native speaker.
 */

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PROGRAM_RULES, getRules, recencyLimitFor } from "./programRules.js";
import { LANGS } from "./i18n.js";

const C = {
  paper: "#FFFFFF",
  ink: "#1B1B1B",
  navy: "#14315C",
  gold: "#0A5CB8",
  goldLine: "#9CC3F0",
  hairline: "#D4DAE1",
  muted: "#4A5568",
  cream: "#EAF1FB",
  warn: "#8A6320",
  warnBg: "#F6EFE1",
};
const serif = { fontFamily: "'Rubik', system-ui, sans-serif" };
const sans = { fontFamily: "'Rubik', system-ui, sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const caps = { ...sans, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600 };

/* ---------------- translations ---------------- */

const CT = {
  en: {
    tag: "What to bring",
    title: "What to bring",
    intro: "Every program asks for different documents, in different amounts, with different age limits. Pick a program to see exactly what it wants.",
    pick: "Choose a program",
    sepOut: "Programs with their own application",
    sepIn: "Applied for through BenefitsCal",
    need: "Bring these",
    notes: "Good to know",
    apply: "Official application",
    phone: "Phone",
    langs: "Application languages",
    unverified: "We could not confirm this from an official page. Check with the program before you go.",
    freshAll: (n) => `Everything here must be dated within ${n} days.`,
    freshOne: (n) => `Within ${n} days`,
    print: "Print this list",
    back: "Civic One",
    note: "Program names and notes are in English. Document names and requirements are translated.",
    docs: {
      photo_id: "Photo ID", income_earned: "Pay stubs", utility_bill: "Utility bill",
      tax_return: "Tax return", benefits_letter: "Benefits award letter",
      bank_statement: "Bank statement", lease: "Lease or rental agreement",
      birth_certificate: "Birth certificate", clinician_cert: "Form signed by a doctor or social worker",
      immigration_doc: "Immigration document",
    },
    wSingle: "One document", wDays: (n) => `Dated within the last ${n} days`,
    wCount: (n) => `${n} most recent`, wRow: (n) => `${n} in a row`,
    wMonths: (n) => `Covering the last ${n} months`,
    wRange: (a, b) => `${a} to ${b} months — check the listing`,
    wFreq: (w, b) => `${w} if you are paid weekly, ${b} if every two weeks`,
    wCal: "From the month you apply",
    wUnspec: "The program says only “most recent” — ask what they will accept",
    none: "No documents are required to apply.",
  },
  es: {
    tag: "Qué llevar", title: "Qué llevar",
    intro: "Cada programa pide documentos distintos, en cantidades distintas, con límites de antigüedad distintos. Elija un programa para ver exactamente qué pide.",
    pick: "Elija un programa",
    sepOut: "Programas con su propia solicitud",
    sepIn: "Se solicita por BenefitsCal",
    need: "Lleve esto", notes: "Bueno saber", apply: "Solicitud oficial",
    phone: "Teléfono", langs: "Idiomas de la solicitud",
    unverified: "No pudimos confirmar esto en una página oficial. Consulte con el programa antes de ir.",
    freshAll: (n) => `Todo aquí debe tener fecha de los últimos ${n} días.`,
    freshOne: (n) => `Dentro de ${n} días`,
    print: "Imprimir esta lista", back: "Civic One",
    note: "Los nombres de los programas y las notas están en inglés. Los nombres de documentos y requisitos están traducidos.",
    docs: {
      photo_id: "Identificación con foto", income_earned: "Talones de pago", utility_bill: "Factura de servicios",
      tax_return: "Declaración de impuestos", benefits_letter: "Carta de concesión de beneficios",
      bank_statement: "Estado de cuenta bancario", lease: "Contrato de arrendamiento",
      birth_certificate: "Acta de nacimiento", clinician_cert: "Formulario firmado por un médico o trabajador social",
      immigration_doc: "Documento de inmigración",
    },
    wSingle: "Un documento", wDays: (n) => `Con fecha de los últimos ${n} días`,
    wCount: (n) => `Los ${n} más recientes`, wRow: (n) => `${n} seguidos`,
    wMonths: (n) => `Que cubran los últimos ${n} meses`,
    wRange: (a, b) => `De ${a} a ${b} meses — consulte el anuncio`,
    wFreq: (w, b) => `${w} si le pagan por semana, ${b} si cada dos semanas`,
    wCal: "Del mes en que solicita",
    wUnspec: "El programa solo dice “más reciente” — pregunte qué aceptan",
    none: "No se requieren documentos para solicitar.",
  },
  zh: {
    tag: "需要攜帶的文件", title: "需要攜帶的文件",
    intro: "每個計劃要求的文件、數量和有效期限都不同。請選擇一個計劃，查看確切要求。",
    pick: "選擇計劃",
    sepOut: "有獨立申請程序的計劃",
    sepIn: "透過 BenefitsCal 申請",
    need: "請攜帶", notes: "請注意", apply: "官方申請",
    phone: "電話", langs: "申請可用語言",
    unverified: "我們無法從官方網頁確認此項。前往之前請先向該計劃查詢。",
    freshAll: (n) => `所有文件日期須在 ${n} 天以內。`,
    freshOne: (n) => `${n} 天以內`,
    print: "列印此清單", back: "Civic One",
    note: "計劃名稱與備註為英文。文件名稱與要求已翻譯。",
    docs: {
      photo_id: "附照片的身分證件", income_earned: "工資單", utility_bill: "水電費帳單",
      tax_return: "報稅表", benefits_letter: "福利批准信",
      bank_statement: "銀行對帳單", lease: "租約",
      birth_certificate: "出生證明", clinician_cert: "由醫生或社工簽署的表格",
      immigration_doc: "移民文件",
    },
    wSingle: "一份文件", wDays: (n) => `日期在最近 ${n} 天以內`,
    wCount: (n) => `最近 ${n} 份`, wRow: (n) => `連續 ${n} 份`,
    wMonths: (n) => `涵蓋最近 ${n} 個月`,
    wRange: (a, b) => `${a} 至 ${b} 個月 — 請查看該房源說明`,
    wFreq: (w, b) => `每週領薪為 ${w} 份，每兩週領薪為 ${b} 份`,
    wCal: "申請當月的文件",
    wUnspec: "該計劃僅說明「最近」— 請詢問他們接受哪些文件",
    none: "申請時不需要文件。",
  },
  vi: {
    tag: "Cần mang theo", title: "Cần mang theo",
    intro: "Mỗi chương trình yêu cầu giấy tờ khác nhau, số lượng khác nhau và thời hạn khác nhau. Hãy chọn một chương trình để xem yêu cầu cụ thể.",
    pick: "Chọn chương trình",
    sepOut: "Chương trình có đơn xin riêng",
    sepIn: "Nộp đơn qua BenefitsCal",
    need: "Mang theo những giấy tờ này", notes: "Cần biết", apply: "Đơn chính thức",
    phone: "Điện thoại", langs: "Ngôn ngữ của đơn",
    unverified: "Chúng tôi không xác nhận được điều này từ trang chính thức. Hãy hỏi chương trình trước khi đi.",
    freshAll: (n) => `Mọi giấy tờ phải có ngày trong vòng ${n} ngày.`,
    freshOne: (n) => `Trong vòng ${n} ngày`,
    print: "In danh sách này", back: "Civic One",
    note: "Tên chương trình và ghi chú bằng tiếng Anh. Tên giấy tờ và yêu cầu đã được dịch.",
    docs: {
      photo_id: "Giấy tờ tùy thân có ảnh", income_earned: "Phiếu lương", utility_bill: "Hóa đơn tiện ích",
      tax_return: "Tờ khai thuế", benefits_letter: "Thư chấp thuận trợ cấp",
      bank_statement: "Sao kê ngân hàng", lease: "Hợp đồng thuê nhà",
      birth_certificate: "Giấy khai sinh", clinician_cert: "Mẫu đơn có chữ ký của bác sĩ hoặc nhân viên xã hội",
      immigration_doc: "Giấy tờ di trú",
    },
    wSingle: "Một giấy tờ", wDays: (n) => `Có ngày trong vòng ${n} ngày qua`,
    wCount: (n) => `${n} phiếu gần nhất`, wRow: (n) => `${n} phiếu liên tiếp`,
    wMonths: (n) => `Bao gồm ${n} tháng gần nhất`,
    wRange: (a, b) => `${a} đến ${b} tháng — xem thông báo cụ thể`,
    wFreq: (w, b) => `${w} nếu trả lương hàng tuần, ${b} nếu hai tuần một lần`,
    wCal: "Của tháng bạn nộp đơn",
    wUnspec: "Chương trình chỉ ghi “gần nhất” — hãy hỏi họ chấp nhận giấy tờ nào",
    none: "Không cần giấy tờ để nộp đơn.",
  },
  ar: {
    tag: "ما يجب إحضاره", title: "ما يجب إحضاره",
    intro: "كل برنامج يطلب مستندات مختلفة، بأعداد مختلفة، وبمدد صلاحية مختلفة. اختر برنامجاً لمعرفة المطلوب بالضبط.",
    pick: "اختر برنامجاً",
    sepOut: "برامج لها طلب خاص بها",
    sepIn: "يُقدَّم الطلب عبر BenefitsCal",
    need: "أحضر هذه المستندات", notes: "معلومات مفيدة", apply: "الطلب الرسمي",
    phone: "الهاتف", langs: "لغات الطلب",
    unverified: "لم نتمكن من تأكيد ذلك من صفحة رسمية. تواصل مع البرنامج قبل الذهاب.",
    freshAll: (n) => `يجب أن يكون تاريخ كل مستند خلال ${n} يوماً.`,
    freshOne: (n) => `خلال ${n} يوماً`,
    print: "اطبع هذه القائمة", back: "Civic One",
    note: "أسماء البرامج والملاحظات بالإنجليزية. أسماء المستندات والمتطلبات مترجمة.",
    docs: {
      photo_id: "بطاقة هوية بصورة", income_earned: "كعوب الرواتب", utility_bill: "فاتورة المرافق",
      tax_return: "الإقرار الضريبي", benefits_letter: "خطاب منح الإعانات",
      bank_statement: "كشف حساب مصرفي", lease: "عقد الإيجار",
      birth_certificate: "شهادة الميلاد", clinician_cert: "نموذج موقّع من طبيب أو أخصائي اجتماعي",
      immigration_doc: "وثيقة الهجرة",
    },
    wSingle: "مستند واحد", wDays: (n) => `مؤرخ خلال آخر ${n} يوماً`,
    wCount: (n) => `أحدث ${n}`, wRow: (n) => `${n} متتالية`,
    wMonths: (n) => `تغطي آخر ${n} أشهر`,
    wRange: (a, b) => `من ${a} إلى ${b} أشهر — راجع الإعلان`,
    wFreq: (w, b) => `${w} إذا كان الراتب أسبوعياً، و${b} إذا كان كل أسبوعين`,
    wCal: "من شهر تقديم الطلب",
    wUnspec: "البرنامج يذكر «الأحدث» فقط — اسألهم عما يقبلونه",
    none: "لا توجد مستندات مطلوبة لتقديم الطلب.",
  },
};

const tr = (lang) => CT[lang] || CT.en;

function windowPhrase(w, t) {
  if (!w) return "";
  switch (w.type) {
    case "single": return t.wSingle;
    case "days": return t.wDays(w.value);
    case "count": return w.consecutive ? t.wRow(w.value) : t.wCount(w.value);
    case "months": return t.wMonths(w.value);
    case "range": return t.wRange(w.min, w.max);
    case "byFrequency": return t.wFreq(w.weekly, w.biweekly);
    case "calendarMonth": return t.wCal;
    default: return t.wUnspec;
  }
}

/* ---------------- pieces ---------------- */

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <span style={{ ...caps, fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: C.hairline }} />
    </div>
  );
}

function Requirement({ req, program, t, rtl }) {
  const limit = recencyLimitFor(program, req);
  return (
    <li style={{ padding: "16px 0", borderBottom: `1px solid ${C.hairline}`, display: "flex", gap: 14 }}>
      <span aria-hidden="true" style={{ color: C.gold, ...serif, fontSize: 17, lineHeight: 1.4 }}>—</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10 }}>
          <span style={{ ...sans, fontSize: 15.5, fontWeight: 600, color: C.ink }}>
            {t.docs[req.doc] || req.doc}
          </span>
          {limit != null && (
            <span style={{ ...mono, fontSize: 11, color: C.gold, background: C.cream, padding: "2px 7px" }}>
              {t.freshOne(limit)}
            </span>
          )}
        </div>
        <div style={{ ...sans, fontSize: 13.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
          {windowPhrase(req.window, t)}
        </div>
        {req.note && (
          <div style={{ ...sans, fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5, opacity: 0.9 }} dir="ltr">
            {req.note}
          </div>
        )}
        {req.status && (
          <div style={{ ...sans, fontSize: 12.5, color: C.warn, background: C.warnBg, padding: "8px 10px", marginTop: 8, lineHeight: 1.5 }}>
            {t.unverified}
          </div>
        )}
      </div>
    </li>
  );
}

/* ---------------- page ---------------- */

export default function ChecklistRoute({ lang, setLang }) {
  const { programId } = useParams();
  const navigate = useNavigate();
  const t = tr(lang);
  const rtl = lang === "ar";
  const program = programId ? getRules(programId) : null;
  const [printing] = useState(false);

  const choose = (id) => {
    if (window.umami) window.umami.track("checklist_generated", { program: id, lang });
    navigate("/checklist/" + id);
  };

  const outside = PROGRAM_RULES.filter((p) => !p.inBenefitsCal);
  const inside = PROGRAM_RULES.filter((p) => p.inBenefitsCal);

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ background: C.paper, minHeight: "100vh", color: C.ink }}>
      <style>{`@media print{ .no-print{display:none!important} body{background:#fff} }`}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 64px" }}>

        <header className="no-print">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link to="/" style={{ ...caps, fontSize: 10.5, color: C.muted, textDecoration: "none" }}>
              {rtl ? "→" : "←"} {t.back}
            </Link>
            <span style={{ ...caps, fontSize: 10.5, color: C.gold }}>{t.tag}</span>
          </div>
          <div style={{ height: 1, background: C.ink, margin: "16px 0" }} />
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }} aria-label="Language">
            {LANGS.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => { setLang(l.code); if (window.umami) window.umami.track("language_switch", { lang: l.code }); }}
                style={{
                  ...sans, fontSize: 12.5, padding: "0 0 2px",
                  color: lang === l.code ? C.ink : C.muted,
                  fontWeight: lang === l.code ? 600 : 400,
                  borderBottom: lang === l.code ? `1.5px solid ${C.gold}` : "1.5px solid transparent",
                }}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </header>

        <h1 style={{ ...serif, fontSize: 34, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
          {program ? program.name : t.title}
        </h1>
        {program && (
          <div style={{ ...sans, fontSize: 13.5, color: C.muted, marginTop: 8 }} dir="ltr">
            {program.agency}
          </div>
        )}
        <div style={{ height: 1, background: C.hairline, marginTop: 16 }} />

        {!program && (
          <>
            <p style={{ ...serif, fontSize: 19, color: C.muted, lineHeight: 1.55, padding: "32px 0 8px" }}>
              {t.intro}
            </p>

            <section style={{ padding: "24px 0" }}>
              <SectionLabel>{t.sepOut}</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {outside.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choose(p.id)}
                    style={{
                      textAlign: rtl ? "right" : "left", border: `1px solid ${C.hairline}`,
                      background: "transparent", padding: "14px 14px", minHeight: 44, cursor: "pointer",
                    }}
                  >
                    <div style={{ ...serif, fontSize: 15.5, color: C.ink }} dir="ltr">{p.name}</div>
                    <div style={{ ...sans, fontSize: 11.5, color: C.muted, marginTop: 4 }} dir="ltr">{p.agency}</div>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ paddingBottom: 24 }}>
              <SectionLabel>{t.sepIn}</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {inside.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choose(p.id)}
                    style={{
                      textAlign: rtl ? "right" : "left", border: `1px solid ${C.hairline}`,
                      background: C.cream, padding: "14px 14px", minHeight: 44, cursor: "pointer",
                    }}
                  >
                    <div style={{ ...serif, fontSize: 15.5, color: C.ink }} dir="ltr">{p.name}</div>
                    <div style={{ ...sans, fontSize: 11.5, color: C.muted, marginTop: 4 }} dir="ltr">{p.agency}</div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {program && (
          <>
            {program.recencyDays != null && (
              <div style={{ background: C.cream, border: `1px solid ${C.hairline}`, padding: "16px 20px", marginTop: 32 }}>
                <div style={{ ...sans, fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                  {t.freshAll(program.recencyDays)}
                </div>
              </div>
            )}

            <section style={{ padding: "36px 0 8px" }}>
              <SectionLabel>{t.need}</SectionLabel>
              {program.requires.length === 0 ? (
                <p style={{ ...sans, fontSize: 15, color: C.ink }}>{t.none}</p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", borderTop: `1px solid ${C.hairline}` }}>
                  {program.requires.map((req, i) => (
                    <Requirement key={i} req={req} program={program} t={t} rtl={rtl} />
                  ))}
                </ul>
              )}
            </section>

            {program.notes?.length > 0 && (
              <section style={{ padding: "24px 0" }}>
                <SectionLabel>{t.notes}</SectionLabel>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }} dir="ltr">
                  {program.notes.map((n, i) => (
                    <li key={i} style={{ ...sans, fontSize: 13.5, color: C.muted, lineHeight: 1.6, padding: "6px 0", display: "flex", gap: 10 }}>
                      <span style={{ color: C.goldLine }}>·</span>{n}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section style={{ marginTop: 24 }}>
              <div style={{ background: C.navy, padding: "28px 26px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, insetInlineStart: 0, width: "100%", height: 3, background: C.gold }} />
                <span style={{ ...caps, fontSize: 10.5, color: C.goldLine }}>{t.apply}</span>
                <a
                  href={program.applyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...sans, fontSize: 14, fontWeight: 600, color: C.navy, background: C.goldLine,
                    display: "inline-block", marginTop: 16, padding: "12px 20px", textDecoration: "none",
                  }}
                  dir="ltr"
                >
                  {program.system} {rtl ? "←" : "→"}
                </a>
                {program.phone && (
                  <div style={{ ...mono, fontSize: 12, color: "rgba(245,242,234,0.7)", marginTop: 18 }}>
                    {t.phone}: <bdi dir="ltr">{program.phone}</bdi>
                  </div>
                )}
                {program.languages?.length > 0 && (
                  <div style={{ ...mono, fontSize: 11.5, color: "rgba(245,242,234,0.55)", marginTop: 8 }}>
                    {t.langs}: <bdi dir="ltr">{program.languages.join(" · ")}</bdi>
                  </div>
                )}
              </div>
            </section>

            <div className="no-print" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ ...sans, fontSize: 13.5, fontWeight: 600, color: C.navy, background: "transparent", border: `1px solid ${C.navy}`, padding: "11px 18px", minHeight: 44, cursor: "pointer" }}
              >
                {t.print}
              </button>
              <Link
                to="/checklist"
                style={{ ...sans, fontSize: 13.5, color: C.muted, border: `1px solid ${C.hairline}`, padding: "11px 18px", minHeight: 44, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                {t.pick}
              </Link>
            </div>
          </>
        )}

        <footer style={{ paddingTop: 40 }}>
          <div style={{ ...sans, fontSize: 11.5, color: C.muted, lineHeight: 1.6 }} dir={rtl ? "rtl" : "ltr"}>
            {t.note}
          </div>
        </footer>
      </div>
    </div>
  );
}
