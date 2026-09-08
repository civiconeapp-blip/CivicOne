/**
 * programRules.js — what each San Francisco program actually demands.
 *
 * This is the rules layer the document wallet reads. programs.js teaches a
 * resident how a system works; this file encodes the machine-checkable part:
 * which document classes a program requires, how many, over what window, and
 * how fresh they have to be.
 *
 * WHY THIS FILE EXISTS
 * "Proof of income" is not one thing. Across the programs below it means nine
 * different things — 30 days, 2 stubs, 3 consecutive stubs, 3 months, 3-6
 * months, 4 weekly or 2 biweekly, the application month, or an unspecified
 * "most recent". Recency limits collide too: Early Learning for All rejects a
 * document at 31 days that SFUSD accepts at 45. A resident cannot know this,
 * and no other tool encodes it.
 *
 * INTEGRITY RULE (same as districts.js and programs.js)
 * Every requirement carries `source` and `verified`. Nothing is inferred from
 * a program's category. Where an official list could not be retrieved, the
 * requirement is marked `status: "unverified"` and MUST render as "check with
 * the program" rather than as fact. Never invent a requirement.
 *
 * All entries verified 2026-09-06 unless noted otherwise.
 *
 * KNOWN EXCEPTION: the CalFresh entry (added 2026-09-08) has verified
 * structural fields but an UNVERIFIED document list — SFHSA's pages could not
 * be reached when it was written. It is the one program here whose
 * requirements have not been read off an official page. See the comment on
 * that entry before treating any of its requirements as fact.
 */

/* ------------------------------------------------------------------ *
 * Document classes
 * ------------------------------------------------------------------ */

/**
 * The closed set of document classes the wallet understands.
 *
 * `neverStored: true` means a program may ACCEPT this class, and the checklist
 * may say so, but the wallet must never offer a slot for it, never hold a
 * copy, and never transmit one. Immigration paperwork belonging to Tenderloin
 * and Western Addition residents is not ours to hold. Social Security cards
 * are deliberately absent from this list entirely.
 */
export const DOC_CLASSES = [
  { id: "photo_id",         label: "Photo ID",              dated: false },
  { id: "income_earned",    label: "Pay stubs",             dated: true, collection: true },
  { id: "utility_bill",     label: "Utility bill",          dated: true },
  { id: "tax_return",       label: "Tax return",            dated: true },
  { id: "benefits_letter",  label: "Benefits award letter", dated: true },
  { id: "bank_statement",   label: "Bank statement",        dated: true, collection: true },
  { id: "lease",            label: "Lease or rental agreement", dated: true },
  { id: "birth_certificate",label: "Birth certificate",     dated: false },
  { id: "clinician_cert",   label: "Clinician certification", dated: true, external: true },
  { id: "immigration_doc",  label: "Immigration document",  dated: false, neverStored: true },
];

/* ------------------------------------------------------------------ *
 * Window types
 * ------------------------------------------------------------------ *
 * single             one document is enough
 * days   {value}     documents dated within the last N days
 * count  {value, consecutive}   N most recent items
 * months {value}     documents covering the last N months
 * range  {min, max}  a span the program states loosely ("3 to 6 months")
 * byFrequency {weekly, biweekly}  N items, count depends on pay frequency
 * calendarMonth {which:"application"}  items from the month of application
 * unspecified {label}  the program says only "most recent" — we cannot
 *                      compute this, so the UI must ask the resident
 * ------------------------------------------------------------------ */

const S = {
  liheap:     "https://www.caliheapapply.com/",
  csd:        "https://www.csd.ca.gov/pages/liheapprogram.aspx",
  pge:        "https://www.pge.com/en/account/billing-and-assistance/financial-assistance/california-alternate-rates-for-energy-program.html",
  pgePev:     "https://www.pge.com/en/account/billing-and-assistance/financial-assistance/care-fera-post-enrollment-verification.html",
  sfpuc:      "https://www.sfpuc.gov/accounts-services/bill-relief/customer-assistance-program-waterwastewater",
  dahlia:     "https://www.sf.gov/after-rental-housing-lottery",
  dahliaBmr:  "https://sfmohcd.org/sites/default/files/Resident%20Selection%20Criteria/150%20Van%20Ness%20Resident%20Selection%20Criteria.pdf",
  erap:       "https://www.sf.gov/sf-erap-required-verification-documents",
  hsf:        "https://healthysanfrancisco.org/hsf-program/required-documents/",
  lifeline:   "https://www.sfmta.com/fares/lifeline-pass",
  lifelinePdf:"https://www.sfmta.com/sites/default/files/reports-and-documents/2019/09/lifeline_app_with_benefit_cards_hsa_09192019.pdf",
  clipper:    "https://www.sfmta.com/fares/clipper-start",
  paratransit:"https://www.sfmta.com/getting-around/accessibility/paratransit/eligibility-and-registration",
  ihss:       "https://www.sfhsa.org/services/disability-aging/home-care/home-supportive-services-ihss/receive-home-supportive-services/become-ihss-recipient",
  wic:        "https://www.sf.gov/information--do-i-qualify-wic",
  sfusd:      "https://www.sfusd.edu/schools/enroll/apply/requirements",
  elfa:       "https://provider.sfdec.org/wp-content/uploads/ELFA-Family-Enrollment-Form-English-FY-25-26-Final-v.2-fillable.pdf",
  caap:       "https://www.sfhsa.org/services/financial-assistance/county-adult-assistance-programs-caap/apply-caap/types-verification-county-adult-assistance-programs-caap",
  calfresh:   "https://www.sfhsa.org/services/food-nutrition/calfresh",
  cdss:       "https://www.cdss.ca.gov/inforesources/cdss-programs/calfresh-outreach/getcalfresh-transition",
};

const V = "2026-09-06";

export const PROGRAM_RULES = [
  /* ---------------- Energy & utilities ---------------- */
  {
    id: "liheap",
    name: "LIHEAP — Home Energy Assistance",
    agency: "SF-Peninsula Energy Services (SFPES)",
    system: "caliheapapply.com",
    inBenefitsCal: false,
    applyHref: S.liheap,
    phone: "415-416-6660", // verified sfpes.org 2026-09-06
    languages: ["en", "es"],
    fileFormat: "PDF only — other formats are not processed",
    requires: [
      { doc: "utility_bill", window: { type: "single" }, note: "All pages of the most recent bill, for every energy provider", source: S.liheap, verified: V },
      { doc: "income_earned", window: { type: "days", value: 30 }, appliesTo: "all adults in the household", source: S.liheap, verified: V },
      { doc: "photo_id", window: { type: "single" }, note: "Person applying", source: S.liheap, verified: V },
    ],
    notes: ["Shut-off notices should be included if you have received any.", "SFPES states assistance is not guaranteed even if you meet income limits."],
  },
  {
    id: "pge-care-fera",
    name: "PG&E CARE / FERA discount",
    agency: "Pacific Gas & Electric",
    system: "energyinsight.pge.com",
    inBenefitsCal: false,
    applyHref: S.pge,
    phone: "1-866-743-5832", // verified pge.com 2026-09-06
    languages: ["en", "es", "zh"],
    requires: [],
    laterRequires: [
      { doc: "benefits_letter", window: { type: "single" }, note: "Letter showing household participation in a qualifying public assistance program", source: S.pgePev, verified: V },
      { doc: "income_earned", window: { type: "unspecified", label: "proof of household income" }, status: "unverified", note: "PG&E does not publish an itemized list of accepted income documents on its public pages", source: S.pgePev, verified: V },
    ],
    recencyDays: null,
    responseDays: 45, // days to respond to a post-enrollment verification notice
    notes: ["No documents are required to apply — income is self-certified.", "PG&E may later select you for Post-Enrollment Verification; you then have 45 days to respond."],
  },
  {
    id: "sfpuc-cap",
    name: "SFPUC water & sewer discount",
    agency: "San Francisco Public Utilities Commission",
    system: "SFPUC application form",
    inBenefitsCal: false,
    hsaDataMatch: true,
    applyHref: S.sfpuc,
    phone: "415-551-3000", // verified sfpuc.gov 2026-09-06
    languages: ["en", "es", "zh", "tl", "vi", "ar", "ru", "sm"],
    requires: [],
    alternateRequires: [
      { doc: "income_earned", window: { type: "count", value: 2, consecutive: true }, note: "Only if you choose manual verification instead of the data match", source: S.sfpuc, verified: V },
      { doc: "benefits_letter", window: { type: "single" }, note: "Social Security Benefit Verification Letter, or unemployment statement", source: S.sfpuc, verified: V },
    ],
    notes: ["No documents required on the default path — SFPUC verifies income through TransUnion or directly with SF Human Services Agency.", "This is one of two SF programs that already accept county benefit data instead of resident paperwork."],
  },

  /* ---------------- Housing ---------------- */
  {
    id: "dahlia",
    name: "DAHLIA affordable housing",
    agency: "Mayor's Office of Housing and Community Development",
    system: "housing.sfgov.org",
    inBenefitsCal: false,
    applyHref: "https://housing.sfgov.org/",
    languages: ["en", "es", "zh", "tl"],
    stage: "Nothing is required to enter the lottery. This list applies after you are selected.",
    requires: [
      { doc: "photo_id", window: { type: "single" }, note: "Every household member 18 and over", source: S.dahlia, verified: V },
      { doc: "income_earned", window: { type: "range", min: 3, max: 6, unit: "months" }, note: "Listings differ — some BMR properties ask for 3 consecutive stubs", source: S.dahlia, verified: V },
      { doc: "tax_return", window: { type: "months", value: 24 }, note: "Previous 1 to 2 years, with W-2s", source: S.dahliaBmr, verified: V },
      { doc: "bank_statement", window: { type: "range", min: 3, max: 6, unit: "months" }, note: "Every liquid asset account, including custodial accounts for minors", source: S.dahliaBmr, verified: V },
      { doc: "lease", window: { type: "single" }, note: "Previous addresses and landlord contact information", source: S.dahlia, verified: V },
    ],
    preferenceProof: { recencyDays: 45, note: "Documents claiming a housing preference must be dated within 45 days and show your name and current address", source: S.dahlia, verified: V },
    notes: ["Some BMR properties charge a $35 application fee for credit and background checks.", "Each listing sets its own requirements — always check the listing."],
  },
  {
    id: "sf-erap",
    name: "SF Emergency Rental Assistance",
    agency: "City and County of San Francisco",
    system: "sferap.com",
    inBenefitsCal: false,
    applyHref: "https://sferap.com/",
    phone: "415-653-5744", // verified sf.gov 2026-09-06
    languages: [],
    languagesStatus: "unverified",
    requires: [
      { doc: "photo_id", window: { type: "single" }, source: S.erap, verified: V },
      { doc: "income_earned", window: { type: "unspecified", label: "most recent" }, appliesTo: "all household members over 18 with income", source: S.erap, verified: V },
      { doc: "utility_bill", window: { type: "single" }, note: "As proof of San Francisco residency — a lease or government letter also works", source: S.erap, verified: V },
      { doc: "lease", window: { type: "single" }, note: "Plus a rent ledger or pay-or-quit notice showing what is owed", source: S.erap, verified: V },
    ],
    notes: ["A signed W-9 from the landlord or master tenant is also required.", "Staff will work with applicants who cannot produce these documents.", "Confirm the program is currently accepting applications before relying on it."],
    status: "unverified-intake",
  },

  /* ---------------- Health ---------------- */
  {
    id: "healthy-sf",
    name: "Healthy San Francisco",
    agency: "SF Department of Public Health",
    system: "HSFConnect",
    inBenefitsCal: false,
    applyHref: "https://healthysanfrancisco.org/hsf-program/enrollment-information/",
    phone: "415-777-9992", // verified healthysanfrancisco.org 2026-09-06
    languages: ["en", "es", "zh", "vi", "tl"],
    recencyDays: 45,
    requires: [
      { doc: "photo_id", window: { type: "single" }, note: "Driver's license, SF City ID, passport, student ID, consular ID, or residency card", source: S.hsf, verified: V },
      { doc: "utility_bill", window: { type: "single" }, recencyDays: 45, note: "Any one proof of residency showing your name, dated within 45 days", source: S.hsf, verified: V },
      { doc: "income_earned", window: { type: "count", value: 3, consecutive: false }, recencyDays: 45, note: "2 to 3 most recent pay stubs, one proof per household member", source: S.hsf, verified: V },
    ],
    acceptsButWeNeverStore: ["immigration_doc"],
    notes: ["Enrollment requires an appointment with a Certified Application Assistor at one of 30+ sites.", "Not insurance — a health access program with limited services."],
  },
  {
    id: "ihss",
    name: "IHSS — In-Home Supportive Services",
    agency: "SF HSA, Disability and Aging Services",
    system: "Form 3012 referral",
    inBenefitsCal: false,
    medicalGate: true,
    applyHref: S.ihss,
    phone: "415-355-6700", // verified sfhsa.org 2026-09-06
    languages: ["en", "es", "zh", "tl", "vi", "ru"],
    responseDays: 45,
    requires: [
      { doc: "clinician_cert", window: { type: "single" }, note: "Form SOC 873, completed by a licensed health care professional and returned within 45 days", source: S.ihss, verified: V },
    ],
    notes: ["No income documents, no ID, no proof of residency — Medi-Cal enrollment already carries the means test.", "An IHSS social worker conducts an in-home assessment."],
  },

  /* ---------------- Transit ---------------- */
  {
    id: "muni-lifeline",
    name: "Muni Lifeline pass",
    agency: "SFMTA",
    system: "clipperstartcard.com",
    inBenefitsCal: false,
    hsaDataMatch: true,
    applyHref: S.lifeline,
    languages: ["en", "es", "zh", "tl", "vi", "ko", "ja", "ru", "fr", "ar"],
    sunset: "2027-01-01", // transitions entirely to Clipper START
    requires: [
      { doc: "photo_id", window: { type: "single" }, note: "Driver's license, consular ID, SF City ID, or passport", source: S.lifelinePdf, verified: V, status: "stale-source" },
      { doc: "utility_bill", window: { type: "single" }, note: "Most recent utility bill, bank statement, or government letter as proof of residency", source: S.lifelinePdf, verified: V, status: "stale-source" },
      { doc: "tax_return", window: { type: "single" }, note: "Most recent year, signed, with all attachments — or a Section 8 award letter, Medi-Cal card, or EBT card", source: S.lifelinePdf, verified: V, status: "stale-source" },
    ],
    notes: ["SFMTA can verify eligibility directly against SF HSA records for existing HSA clients, removing the document requirement entirely.", "The document list above comes from a 2019 application form — SFMTA's current page could not be retrieved. Verify before relying on it."],
    status: "unverified-current-list",
  },
  {
    id: "clipper-start",
    name: "Clipper START regional discount",
    agency: "Metropolitan Transportation Commission",
    system: "clipperstartcard.com",
    inBenefitsCal: false,
    applyHref: S.clipper,
    languages: ["en", "es", "zh", "tl", "vi", "ko", "ja", "ru", "fr", "ar"],
    languagesStatus: "unverified",
    anyOf: true,
    requires: [
      { doc: "tax_return", window: { type: "single" }, note: "Last year's federal return — OR an EBT card, Medi-Cal card, county benefits letter, or Muni Lifeline card number", source: S.clipper, verified: V },
    ],
    notes: ["Ages 19-64 only.", "Only one proof is needed, and three of the five accepted options are things another program already issued you."],
  },
  {
    id: "sf-paratransit",
    name: "SF Paratransit / SF Access",
    agency: "SFMTA Mobility Management Center",
    system: "Paper application",
    inBenefitsCal: false,
    applyHref: S.paratransit,
    phone: "415-351-7000", // verified sfmta.com 2026-09-06
    languages: ["en", "es", "zh", "vi", "tl", "ko", "ja", "ru", "fr"],
    requires: [
      { doc: "clinician_cert", window: { type: "single" }, note: "Authorization to Release Information, naming a doctor, therapist, or social worker who can verify the disability", source: S.paratransit, verified: V },
    ],
    notes: ["Eligibility is functional, not income-based.", "No ID, no residency proof, no income documents required.", "A second-level in-person functional assessment may follow."],
  },

  /* ---------------- Children & family ---------------- */
  {
    id: "elfa",
    name: "Early Learning for All (child care)",
    agency: "SF Department of Early Childhood",
    system: "earlylearningsf.org",
    inBenefitsCal: false,
    applyHref: "https://earlylearningsf.org/",
    phone: "415-343-3300", // Children's Council, verified childrenscouncil.org 2026-09-06
    languages: ["en", "es", "zh"],
    recencyDays: 30,
    requires: [
      { doc: "birth_certificate", window: { type: "single" }, note: "For all children in the family under 18", source: S.elfa, verified: V },
      { doc: "utility_bill", window: { type: "single" }, recencyDays: 30, note: "Any one residency proof dated within 30 days — lease, utility bill, phone bill, or insurance policy", source: S.elfa, verified: V },
      { doc: "income_earned", window: { type: "byFrequency", weekly: 4, biweekly: 2 }, recencyDays: 30, note: "For all family members counted in household size", source: S.elfa, verified: V },
    ],
    notes: ["A Self-Declaration Form can substitute for income documents.", "The 30-day recency limit is the strictest in the city — a document accepted by SFUSD at 45 days is rejected here."],
  },
  {
    id: "sfusd",
    name: "SFUSD school enrollment",
    agency: "San Francisco Unified School District",
    system: "Family Portal / ParentVUE",
    inBenefitsCal: false,
    applyHref: S.sfusd,
    phone: "415-241-6085", // verified sfusd.edu 2026-09-06
    languages: ["en", "es", "zh", "ar", "tl", "vi"],
    recencyDays: 45,
    requires: [
      { doc: "birth_certificate", window: { type: "single" }, note: "Or passport, baptism certificate, registrar statement, or an affidavit of birth", source: S.sfusd, verified: V },
      { doc: "utility_bill", window: { type: "single" }, recencyDays: 45, note: "Showing the parent or guardian's name and address, within 45 days — a pay stub or government letter also works", source: S.sfusd, verified: V },
      { doc: "photo_id", window: { type: "single" }, note: "Any document with the parent or guardian's name and photo", source: S.sfusd, verified: V },
      { doc: "clinician_cert", window: { type: "single" }, note: "TB clearance within one year, plus required immunization records", source: S.sfusd, verified: V },
    ],
    notes: ["SFUSD provides an affidavit fallback for birth, residency and identity — the only program in the city that does so at every tier.", "School meals are free for all students regardless of income; the income form is optional and unlocks other benefits."],
  },
  {
    id: "wic",
    name: "WIC",
    agency: "San Francisco WIC Program",
    agencyStatus: "unverified",
    system: "State WIC (MyFamily)",
    inBenefitsCal: false,
    applyHref: S.wic,
    languages: [],
    languagesStatus: "unverified",
    requires: [
      { doc: "photo_id", window: { type: "single" }, note: "California ID, driver's license, birth certificate, or Medi-Cal card", source: S.wic, verified: V },
      { doc: "utility_bill", window: { type: "single" }, note: "Any document verifying your current address", source: S.wic, verified: V },
      { doc: "income_earned", window: { type: "unspecified", label: "current documents" }, note: "A Medi-Cal card also satisfies this — enrollment in Medi-Cal, CalFresh or CalWORKs confers automatic income eligibility", source: S.wic, verified: V },
    ],
    notes: ["Accepted documents are loosely specified and left partly to clinic discretion."],
  },

  /* ---------------- Cash & food assistance (inside BenefitsCal) ---------------- */
  {
    /**
     * CalFresh — the largest food program in the city, and the one most
     * residents arrive already looking for.
     *
     * PROVENANCE, AND WHY THIS ENTRY IS PARTLY UNVERIFIED
     * SFHSA's CalFresh pages could not be retrieved when this entry was
     * written (2026-09-08) — the network refused the request, so no official
     * verification list was read. Under this file's integrity rule that
     * leaves two kinds of field here, and they must not be confused:
     *
     *   - Structural facts below (agency, BenefitsCal routing, phone) carry
     *     their own dated provenance, inherited from the already-verified
     *     CalFresh guide in programs.js.
     *   - Every entry in `requires` is marked status:"unverified" with
     *     verified:null, because the document classes are drawn from that
     *     resident-facing guide's plain-language summary, NOT from SFHSA's
     *     itemized verification list. The checklist therefore renders each
     *     one as "check with the program before you go" rather than as fact.
     *
     * TO FINISH THIS ENTRY: read the SFHSA CalFresh verification page, set
     * real windows (CalFresh recency limits are not encoded here because
     * none were confirmed), drop the status flags, and stamp verified.
     */
    id: "calfresh",
    name: "CalFresh — food benefits",
    agency: "SF Human Services Agency",
    system: "BenefitsCal",
    inBenefitsCal: true,
    // CDSS routes all applicants to BenefitsCal: GetCalFresh stopped
    // transmitting applications 2026-06-30 and now only does outreach.
    // Source: S.cdss, verified 2026-09-06 (carried from programs.js)
    applyHref: "https://benefitscal.com/",
    phone: "1-855-355-5757", // SFHSA CalFresh service line, verified sfhsa.org 2026-07-15
    languages: [],
    languagesStatus: "unverified",
    requires: [
      { doc: "photo_id", window: { type: "single" }, status: "unverified", source: S.calfresh, verified: null },
      {
        doc: "utility_bill",
        window: { type: "unspecified", label: "proof of your current address" },
        note: "A lease, a utility bill, or addressed mail — CalFresh does not publish which it prefers",
        status: "unverified",
        source: S.calfresh,
        verified: null,
      },
      {
        doc: "income_earned",
        window: { type: "unspecified", label: "proof of income for everyone in the household" },
        appliesTo: "all household members with income",
        note: "Pay stubs or benefit award letters. No recency window is encoded because none was confirmed from an official page",
        status: "unverified",
        source: S.calfresh,
        verified: null,
      },
    ],
    // Non-citizen applicants may be asked for immigration paperwork. The
    // wallet names it so nobody is ambushed at the interview, and then
    // refuses to hold it — same stance as CAAP.
    acceptsButWeNeverStore: ["immigration_doc"],
    notes: [
      "Document requirements here are unconfirmed — SFHSA's verification page could not be read when this entry was written. Treat every one as 'check before you go'.",
      "CalFresh also asks for Social Security numbers for the household members applying — not for everyone in the home. Civic One never stores them and offers no slot for them.",
      "A phone interview is part of the application. Answer calls from unknown local numbers during your application window.",
      "Most applications take about 30 days; some households qualify for expedited 3-day service.",
      "Being enrolled in CalFresh confers automatic income eligibility for WIC.", // source: S.wic, verified 2026-09-06
    ],
  },
  {
    id: "caap",
    name: "CAAP — County Adult Assistance Programs",
    agency: "SF Human Services Agency",
    system: "BenefitsCal",
    inBenefitsCal: true,
    applyHref: "https://benefitscal.com/",
    phone: "833-879-1365", // verified sfhsa.org 2026-09-06
    languages: ["en", "es", "zh", "tl", "vi", "ru"],
    requires: [
      { doc: "photo_id", window: { type: "single" }, source: S.caap, verified: V },
      { doc: "birth_certificate", window: { type: "single" }, note: "Or passport, Certificate of Naturalization, or a Social Security Administration print-out", source: S.caap, verified: V },
      { doc: "income_earned", window: { type: "calendarMonth", which: "application" }, note: "Pay stubs from the month you apply", source: S.caap, verified: V },
      { doc: "lease", window: { type: "single" }, note: "Rental agreement, rent receipts, mortgage bill, or a landlord statement", source: S.caap, verified: V },
      { doc: "bank_statement", window: { type: "single" }, source: S.caap, verified: V },
      { doc: "benefits_letter", window: { type: "single" }, note: "Award letters for Social Security, Veterans, Unemployment or Disability", source: S.caap, verified: V },
    ],
    acceptsButWeNeverStore: ["immigration_doc"],
    notes: ["The longest document list of any San Francisco program.", "Uploads through BenefitsCal cannot be retrieved by the resident afterwards, cannot be removed, and must be under 8MB and not password-protected."],
  },
];

/* ------------------------------------------------------------------ *
 * Helpers — pure, no React, no side effects
 * ------------------------------------------------------------------ */

export const getRules = (id) => PROGRAM_RULES.find((p) => p.id === id) || null;

export const getDocClass = (id) => DOC_CLASSES.find((d) => d.id === id) || null;

/** Recency only means something for documents that carry their own date. */
export const isDatedClass = (id) => Boolean(getDocClass(id)?.dated);

/** Programs that do NOT run through BenefitsCal — Civic One's differentiated ground. */
export const outsideBenefitsCal = () => PROGRAM_RULES.filter((p) => !p.inBenefitsCal);

/** True when a requirement's source could not be confirmed and must render as a caveat. */
export const isUnverified = (req) => Boolean(req.status) || req.status === "unverified";

/** Days between a document's own date and `asOf`. Null when undated. */
export function ageInDays(doc, asOf = new Date()) {
  if (!doc?.documentDate) return null;
  const then = new Date(doc.documentDate);
  if (Number.isNaN(then.getTime())) return null;
  return Math.floor((asOf - then) / 86400000);
}

/** The recency limit that applies to a requirement, falling back to the program's. */
export const recencyLimitFor = (program, req) =>
  req.recencyDays ?? program.recencyDays ?? null;

/**
 * Pick the documents that satisfy a window from a resident's collection.
 * Returns { selected, shortfall, askResident }.
 * `askResident` is true when the program's own wording is too vague to compute
 * — we never guess on the resident's behalf.
 */
export function selectForWindow(docs, window, asOf = new Date(), datedClass = true) {
  // A birth certificate has no meaningful date for our purposes; a pay stub does.
  const dated = datedClass
    ? [...docs]
        .filter((d) => d.documentDate)
        .sort((a, b) => new Date(b.documentDate) - new Date(a.documentDate))
    : [...docs];

  switch (window.type) {
    case "single":
      return { selected: dated.slice(0, 1), shortfall: dated.length ? 0 : 1, askResident: false };

    case "days": {
      const inWindow = dated.filter((d) => ageInDays(d, asOf) <= window.value);
      return { selected: inWindow, shortfall: inWindow.length ? 0 : 1, askResident: false };
    }

    case "count":
      return {
        selected: dated.slice(0, window.value),
        shortfall: Math.max(0, window.value - dated.length),
        askResident: false,
      };

    case "months": {
      const cutoff = window.value * 30;
      const inWindow = dated.filter((d) => ageInDays(d, asOf) <= cutoff);
      return { selected: inWindow, shortfall: inWindow.length ? 0 : 1, askResident: false };
    }

    case "range": {
      const cutoff = window.max * 30;
      const inWindow = dated.filter((d) => ageInDays(d, asOf) <= cutoff);
      return { selected: inWindow, shortfall: inWindow.length ? 0 : 1, askResident: false };
    }

    case "byFrequency": {
      // We cannot know pay frequency without asking; default to the larger ask.
      const need = window.weekly ?? window.biweekly ?? 1;
      return {
        selected: dated.slice(0, need),
        shortfall: Math.max(0, need - dated.length),
        askResident: true,
      };
    }

    case "calendarMonth": {
      const now = asOf.getMonth();
      const yr = asOf.getFullYear();
      const inMonth = dated.filter((d) => {
        const t = new Date(d.documentDate);
        return t.getMonth() === now && t.getFullYear() === yr;
      });
      return { selected: inMonth, shortfall: inMonth.length ? 0 : 1, askResident: false };
    }

    case "unspecified":
    default:
      return { selected: dated.slice(0, 1), shortfall: 0, askResident: true };
  }
}

/**
 * Evaluate a resident's wallet against one program.
 * Returns a per-requirement verdict the UI can render directly.
 * Verdicts: "ready" | "missing" | "expired" | "expiring" | "ask"
 */
export function evaluateReadiness(programId, wallet = {}, asOf = new Date()) {
  const program = getRules(programId);
  if (!program) return null;

  const items = (program.requires || []).map((req) => {
    const docs = wallet[req.doc] || [];
    const limit = recencyLimitFor(program, req);
    const { selected, shortfall, askResident } = selectForWindow(
      docs, req.window, asOf, isDatedClass(req.doc)
    );

    let verdict = "ready";
    let daysLeft = null;

    if (!docs.length || shortfall > 0) {
      verdict = "missing";
    } else if (limit != null && isDatedClass(req.doc)) {
      const oldest = Math.max(...selected.map((d) => ageInDays(d, asOf) ?? 0));
      daysLeft = limit - oldest;
      if (daysLeft < 0) verdict = "expired";
      else if (daysLeft <= 7) verdict = "expiring";
    }
    if (verdict === "ready" && askResident) verdict = "ask";

    return {
      doc: req.doc,
      verdict,
      daysLeft,
      selected,
      note: req.note || null,
      unverified: Boolean(req.status),
      source: req.source,
    };
  });

  const ready = items.filter((i) => i.verdict === "ready").length;

  return {
    program,
    items,
    ready,
    total: items.length,
    complete: ready === items.length && items.length > 0,
  };
}
