/**
 * programs.js — single source of truth for application-guide subpages.
 *
 * Each entry powers a route at /apply/:slug (see ProgramGuide.jsx + App.jsx).
 * Content here is deliberately high-level and links out to the official
 * application site for anything that changes often (income limits, exact
 * documents, processing times). Do not hardcode benefit amounts or
 * eligibility thresholds here — verify and link instead, the same way
 * districts.js verifies and dates its own facts.
 *
 * English content only for now. If you add other languages, mirror the
 * i18n.js pattern (one object per language code) rather than inlining
 * translations here — see ProgramGuide.jsx for the fallback behavior
 * when a language isn't available yet.
 */

export const PROGRAMS = [
  {
    slug: "food",
    navLabel: "Food & CalFresh",
    navDesc: "Groceries, WIC, and food assistance",
    title: "Applying for Food Assistance",
    intro:
      "CalFresh (California's SNAP program) helps pay for groceries. Most applications take about 30 days, and some households qualify for expedited (3-day) service.",
    eligibilityNote:
      "Eligibility depends on household size and income. Use the official screening tool below to check before you apply — it takes about 5 minutes and doesn't require an account.",
    documents: [
      "Photo ID",
      "Proof of address (lease, utility bill, or mail)",
      "Proof of income for everyone in the household (pay stubs, benefit letters)",
      "Social Security numbers for household members applying (not required for everyone in the home)",
    ],
    steps: [
      {
        title: "Check if you may qualify",
        desc: "Use the pre-screening tool to get a rough estimate before you start the full application. This step is optional but saves time.",
      },
      {
        title: "Gather your documents",
        desc: "Have ID, proof of address, and proof of income ready. You can still start the application without everything — you can upload documents later.",
      },
      {
        title: "Submit your application",
        desc: "Apply online, or call the county's CalFresh line if you'd rather apply by phone or need help in another language.",
      },
      {
        title: "Complete your phone interview",
        desc: "The county will call to confirm your information. Answer calls from unknown local numbers during your application window so you don't miss it.",
      },
      {
        title: "Get your EBT card",
        desc: "If approved, your Golden State Advantage EBT card arrives by mail. Activate it using the number on the back before your first use.",
      },
    ],
    officialHref: "https://www.getcalfresh.org",
    officialLabel: "Start your application at GetCalFresh.org",
    phoneLabel: "SFHSA CalFresh service line",
    phone: "1-855-355-5757", // verified sfhsa.org 2026-07-15
  },
  {
    slug: "housing",
    navLabel: "Housing Assistance",
    navDesc: "Rental support, affordable housing, and tenant rights",
    title: "Applying for Housing Assistance",
    intro:
      "Housing help in San Francisco generally falls into three tracks: affordable housing listings (DAHLIA), rental subsidies, and tenant-rights support if you're already housed but at risk.",
    eligibilityNote:
      "Each listing on DAHLIA sets its own income limits and preferences (such as living or working in the district). Rental subsidy programs have separate waitlists that may be closed at times — check current status on the official site before applying.",
    documents: [
      "Photo ID for all adult household members",
      "Proof of income (pay stubs, benefit letters, or a letter of zero income)",
      "Household size and composition (names, ages, relationships)",
      "Current address / proof of San Francisco residency, if required for a listing",
    ],
    steps: [
      {
        title: "Decide which track fits your situation",
        desc: "DAHLIA lists affordable rental and ownership units you apply for individually. Rental subsidies (like Section 8) provide ongoing help paying market-rate rent. Tenant-rights support is for renters facing eviction, harassment, or habitability issues.",
      },
      {
        title: "Create a DAHLIA account",
        desc: "One account lets you browse and apply to any open listing. You can save your household information so you don't re-enter it for every listing.",
      },
      {
        title: "Gather your documents",
        desc: "Have ID and income proof ready for everyone in the household — most listings ask for this before finalizing an application.",
      },
      {
        title: "Apply to open listings or waitlists",
        desc: "Listings open and close on their own schedules. Apply to several at once to improve your chances, and note each listing's deadline.",
      },
      {
        title: "Know your rights as a tenant",
        desc: "If you're already housed and dealing with an eviction notice, repairs, or harassment, the Rent Board and tenant counseling organizations can advise you at no cost.",
      },
    ],
    officialHref: "https://housing.sfgov.org",
    officialLabel: "Browse listings & apply at housing.sfgov.org",
    phoneLabel: "SF Rent Board counseling",
    phone: "1-415-252-4600", // verified sf.gov 2026-07-15
  },
  {
    slug: "health",
    navLabel: "Health Coverage",
    navDesc: "Medi-Cal, Healthy SF, and free or low-cost clinics",
    title: "Applying for Health Coverage",
    intro:
      "Most San Francisco residents can get free or low-cost health coverage through Medi-Cal or Healthy SF, regardless of immigration status. Coverage includes doctor visits, urgent care, and prescriptions.",
    eligibilityNote:
      "Medi-Cal eligibility is based on household income and size. If you don't qualify for Medi-Cal, Healthy SF covers SF residents at any income level through a sliding-scale fee. The application will route you to the right one.",
    documents: [
      "Photo ID",
      "Proof of San Francisco residency (lease, utility bill, or mail)",
      "Proof of income, if you have it (pay stubs or a letter of zero income)",
      "Immigration status documents are not required to apply — coverage is available regardless of status",
    ],
    steps: [
      {
        title: "Check your options",
        desc: "You don't need to know in advance whether you qualify for Medi-Cal or Healthy SF — one application checks both.",
      },
      {
        title: "Gather what you have",
        desc: "Bring ID and proof of address. Income documents help but aren't required to start — you can apply with a self-declared income and follow up later.",
      },
      {
        title: "Apply online or in person",
        desc: "Apply through BenefitsCal, or visit a Human Services Agency office if you'd like in-person help completing the form.",
      },
      {
        title: "Get your confirmation",
        desc: "You'll receive a notice by mail confirming enrollment and, for Medi-Cal, your health plan assignment.",
      },
      {
        title: "Find a provider",
        desc: "Once enrolled, use your plan's provider directory or call member services to pick a primary care doctor near you.",
      },
    ],
    officialHref: "https://benefitscal.com",
    officialLabel: "Apply at BenefitsCal.com",
    phoneLabel: "SF Human Services Agency",
    phone: "1-415-557-5000",
  },
];

export function getProgram(slug) {
  return PROGRAMS.find((p) => p.slug === slug) || null;
}
