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
 * Translations live in PROGRAM_T below (one object per language code,
 * mirroring the i18n.js pattern). getProgram(slug, lang) merges the
 * translation over the English base entry; any missing language or
 * field falls back to English automatically.
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
    navDesc: "Medi-Cal, Healthy SF, and Covered California",
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
        title: "If your income is above Medi-Cal limits",
        desc: "Covered California is the state's official marketplace for subsidized private health plans — most applicants qualify for financial help. Free enrollment assistance: (800) 300-1506.",
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
  // ---- Transit guide (Phase 4a): all facts verified 2026-08-10 against official
  // sources. Structure only — fares, dollar amounts, income thresholds, and dates
  // are intentionally NOT stated here; residents follow officialHref for specifics.
  //   Muni fares hub:  https://www.sfmta.com/getting-around/muni/fares
  //   Clipper:         https://www.clippercard.com/ClipperWeb/
  //   Clipper START:   https://www.sfmta.com/fares/clipper-start  (apply: clipperstartcard.com)
  //   Lifeline (migrating into Clipper START): https://www.sfmta.com/lifeline-low-income-pass
  //   Free Muni (Youth / Seniors / People with Disabilities): linked from the fares hub.
  {
    slug: "transit",
    navLabel: "Muni & Transit Discounts",
    navDesc: "Riding Muni with Clipper, plus youth, senior, disability, and low-income fare programs",
    title: "Getting Around on Muni",
    intro:
      "Muni is San Francisco's public transit system — buses, Metro, and cable cars. Clipper is the Bay Area's all-in-one transit card, accepted on Muni and across the region's transit systems. You can pay with a Clipper card, the MuniMobile app, cash (exact change), or a contactless bank card.",
    eligibilityNote:
      "Several programs lower or waive your fare. Free Muni for All Youth covers everyone 18 and younger, regardless of income or residency. Free Muni for Seniors (65+) and Free Muni for People with Disabilities cover low-to-moderate-income San Francisco residents. Clipper START gives limited-income adults ages 19-64 a discount across Bay Area transit, and the Lifeline Pass (now moving into Clipper START) is a discounted monthly pass for limited-income riders. The Access Pass provides free Muni for people experiencing homelessness.",
    documents: [
      "A Clipper card (the youth program needs no card or application for regular Muni service)",
      "Proof of age for the youth and senior programs",
      "Proof of income for the low-income programs — such as an EBT or Medi-Cal card, a county benefits letter, or last year's federal tax return",
      "Proof of San Francisco residency for the resident programs",
      "A Clipper Access card to apply for Free Muni for People with Disabilities",
    ],
    steps: [
      {
        title: "Get a Clipper card",
        desc: "Clipper works on Muni and every other Bay Area transit system. Get a physical card online, or set up Clipper on your phone. Register your card after you get it, and reload value online whenever you need to.",
      },
      {
        title: "Choose how to pay",
        desc: "Tap your Clipper card, buy fares in the MuniMobile app and activate your ticket when you board, pay cash with exact change (ticket vending machines issue vouchers, not change), or tap a contactless bank card.",
      },
      {
        title: "Keep your proof of payment",
        desc: "After you pay your fare, keep your proof of payment with you for the ride.",
      },
      {
        title: "See if you qualify for a discount",
        desc: "Youth 18 and younger ride free with no application. Seniors 65+ and people with qualifying disabilities may qualify for Free Muni. Limited-income adults ages 19-64 may qualify for Clipper START, which also applies across other Bay Area transit.",
      },
      {
        title: "Apply for your discount program",
        desc: "Apply online — Clipper START at clipperstartcard.com, and the Free Muni senior and disability programs through the SFMTA application. You can also apply by paper at the SFMTA Customer Service Center, 11 South Van Ness Avenue. Check the official page for current amounts, income limits, and processing times before you apply.",
      },
    ],
    officialHref: "https://www.sfmta.com/getting-around/muni/fares",
    officialLabel: "See fares & discount programs at SFMTA.com",
    phoneLabel: "SFMTA Muni fares & service info",
    phone: "311 (Outside SF: 415-701-2311)", // 311 / SFMTA contact shown on the fares hub, verified 2026-08-10
  },
  // ---- Paratransit / accessibility guide (Phase 4b): all facts verified 2026-08-10
  // against official sources, adversarially re-checked before shipping. Fares and
  // subsidy dollar amounts are intentionally NOT stated here — they change over
  // time; residents follow officialHref for current figures.
  //   Shop-a-Round:      https://www.sfmta.com/getting-around/accessibility/shop-round
  //   Essential Trip Card: https://www.sfmta.com/getting-around/accessibility/paratransit/essential-trip-card
  {
    slug: "paratransit",
    navLabel: "Accessibility & Paratransit Rides",
    navDesc: "Grocery shuttle and discounted taxi rides for seniors and people with disabilities",
    title: "Getting Accessible Rides: Shop-a-Round & Essential Trip Card",
    intro:
      "SFMTA offers two rider-assistance programs alongside regular Muni and ADA Paratransit service. Shop-a-Round is a shuttle that takes registered riders to grocery stores and supermarkets in San Francisco. The Essential Trip Card discounts taxi fares for essential trips — grocery shopping, pharmacy visits, and medical appointments — within San Francisco. The Essential Trip Card began during the COVID-19 pandemic and remains available until further notice.",
    eligibilityNote:
      "Before You Start: Shop-a-Round registration is open to riders who are age 65 or older, hold a Clipper Access (formerly RTC) Discount ID Card, or are eligible for ADA Paratransit services. The Essential Trip Card is open to applicants who are age 65 or older, have a disability, or have a health condition or mobility challenge that prevents them from using Muni or reaching nearby transit stops or stations. Each program has its own registration or enrollment process, so check the official pages for current details before you apply.",
    documents: [
      "Proof of age, if applying based on being 65 or older",
      "Proof of disability or a qualifying health or mobility condition — such as a Clipper Access (RTC) Discount ID Card, ADA Paratransit eligibility, or documentation from a health provider",
      "A current mailing address, since the Shop-a-Round shuttle schedule is mailed to registered riders rather than posted publicly",
      "Photo ID, if enrolling for the Essential Trip Card in person",
    ],
    steps: [
      {
        title: "Learn about Shop-a-Round",
        desc: "This shuttle takes registered riders to grocery stores and supermarkets in San Francisco. You'll typically spend about an hour at the store per stop, and registered riders may take unlimited rides. Shuttle schedules vary by site and are mailed to riders after they register.",
      },
      {
        title: "Register for Shop-a-Round",
        desc: "Contact the Mobility Management Center to register if you're 65 or older, hold a Clipper Access Discount ID Card, or qualify for ADA Paratransit services. Current fares and schedule information are provided when you register.",
      },
      {
        title: "Learn about the Essential Trip Card",
        desc: "This program discounts taxi fares for essential trips — grocery shopping, pharmacy visits, and medical appointments — within San Francisco. Eligible riders load value onto a card and pay a reduced share of the regular cab fare; check the official page for current subsidy amounts.",
      },
      {
        title: "Enroll for the Essential Trip Card",
        desc: "Enroll in person at the SF Paratransit Broker's Office, 68 12th Street, First Floor, San Francisco, or call the enrollment line during weekday business hours to ask about your options.",
      },
      {
        title: "Confirm current fares and loading amounts",
        desc: "Costs for both programs can change over time. Check the official SFMTA pages linked below for the current Shop-a-Round one-way fare and Essential Trip Card loading amounts before you plan your trips.",
      },
    ],
    officialHref: "https://www.sfmta.com/getting-around/accessibility",
    officialLabel: "See accessibility & paratransit programs at SFMTA.com",
    phoneLabel: "SF Paratransit Mobility Management Center (Essential Trip Card enrollment line: 415-351-7053, weekdays 9:00 AM-4:45 PM)",
    phone: "415-351-7000", // confirmed on sfmta.com Shop-a-Round & Essential Trip Card pages, 2026-08-10
  },
];

/**
 * PROGRAM_T — translations of the guide content, one object per language
 * code (mirrors the i18n.js pattern). Only human-readable fields are
 * translated; structural fields (slug, officialHref, phone) stay on the
 * English base entry and are merged in by getProgram(). Any language or
 * field that's missing falls back to English automatically.
 */
export const PROGRAM_T = {
  es: {
    food: {
      navLabel: "Alimentos y CalFresh",
      navDesc: "Comestibles, WIC y asistencia alimentaria",
      title: "Cómo solicitar asistencia alimentaria",
      intro:
        "CalFresh (el programa SNAP de California) ayuda a pagar los alimentos. La mayoría de las solicitudes tardan unos 30 días, y algunos hogares califican para el servicio acelerado (3 días).",
      eligibilityNote:
        "La elegibilidad depende del tamaño del hogar y de los ingresos. Use la herramienta oficial de preselección a continuación antes de solicitar — toma unos 5 minutos y no requiere crear una cuenta.",
      documents: [
        "Identificación con foto",
        "Comprobante de domicilio (contrato de alquiler, factura de servicios o correo)",
        "Comprobante de ingresos de todas las personas del hogar (talones de pago, cartas de beneficios)",
        "Números de Seguro Social de los miembros del hogar que solicitan (no se requieren para todos en el hogar)",
      ],
      steps: [
        { title: "Verifique si puede calificar", desc: "Use la herramienta de preselección para obtener un estimado antes de comenzar la solicitud completa. Este paso es opcional pero ahorra tiempo." },
        { title: "Reúna sus documentos", desc: "Tenga lista su identificación, comprobante de domicilio y comprobante de ingresos. Puede comenzar la solicitud sin tener todo — puede subir documentos después." },
        { title: "Envíe su solicitud", desc: "Solicite en línea, o llame a la línea de CalFresh del condado si prefiere solicitar por teléfono o necesita ayuda en otro idioma." },
        { title: "Complete su entrevista telefónica", desc: "El condado le llamará para confirmar su información. Conteste llamadas de números locales desconocidos durante el período de su solicitud para no perderla." },
        { title: "Reciba su tarjeta EBT", desc: "Si es aprobado, su tarjeta EBT Golden State Advantage llegará por correo. Actívela con el número que aparece al reverso antes de usarla por primera vez." },
      ],
      officialLabel: "Comience su solicitud en GetCalFresh.org",
      phoneLabel: "Línea de CalFresh de SFHSA",
    },
    housing: {
      navLabel: "Asistencia de vivienda",
      navDesc: "Apoyo de alquiler, vivienda asequible y derechos de inquilinos",
      title: "Cómo solicitar asistencia de vivienda",
      intro:
        "La ayuda de vivienda en San Francisco generalmente se divide en tres vías: listados de vivienda asequible (DAHLIA), subsidios de alquiler y apoyo de derechos de inquilinos si ya tiene vivienda pero está en riesgo.",
      eligibilityNote:
        "Cada listado en DAHLIA establece sus propios límites de ingresos y preferencias (como vivir o trabajar en el distrito). Los programas de subsidio de alquiler tienen listas de espera separadas que pueden estar cerradas por temporadas — verifique el estado actual en el sitio oficial antes de solicitar.",
      documents: [
        "Identificación con foto de todos los adultos del hogar",
        "Comprobante de ingresos (talones de pago, cartas de beneficios o una carta de cero ingresos)",
        "Tamaño y composición del hogar (nombres, edades, parentescos)",
        "Domicilio actual / comprobante de residencia en San Francisco, si el listado lo requiere",
      ],
      steps: [
        { title: "Decida qué vía se ajusta a su situación", desc: "DAHLIA lista unidades asequibles de alquiler y compra a las que se aplica individualmente. Los subsidios de alquiler (como la Sección 8) brindan ayuda continua para pagar alquiler a precio de mercado. El apoyo de derechos de inquilinos es para personas que enfrentan desalojo, acoso o problemas de habitabilidad." },
        { title: "Cree una cuenta de DAHLIA", desc: "Una sola cuenta le permite ver y solicitar cualquier listado abierto. Puede guardar la información de su hogar para no volver a ingresarla en cada listado." },
        { title: "Reúna sus documentos", desc: "Tenga lista la identificación y el comprobante de ingresos de todas las personas del hogar — la mayoría de los listados los piden antes de finalizar una solicitud." },
        { title: "Solicite en listados abiertos o listas de espera", desc: "Los listados abren y cierran según su propio calendario. Solicite varios a la vez para mejorar sus posibilidades y anote la fecha límite de cada uno." },
        { title: "Conozca sus derechos como inquilino", desc: "Si ya tiene vivienda y enfrenta un aviso de desalojo, reparaciones pendientes o acoso, la Junta de Renta (Rent Board) y las organizaciones de asesoría para inquilinos pueden orientarle sin costo." },
      ],
      officialLabel: "Vea listados y solicite en housing.sfgov.org",
      phoneLabel: "Asesoría de la Junta de Renta de SF",
    },
    health: {
      navLabel: "Cobertura de salud",
      navDesc: "Medi-Cal, Healthy SF y clínicas gratuitas o de bajo costo",
      title: "Cómo solicitar cobertura de salud",
      intro:
        "La mayoría de los residentes de San Francisco pueden obtener cobertura de salud gratuita o de bajo costo a través de Medi-Cal o Healthy SF, sin importar su estatus migratorio. La cobertura incluye consultas médicas, atención urgente y medicamentos recetados.",
      eligibilityNote:
        "La elegibilidad de Medi-Cal se basa en los ingresos y el tamaño del hogar. Si no califica para Medi-Cal, Healthy SF cubre a residentes de SF de cualquier nivel de ingresos con una tarifa de escala móvil. La solicitud le dirigirá al programa correcto.",
      documents: [
        "Identificación con foto",
        "Comprobante de residencia en San Francisco (contrato de alquiler, factura de servicios o correo)",
        "Comprobante de ingresos, si lo tiene (talones de pago o una carta de cero ingresos)",
        "No se requieren documentos de estatus migratorio para solicitar — la cobertura está disponible sin importar el estatus",
      ],
      steps: [
        { title: "Revise sus opciones", desc: "No necesita saber de antemano si califica para Medi-Cal o Healthy SF — una sola solicitud revisa ambos." },
        { title: "Si sus ingresos superan los límites de Medi-Cal", desc: "Covered California es el mercado oficial del estado de planes de salud privados con subsidio — la mayoría de los solicitantes califica para ayuda financiera. Asistencia de inscripción gratuita: (800) 300-1506." },
        { title: "Reúna lo que tenga", desc: "Traiga identificación y comprobante de domicilio. Los documentos de ingresos ayudan pero no son necesarios para comenzar — puede solicitar con un ingreso autodeclarado y complementar después." },
        { title: "Solicite en línea o en persona", desc: "Solicite a través de BenefitsCal, o visite una oficina de la Agencia de Servicios Humanos si desea ayuda en persona para completar el formulario." },
        { title: "Reciba su confirmación", desc: "Recibirá un aviso por correo confirmando su inscripción y, en el caso de Medi-Cal, la asignación de su plan de salud." },
        { title: "Encuentre un proveedor", desc: "Una vez inscrito, use el directorio de proveedores de su plan o llame a servicios para miembros para elegir un médico de cabecera cerca de usted." },
      ],
      officialLabel: "Solicite en BenefitsCal.com",
      phoneLabel: "Agencia de Servicios Humanos de SF",
    },
    transit: {
      navLabel: "Descuentos de Muni y transporte",
      navDesc: "Viajar en Muni con Clipper, además de programas de tarifas para jóvenes, personas mayores, personas con discapacidad y de bajos ingresos",
      title: "Cómo movilizarse en Muni",
      intro:
        "Muni es el sistema de transporte público de San Francisco — autobuses, Metro y tranvías de cable (cable cars). Clipper es la tarjeta de transporte todo en uno del Bay Area, aceptada en Muni y en los sistemas de transporte de toda la región. Puede pagar con una tarjeta Clipper, la aplicación MuniMobile, en efectivo (con el cambio exacto) o con una tarjeta bancaria sin contacto.",
      eligibilityNote:
        "Varios programas reducen o eliminan su tarifa. Free Muni for All Youth cubre a todas las personas de 18 años o menos, sin importar sus ingresos ni su residencia. Free Muni for Seniors (65+) y Free Muni for People with Disabilities cubren a los residentes de San Francisco con ingresos de bajos a moderados. Clipper START ofrece a los adultos de ingresos limitados de 19-64 años un descuento en el transporte del Bay Area, y el Lifeline Pass (que ahora se está integrando a Clipper START) es un pase mensual con descuento para pasajeros de ingresos limitados. El Access Pass ofrece Muni gratis para las personas sin hogar.",
      documents: [
        "Una tarjeta Clipper (el programa para jóvenes no requiere tarjeta ni solicitud para el servicio regular de Muni)",
        "Comprobante de edad para los programas para jóvenes y personas mayores",
        "Comprobante de ingresos para los programas de bajos ingresos — como una tarjeta EBT o Medi-Cal, una carta de beneficios del condado o la declaración de impuestos federales del año pasado",
        "Comprobante de residencia en San Francisco para los programas para residentes",
        "Una tarjeta Clipper Access para solicitar Free Muni for People with Disabilities",
      ],
      steps: [
        { title: "Obtenga una tarjeta Clipper", desc: "Clipper funciona en Muni y en todos los demás sistemas de transporte del Bay Area. Obtenga una tarjeta física en línea o configure Clipper en su teléfono. Registre su tarjeta después de recibirla y recargue saldo en línea cuando lo necesite." },
        { title: "Elija cómo pagar", desc: "Toque su tarjeta Clipper, compre tarifas en la aplicación MuniMobile y active su boleto al abordar, pague en efectivo con el cambio exacto (las máquinas expendedoras de boletos emiten vales, no cambio) o toque una tarjeta bancaria sin contacto." },
        { title: "Conserve su comprobante de pago", desc: "Después de pagar su tarifa, conserve consigo su comprobante de pago durante el viaje." },
        { title: "Verifique si califica para un descuento", desc: "Los jóvenes de 18 años o menos viajan gratis sin necesidad de solicitud. Las personas mayores (65+) y las personas con discapacidades que califican pueden reunir los requisitos para Free Muni. Los adultos de ingresos limitados de 19-64 años pueden calificar para Clipper START, que también se aplica en el resto del transporte del Bay Area." },
        { title: "Solicite su programa de descuento", desc: "Solicite en línea — Clipper START en clipperstartcard.com, y los programas Free Muni para personas mayores y con discapacidad a través de la solicitud de SFMTA. También puede solicitar en papel en el Centro de Servicio al Cliente de SFMTA, 11 South Van Ness Avenue. Consulte la página oficial para conocer los montos actuales, los límites de ingresos y los tiempos de procesamiento antes de solicitar." },
      ],
      officialLabel: "Consulte las tarifas y los programas de descuento en SFMTA.com",
      phoneLabel: "Información de tarifas y servicio de Muni de SFMTA",
    },
    paratransit: {
      navLabel: "Transporte Accesible y Paratránsito",
      navDesc: "Transporte a supermercados y tarifas de taxi con descuento para personas mayores y personas con discapacidad",
      title: "Cómo obtener transporte accesible: Shop-a-Round y Essential Trip Card",
      intro:
        "SFMTA ofrece dos programas de asistencia al pasajero además del servicio regular de Muni y ADA Paratransit. Shop-a-Round es un transporte que lleva a los pasajeros inscritos a tiendas de comestibles y supermercados en San Francisco. Essential Trip Card ofrece descuentos en tarifas de taxi para viajes esenciales — ir de compras, visitar la farmacia y acudir a citas médicas — dentro de San Francisco. Essential Trip Card comenzó durante la pandemia de COVID-19 y sigue disponible hasta nuevo aviso.",
      eligibilityNote:
        "Antes de comenzar: la inscripción en Shop-a-Round está abierta a pasajeros que tengan 65 años o más, que tengan una tarjeta de descuento Clipper Access (antes RTC), o que sean elegibles para los servicios de ADA Paratransit. Essential Trip Card está abierto a solicitantes que tengan 65 años o más, que tengan una discapacidad, o que tengan una condición de salud o una limitación de movilidad que les impida usar Muni o llegar a las paradas o estaciones de transporte cercanas. Cada programa tiene su propio proceso de registro o inscripción, así que consulte las páginas oficiales para conocer los detalles actuales antes de solicitar.",
      documents: [
        "Comprobante de edad, si solicita por tener 65 años o más",
        "Comprobante de discapacidad o de una condición de salud o movilidad que califique — como una tarjeta de descuento Clipper Access (RTC), elegibilidad para ADA Paratransit, o documentación de un proveedor de salud",
        "Un domicilio postal vigente, ya que el horario del transporte Shop-a-Round se envía por correo a los pasajeros inscritos en lugar de publicarse públicamente",
        "Identificación con foto, si se inscribe para Essential Trip Card en persona",
      ],
      steps: [
        { title: "Conozca Shop-a-Round", desc: "Este transporte lleva a los pasajeros inscritos a tiendas de comestibles y supermercados en San Francisco. Por lo general, pasará aproximadamente una hora en la tienda por parada, y los pasajeros inscritos pueden tomar viajes ilimitados. Los horarios del transporte varían según el lugar y se envían por correo a los pasajeros después de inscribirse." },
        { title: "Inscríbase en Shop-a-Round", desc: "Comuníquese con el Mobility Management Center para inscribirse si tiene 65 años o más, tiene una tarjeta de descuento Clipper Access, o califica para los servicios de ADA Paratransit. La información actual sobre tarifas y horarios se proporciona al momento de inscribirse." },
        { title: "Conozca Essential Trip Card", desc: "Este programa ofrece descuentos en tarifas de taxi para viajes esenciales — ir de compras, visitar la farmacia y acudir a citas médicas — dentro de San Francisco. Los pasajeros elegibles cargan saldo en una tarjeta y pagan una parte reducida de la tarifa regular del taxi; consulte la página oficial para conocer los montos actuales del subsidio." },
        { title: "Inscríbase para Essential Trip Card", desc: "Inscríbase en persona en la Oficina del SF Paratransit Broker, 68 12th Street, First Floor, San Francisco, o llame a la línea de inscripción durante el horario laboral entre semana para preguntar sobre sus opciones." },
        { title: "Confirme las tarifas y montos de carga actuales", desc: "Los costos de ambos programas pueden cambiar con el tiempo. Consulte las páginas oficiales de SFMTA enlazadas a continuación para conocer la tarifa actual de un solo viaje de Shop-a-Round y los montos de carga de Essential Trip Card antes de planear sus viajes." },
      ],
      officialLabel: "Vea los programas de accesibilidad y paratránsito en SFMTA.com",
      phoneLabel: "Mobility Management Center de SF Paratransit (línea de inscripción de Essential Trip Card: 415-351-7053, entre semana de 9:00 a.m. a 4:45 p.m.)",
    },
  },
  zh: {
    food: {
      navLabel: "食品與 CalFresh",
      navDesc: "食品雜貨、WIC 及食品援助",
      title: "申請食品援助",
      intro:
        "CalFresh(加州的 SNAP 計劃)幫助支付食品雜貨費用。大多數申請約需 30 天,部分家庭符合加急(3 天)服務的資格。",
      eligibilityNote:
        "資格取決於家庭人數和收入。申請前請使用下方的官方篩查工具進行初步評估——約需 5 分鐘,無需註冊帳戶。",
      documents: [
        "帶照片的身份證件",
        "地址證明(租約、水電帳單或郵件)",
        "家庭所有成員的收入證明(工資單、福利信函)",
        "申請的家庭成員的社會安全號碼(並非家中每個人都需要)",
      ],
      steps: [
        { title: "查看是否符合資格", desc: "在開始正式申請前,使用預篩查工具進行大致評估。此步驟為可選,但可節省時間。" },
        { title: "準備您的文件", desc: "備好身份證件、地址證明和收入證明。即使資料不齊也可以先開始申請——之後可補交文件。" },
        { title: "提交申請", desc: "可線上申請;如果您希望電話申請或需要其他語言的幫助,請致電縣 CalFresh 服務熱線。" },
        { title: "完成電話面談", desc: "縣政府將來電核實您的資訊。在申請期間請接聽陌生本地號碼的來電,以免錯過。" },
        { title: "領取 EBT 卡", desc: "獲批後,您的 Golden State Advantage EBT 卡將郵寄給您。首次使用前,請撥打卡背面的號碼啟用。" },
      ],
      officialLabel: "前往 GetCalFresh.org 開始申請",
      phoneLabel: "SFHSA CalFresh 服務熱線",
    },
    housing: {
      navLabel: "住房援助",
      navDesc: "租金支援、可負擔住房及租戶權益",
      title: "申請住房援助",
      intro:
        "舊金山的住房援助通常分為三類:可負擔住房房源(DAHLIA)、租金補貼,以及面向已有住房但面臨風險的租戶的權益支援。",
      eligibilityNote:
        "DAHLIA 上的每個房源都有各自的收入限制和優先條件(例如在本區居住或工作)。租金補貼計劃有單獨的候補名單,可能會不定期關閉——申請前請在官方網站查看當前狀態。",
      documents: [
        "家庭所有成年成員的帶照片身份證件",
        "收入證明(工資單、福利信函或零收入聲明信)",
        "家庭人數及成員構成(姓名、年齡、關係)",
        "現居地址/舊金山居住證明(如房源要求)",
      ],
      steps: [
        { title: "確定適合您情況的途徑", desc: "DAHLIA 列出可逐一申請的可負擔租賃和購房單位。租金補貼(如第 8 章計劃)提供持續的市場租金支付幫助。租戶權益支援面向面臨驅逐、騷擾或居住條件問題的租戶。" },
        { title: "建立 DAHLIA 帳戶", desc: "一個帳戶即可瀏覽並申請任何開放房源。您可以儲存家庭資訊,無需為每個房源重複填寫。" },
        { title: "準備您的文件", desc: "備好家庭所有成員的身份證件和收入證明——大多數房源在最終確認申請前都會要求提供。" },
        { title: "申請開放房源或候補名單", desc: "房源按各自的時間表開放和關閉。同時申請多個房源可提高機會,並留意每個房源的截止日期。" },
        { title: "瞭解您的租戶權利", desc: "如果您已有住房但收到驅逐通知、遇到維修或騷擾問題,租務委員會(Rent Board)和租戶諮詢機構可免費為您提供建議。" },
      ],
      officialLabel: "在 housing.sfgov.org 瀏覽房源並申請",
      phoneLabel: "舊金山租務委員會諮詢熱線",
    },
    health: {
      navLabel: "醫療保險",
      navDesc: "Medi-Cal、Healthy SF 及免費或低價診所",
      title: "申請醫療保險",
      intro:
        "大多數舊金山居民無論移民身份如何,都可以透過 Medi-Cal 或 Healthy SF 獲得免費或低價的醫療保險。保險涵蓋門診、急診護理和處方藥。",
      eligibilityNote:
        "Medi-Cal 的資格基於家庭收入和人數。如果您不符合 Medi-Cal 的資格,Healthy SF 以浮動收費的方式覆蓋任何收入水平的舊金山居民。申請系統會自動為您匹配合適的計劃。",
      documents: [
        "帶照片的身份證件",
        "舊金山居住證明(租約、水電帳單或郵件)",
        "收入證明(如有,工資單或零收入聲明信)",
        "申請無需提供移民身份文件——無論身份如何均可獲得保險",
      ],
      steps: [
        { title: "瞭解您的選擇", desc: "您無需事先知道自己符合 Medi-Cal 還是 Healthy SF 的資格——一份申請會同時審核兩者。" },
        { title: "如果您的收入超過 Medi-Cal 上限", desc: "Covered California 是加州官方的保險市場，提供有補貼的私人健康保險計劃——大多數申請人可獲得財務補助。免費登記協助：(800) 300-1506。" },
        { title: "準備現有資料", desc: "帶上身份證件和地址證明。收入文件有幫助但並非開始申請的必要條件——您可以先自行申報收入,之後再補交。" },
        { title: "線上或親自申請", desc: "透過 BenefitsCal 線上申請,或前往人類服務局辦公室獲得現場協助填寫表格。" },
        { title: "獲取確認通知", desc: "您將收到郵寄的通知,確認您已加入;如為 Medi-Cal,還會告知您的健康計劃分配。" },
        { title: "尋找醫療服務提供者", desc: "加入後,使用您計劃的服務提供者名錄,或致電會員服務部,選擇您附近的家庭醫生。" },
      ],
      officialLabel: "在 BenefitsCal.com 申請",
      phoneLabel: "舊金山人類服務局",
    },
    transit: {
      navLabel: "Muni 與交通優惠",
      navDesc: "使用 Clipper 搭乘 Muni，以及青少年、長者、殘障人士和低收入車費計劃",
      title: "搭乘 Muni 出行",
      intro:
        "Muni 是 San Francisco 的公共交通系統——包括巴士、地鐵（Metro）和纜車。Clipper 是 Bay Area 的一體式交通卡，可在 Muni 及整個地區的交通系統上使用。您可以使用 Clipper 卡、MuniMobile 應用程式、現金（需準備剛好的零錢）或非接觸式銀行卡付款。",
      eligibilityNote:
        "有多項計劃可降低或免除您的車費。Free Muni for All Youth 涵蓋所有 18 歲及以下人士，不論收入或居住身分。Free Muni for Seniors（65+）和 Free Muni for People with Disabilities 涵蓋中低收入的 San Francisco 居民。Clipper START 為 19-64 歲的低收入成年人提供適用於整個 Bay Area 交通的優惠，而 Lifeline Pass（現正併入 Clipper START）是為低收入乘客提供的優惠月票。Access Pass 為無家可歸人士提供免費 Muni。",
      documents: [
        "一張 Clipper 卡（青少年計劃搭乘一般 Muni 服務無需卡片或申請）",
        "青少年和長者計劃所需的年齡證明",
        "低收入計劃所需的收入證明——例如 EBT 或 Medi-Cal 卡、縣府福利信函，或去年的聯邦報稅表",
        "居民計劃所需的 San Francisco 居住證明",
        "申請 Free Muni for People with Disabilities 所需的 Clipper Access 卡",
      ],
      steps: [
        { title: "取得 Clipper 卡", desc: "Clipper 可在 Muni 及 Bay Area 每一個其他交通系統上使用。您可以在網上取得實體卡，或在手機上設定 Clipper。取得卡片後請進行登記，並在需要時隨時於網上加值。" },
        { title: "選擇付款方式", desc: "拍卡使用 Clipper 卡、在 MuniMobile 應用程式購買車費並於上車時啟用車票、以剛好的零錢現金付款（售票機發出兌換券，不找零），或拍卡使用非接觸式銀行卡。" },
        { title: "保留您的付款證明", desc: "付車費後，請在整趟行程中隨身保留您的付款證明。" },
        { title: "查看您是否符合優惠資格", desc: "18 歲及以下青少年免費搭乘，無需申請。65 歲以上長者及符合資格的殘障人士可能符合 Free Muni 資格。19-64 歲的低收入成年人可能符合 Clipper START 資格，該優惠亦適用於其他 Bay Area 交通系統。" },
        { title: "申請您的優惠計劃", desc: "在網上申請——Clipper START 請至 clipperstartcard.com，Free Muni 長者及殘障計劃則透過 SFMTA 申請。您也可以在 SFMTA 客戶服務中心（11 South Van Ness Avenue）以紙本方式申請。申請前請查看官方網頁以了解目前的金額、收入上限和處理時間。" },
      ],
      officialLabel: "在 SFMTA.com 查看車費與優惠計劃",
      phoneLabel: "SFMTA Muni 車費與服務資訊",
    },
    paratransit: {
      navLabel: "無障礙與復康巴士服務",
      navDesc: "為長者及身心障礙人士提供的雜貨接駁專車與計程車優惠服務",
      title: "取得無障礙交通服務：Shop-a-Round 與 Essential Trip Card",
      intro:
        "除一般的 Muni 與 ADA Paratransit 服務外，SFMTA 也提供兩項乘客協助計畫。Shop-a-Round 是一項接駁專車服務，載送已登記的乘客前往 San Francisco 市內的雜貨店與超市。Essential Trip Card 則為 San Francisco 市內的必要出行——包括採買雜貨、前往藥局及就醫——提供計程車車資優惠。Essential Trip Card 是在 COVID-19 疫情期間推出的，目前仍持續提供，直至另行通知為止。",
      eligibilityNote:
        "開始之前：凡年滿 65 歲、持有 Clipper Access（前身為 RTC）優惠身分證，或符合 ADA Paratransit 資格的乘客，均可登記 Shop-a-Round。Essential Trip Card 則開放給年滿 65 歲、患有身心障礙，或因健康狀況或行動不便而無法搭乘 Muni 或前往鄰近交通站點的申請人。兩項計畫各有其登記或申請流程，請於申請前查閱官方頁面以取得最新詳情。",
      documents: [
        "若以年滿 65 歲的資格申請，需提供年齡證明",
        "身心障礙或符合資格之健康或行動不便狀況的證明——例如 Clipper Access（RTC）優惠身分證、ADA Paratransit 資格證明，或醫療服務提供者出具的相關文件",
        "目前的通訊地址，因為 Shop-a-Round 接駁專車時刻表是郵寄給已登記乘客，而非公開張貼",
        "若親自申請 Essential Trip Card，需提供附照片的身分證件",
      ],
      steps: [
        { title: "了解 Shop-a-Round", desc: "這項接駁專車服務會載送已登記的乘客前往 San Francisco 市內的雜貨店與超市。每次停靠通常可在店內停留約一小時，已登記的乘客可不限次數搭乘。接駁時刻表依站點而異，會在乘客完成登記後郵寄給乘客。" },
        { title: "登記 Shop-a-Round", desc: "若您年滿 65 歲、持有 Clipper Access 優惠身分證，或符合 ADA Paratransit 資格，請聯絡 Mobility Management Center 進行登記。登記時將提供目前的車資與時刻表資訊。" },
        { title: "了解 Essential Trip Card", desc: "此計畫為 San Francisco 市內的必要出行——包括採買雜貨、前往藥局及就醫——提供計程車車資優惠。符合資格的乘客可在卡片內儲值，並僅需支付一般計程車車資中較低的部分；請查閱官方頁面以取得目前的補助金額。" },
        { title: "申請 Essential Trip Card", desc: "可親自前往 SF Paratransit Broker's Office（地址：68 12th Street, First Floor, San Francisco）辦理申請，或於平日上班時間致電申請專線詢問相關選項。" },
        { title: "確認目前的車資與儲值金額", desc: "兩項計畫的費用可能隨時間調整。規劃行程前，請查閱下方連結的官方 SFMTA 頁面，以取得目前 Shop-a-Round 單程車資及 Essential Trip Card 儲值金額的最新資訊。" },
      ],
      officialLabel: "在 SFMTA.com 查看無障礙與復康巴士計畫",
      phoneLabel: "SF Paratransit Mobility Management Center（Essential Trip Card 申請專線：415-351-7053，平日上午 9:00 至下午 4:45）",
    },
  },
  vi: {
    food: {
      navLabel: "Thực phẩm & CalFresh",
      navDesc: "Thực phẩm, WIC và hỗ trợ lương thực",
      title: "Nộp đơn xin hỗ trợ thực phẩm",
      intro:
        "CalFresh (chương trình SNAP của California) giúp chi trả tiền mua thực phẩm. Hầu hết các đơn mất khoảng 30 ngày, và một số hộ gia đình đủ điều kiện nhận dịch vụ khẩn cấp (3 ngày).",
      eligibilityNote:
        "Điều kiện phụ thuộc vào số người trong hộ và thu nhập. Hãy dùng công cụ sàng lọc chính thức bên dưới trước khi nộp đơn — chỉ mất khoảng 5 phút và không cần tạo tài khoản.",
      documents: [
        "Giấy tờ tùy thân có ảnh",
        "Bằng chứng địa chỉ (hợp đồng thuê nhà, hóa đơn điện nước hoặc thư từ)",
        "Bằng chứng thu nhập của mọi người trong hộ (phiếu lương, thư trợ cấp)",
        "Số An sinh Xã hội của các thành viên trong hộ đang nộp đơn (không bắt buộc với tất cả mọi người trong nhà)",
      ],
      steps: [
        { title: "Kiểm tra xem bạn có thể đủ điều kiện không", desc: "Dùng công cụ sàng lọc trước để có ước tính sơ bộ trước khi bắt đầu đơn đầy đủ. Bước này không bắt buộc nhưng giúp tiết kiệm thời gian." },
        { title: "Chuẩn bị giấy tờ", desc: "Chuẩn bị sẵn giấy tờ tùy thân, bằng chứng địa chỉ và bằng chứng thu nhập. Bạn vẫn có thể bắt đầu nộp đơn khi chưa đủ giấy tờ — có thể tải lên sau." },
        { title: "Nộp đơn", desc: "Nộp đơn trực tuyến, hoặc gọi đường dây CalFresh của quận nếu bạn muốn nộp qua điện thoại hoặc cần trợ giúp bằng ngôn ngữ khác." },
        { title: "Hoàn thành phỏng vấn qua điện thoại", desc: "Quận sẽ gọi để xác nhận thông tin của bạn. Hãy nghe các cuộc gọi từ số địa phương lạ trong thời gian xét đơn để không bỏ lỡ." },
        { title: "Nhận thẻ EBT", desc: "Nếu được chấp thuận, thẻ EBT Golden State Advantage sẽ được gửi qua bưu điện. Kích hoạt thẻ bằng số điện thoại ở mặt sau trước khi sử dụng lần đầu." },
      ],
      officialLabel: "Bắt đầu nộp đơn tại GetCalFresh.org",
      phoneLabel: "Đường dây CalFresh của SFHSA",
    },
    housing: {
      navLabel: "Hỗ trợ nhà ở",
      navDesc: "Hỗ trợ tiền thuê, nhà ở giá phải chăng và quyền của người thuê",
      title: "Nộp đơn xin hỗ trợ nhà ở",
      intro:
        "Hỗ trợ nhà ở tại San Francisco thường chia thành ba hướng: danh sách nhà ở giá phải chăng (DAHLIA), trợ cấp tiền thuê, và hỗ trợ quyền của người thuê nếu bạn đang có chỗ ở nhưng gặp rủi ro.",
      eligibilityNote:
        "Mỗi tin đăng trên DAHLIA có giới hạn thu nhập và ưu tiên riêng (chẳng hạn sống hoặc làm việc trong khu vực). Các chương trình trợ cấp tiền thuê có danh sách chờ riêng và đôi khi đóng — hãy kiểm tra tình trạng hiện tại trên trang chính thức trước khi nộp đơn.",
      documents: [
        "Giấy tờ tùy thân có ảnh của tất cả người lớn trong hộ",
        "Bằng chứng thu nhập (phiếu lương, thư trợ cấp hoặc thư xác nhận không có thu nhập)",
        "Số người và thành phần hộ gia đình (tên, tuổi, quan hệ)",
        "Địa chỉ hiện tại / bằng chứng cư trú tại San Francisco, nếu tin đăng yêu cầu",
      ],
      steps: [
        { title: "Chọn hướng phù hợp với hoàn cảnh của bạn", desc: "DAHLIA đăng các căn hộ thuê và mua giá phải chăng mà bạn nộp đơn riêng cho từng căn. Trợ cấp tiền thuê (như Section 8) hỗ trợ liên tục để trả tiền thuê theo giá thị trường. Hỗ trợ quyền người thuê dành cho người thuê đang đối mặt với trục xuất, quấy rối hoặc vấn đề điều kiện sống." },
        { title: "Tạo tài khoản DAHLIA", desc: "Một tài khoản cho phép bạn xem và nộp đơn cho bất kỳ tin đăng nào đang mở. Bạn có thể lưu thông tin hộ gia đình để không phải nhập lại cho từng tin." },
        { title: "Chuẩn bị giấy tờ", desc: "Chuẩn bị sẵn giấy tờ tùy thân và bằng chứng thu nhập cho mọi người trong hộ — hầu hết các tin đăng yêu cầu trước khi hoàn tất đơn." },
        { title: "Nộp đơn cho các tin đang mở hoặc danh sách chờ", desc: "Các tin đăng mở và đóng theo lịch riêng. Nộp nhiều đơn cùng lúc để tăng cơ hội, và lưu ý hạn chót của từng tin." },
        { title: "Biết quyền của bạn với tư cách người thuê", desc: "Nếu bạn đang có chỗ ở và nhận thông báo trục xuất, gặp vấn đề sửa chữa hoặc quấy rối, Ủy ban Tiền thuê (Rent Board) và các tổ chức tư vấn người thuê có thể tư vấn miễn phí." },
      ],
      officialLabel: "Xem tin đăng & nộp đơn tại housing.sfgov.org",
      phoneLabel: "Tư vấn Ủy ban Tiền thuê SF",
    },
    health: {
      navLabel: "Bảo hiểm y tế",
      navDesc: "Medi-Cal, Healthy SF và phòng khám miễn phí hoặc chi phí thấp",
      title: "Nộp đơn xin bảo hiểm y tế",
      intro:
        "Hầu hết cư dân San Francisco có thể nhận bảo hiểm y tế miễn phí hoặc chi phí thấp qua Medi-Cal hoặc Healthy SF, bất kể tình trạng di trú. Bảo hiểm bao gồm khám bác sĩ, chăm sóc khẩn cấp và thuốc kê đơn.",
      eligibilityNote:
        "Điều kiện Medi-Cal dựa trên thu nhập và số người trong hộ. Nếu bạn không đủ điều kiện Medi-Cal, Healthy SF bao phủ cư dân SF ở mọi mức thu nhập với mức phí theo thang thu nhập. Đơn đăng ký sẽ tự động hướng bạn đến chương trình phù hợp.",
      documents: [
        "Giấy tờ tùy thân có ảnh",
        "Bằng chứng cư trú tại San Francisco (hợp đồng thuê nhà, hóa đơn điện nước hoặc thư từ)",
        "Bằng chứng thu nhập, nếu có (phiếu lương hoặc thư xác nhận không có thu nhập)",
        "Không cần giấy tờ về tình trạng di trú khi nộp đơn — bảo hiểm dành cho mọi người bất kể tình trạng",
      ],
      steps: [
        { title: "Xem các lựa chọn của bạn", desc: "Bạn không cần biết trước mình đủ điều kiện Medi-Cal hay Healthy SF — một đơn sẽ kiểm tra cả hai." },
        { title: "Nếu thu nhập của bạn vượt giới hạn Medi-Cal", desc: "Covered California là thị trường chính thức của tiểu bang cho các gói bảo hiểm y tế tư nhân được trợ cấp — hầu hết người nộp đơn đủ điều kiện nhận hỗ trợ tài chính. Trợ giúp ghi danh miễn phí: (800) 300-1506." },
        { title: "Chuẩn bị những gì bạn có", desc: "Mang theo giấy tờ tùy thân và bằng chứng địa chỉ. Giấy tờ thu nhập hữu ích nhưng không bắt buộc để bắt đầu — bạn có thể tự khai thu nhập và bổ sung sau." },
        { title: "Nộp đơn trực tuyến hoặc trực tiếp", desc: "Nộp đơn qua BenefitsCal, hoặc đến văn phòng Cơ quan Dịch vụ Nhân sinh nếu bạn muốn được trợ giúp trực tiếp khi điền đơn." },
        { title: "Nhận xác nhận", desc: "Bạn sẽ nhận thông báo qua bưu điện xác nhận việc ghi danh và, với Medi-Cal, chương trình bảo hiểm được chỉ định." },
        { title: "Tìm nhà cung cấp dịch vụ y tế", desc: "Sau khi ghi danh, dùng danh bạ nhà cung cấp của chương trình hoặc gọi bộ phận dịch vụ hội viên để chọn bác sĩ gia đình gần bạn." },
      ],
      officialLabel: "Nộp đơn tại BenefitsCal.com",
      phoneLabel: "Cơ quan Dịch vụ Nhân sinh SF",
    },
    transit: {
      navLabel: "Giảm giá Muni & Giao thông",
      navDesc: "Đi Muni bằng Clipper, cùng các chương trình vé cho thanh thiếu niên, người cao tuổi, người khuyết tật và người thu nhập thấp",
      title: "Đi lại bằng Muni",
      intro:
        "Muni là hệ thống giao thông công cộng của San Francisco — xe buýt, Metro và xe cáp (cable car). Clipper là thẻ giao thông tất-cả-trong-một của Bay Area, được chấp nhận trên Muni và khắp các hệ thống giao thông trong khu vực. Bạn có thể thanh toán bằng thẻ Clipper, ứng dụng MuniMobile, tiền mặt (đúng số tiền), hoặc thẻ ngân hàng không tiếp xúc.",
      eligibilityNote:
        "Một số chương trình giảm hoặc miễn tiền vé cho bạn. Free Muni for All Youth áp dụng cho tất cả mọi người từ 18 tuổi trở xuống, bất kể thu nhập hay nơi cư trú. Free Muni for Seniors (65+) và Free Muni for People with Disabilities áp dụng cho cư dân San Francisco có thu nhập thấp đến trung bình. Clipper START giảm giá cho người trưởng thành có thu nhập hạn chế trong độ tuổi 19-64 trên khắp hệ thống giao thông Bay Area, còn Lifeline Pass (nay đang chuyển sang Clipper START) là vé tháng giảm giá cho người đi xe có thu nhập hạn chế. Access Pass cung cấp Muni miễn phí cho người đang trong tình trạng vô gia cư.",
      documents: [
        "Một thẻ Clipper (chương trình dành cho thanh thiếu niên không cần thẻ hay đơn đăng ký cho dịch vụ Muni thông thường)",
        "Bằng chứng tuổi cho chương trình dành cho thanh thiếu niên và người cao tuổi",
        "Bằng chứng thu nhập cho các chương trình dành cho người thu nhập thấp — chẳng hạn thẻ EBT hoặc Medi-Cal, thư trợ cấp của quận, hoặc tờ khai thuế liên bang năm ngoái",
        "Bằng chứng cư trú tại San Francisco cho các chương trình dành cho cư dân",
        "Một thẻ Clipper Access để nộp đơn xin Free Muni for People with Disabilities",
      ],
      steps: [
        { title: "Lấy thẻ Clipper", desc: "Clipper hoạt động trên Muni và mọi hệ thống giao thông khác của Bay Area. Lấy thẻ cứng trực tuyến, hoặc thiết lập Clipper trên điện thoại của bạn. Đăng ký thẻ sau khi nhận, và nạp tiền trực tuyến bất cứ khi nào bạn cần." },
        { title: "Chọn cách thanh toán", desc: "Chạm thẻ Clipper, mua vé trong ứng dụng MuniMobile và kích hoạt vé khi lên xe, trả tiền mặt đúng số tiền (máy bán vé tự động phát phiếu (voucher), không thối tiền), hoặc chạm thẻ ngân hàng không tiếp xúc." },
        { title: "Giữ bằng chứng thanh toán của bạn", desc: "Sau khi trả tiền vé, hãy giữ bằng chứng thanh toán bên mình trong suốt chuyến đi." },
        { title: "Xem bạn có đủ điều kiện được giảm giá không", desc: "Thanh thiếu niên từ 18 tuổi trở xuống đi miễn phí mà không cần nộp đơn. Người cao tuổi 65+ và người khuyết tật đủ điều kiện có thể được hưởng Free Muni. Người trưởng thành có thu nhập hạn chế trong độ tuổi 19-64 có thể đủ điều kiện cho Clipper START, cũng áp dụng trên các hệ thống giao thông khác của Bay Area." },
        { title: "Nộp đơn cho chương trình giảm giá của bạn", desc: "Nộp đơn trực tuyến — Clipper START tại clipperstartcard.com, và các chương trình Free Muni cho người cao tuổi và người khuyết tật qua đơn đăng ký của SFMTA. Bạn cũng có thể nộp đơn bằng giấy tại SFMTA Customer Service Center, 11 South Van Ness Avenue. Hãy kiểm tra trang chính thức để biết mức hỗ trợ, giới hạn thu nhập và thời gian xử lý hiện tại trước khi nộp đơn." },
      ],
      officialLabel: "Xem tiền vé & các chương trình giảm giá tại SFMTA.com",
      phoneLabel: "Thông tin tiền vé & dịch vụ Muni của SFMTA",
    },
    paratransit: {
      navLabel: "Đi lại tiếp cận & Paratransit",
      navDesc: "Xe đưa đón đi chợ và taxi giảm giá dành cho người cao tuổi và người khuyết tật",
      title: "Đi lại hỗ trợ tiếp cận: Shop-a-Round & Essential Trip Card",
      intro:
        "SFMTA cung cấp hai chương trình hỗ trợ hành khách bên cạnh dịch vụ Muni và ADA Paratransit thông thường. Shop-a-Round là xe đưa đón chở hành khách đã đăng ký đến các cửa hàng tạp hóa và siêu thị tại San Francisco. Essential Trip Card giảm giá cước taxi cho các chuyến đi thiết yếu — đi chợ, đến hiệu thuốc và khám bệnh — trong phạm vi San Francisco. Essential Trip Card ra đời trong đại dịch COVID-19 và vẫn tiếp tục cho đến khi có thông báo mới.",
      eligibilityNote:
        "Trước khi bắt đầu: Đăng ký Shop-a-Round dành cho hành khách từ 65 tuổi trở lên, có thẻ giảm giá Clipper Access (trước đây là RTC), hoặc đủ điều kiện sử dụng dịch vụ ADA Paratransit. Essential Trip Card dành cho người nộp đơn từ 65 tuổi trở lên, có khuyết tật, hoặc có tình trạng sức khỏe hay khó khăn về vận động khiến họ không thể sử dụng Muni hoặc đến các điểm/trạm giao thông gần đó. Mỗi chương trình có quy trình đăng ký hoặc ghi danh riêng, vì vậy hãy kiểm tra các trang chính thức để biết thông tin hiện hành trước khi nộp đơn.",
      documents: [
        "Bằng chứng về tuổi, nếu nộp đơn dựa trên việc từ 65 tuổi trở lên",
        "Bằng chứng về khuyết tật hoặc tình trạng sức khỏe/vận động đủ điều kiện — chẳng hạn như thẻ giảm giá Clipper Access (RTC), đủ điều kiện ADA Paratransit, hoặc giấy tờ từ nhà cung cấp dịch vụ y tế",
        "Địa chỉ nhận thư hiện tại, vì lịch trình xe đưa đón Shop-a-Round được gửi qua thư đến hành khách đã đăng ký chứ không được công bố công khai",
        "Giấy tờ tùy thân có ảnh, nếu ghi danh Essential Trip Card trực tiếp",
      ],
      steps: [
        { title: "Tìm hiểu về Shop-a-Round", desc: "Xe đưa đón này chở hành khách đã đăng ký đến các cửa hàng tạp hóa và siêu thị tại San Francisco. Bạn thường sẽ ở lại cửa hàng khoảng một giờ cho mỗi điểm dừng, và hành khách đã đăng ký có thể đi không giới hạn số chuyến. Lịch trình xe đưa đón khác nhau tùy theo địa điểm và được gửi qua thư đến hành khách sau khi họ đăng ký." },
        { title: "Đăng ký Shop-a-Round", desc: "Liên hệ Mobility Management Center để đăng ký nếu bạn từ 65 tuổi trở lên, có thẻ giảm giá Clipper Access, hoặc đủ điều kiện sử dụng dịch vụ ADA Paratransit. Thông tin về giá vé và lịch trình hiện hành sẽ được cung cấp khi bạn đăng ký." },
        { title: "Tìm hiểu về Essential Trip Card", desc: "Chương trình này giảm giá cước taxi cho các chuyến đi thiết yếu — đi chợ, đến hiệu thuốc và khám bệnh — trong phạm vi San Francisco. Hành khách đủ điều kiện nạp tiền vào thẻ và chỉ trả một phần cước taxi thông thường; hãy kiểm tra trang chính thức để biết mức trợ cấp hiện hành." },
        { title: "Ghi danh Essential Trip Card", desc: "Ghi danh trực tiếp tại SF Paratransit Broker's Office, 68 12th Street, First Floor, San Francisco, hoặc gọi đường dây ghi danh trong giờ làm việc các ngày trong tuần để hỏi về các lựa chọn của bạn." },
        { title: "Xác nhận giá vé và mức nạp tiền hiện hành", desc: "Chi phí của cả hai chương trình có thể thay đổi theo thời gian. Hãy kiểm tra các trang chính thức của SFMTA được liên kết bên dưới để biết giá vé một chiều hiện hành của Shop-a-Round và mức nạp tiền của Essential Trip Card trước khi lên kế hoạch cho chuyến đi." },
      ],
      officialLabel: "Xem các chương trình tiếp cận & paratransit tại SFMTA.com",
      phoneLabel: "SF Paratransit Mobility Management Center (đường dây ghi danh Essential Trip Card: 415-351-7053, các ngày trong tuần 9:00 AM-4:45 PM)",
    },
  },
  ar: {
    food: {
      navLabel: "الغذاء وكال فريش",
      navDesc: "البقالة وبرنامج WIC والمساعدات الغذائية",
      title: "التقديم على المساعدات الغذائية",
      intro:
        "يساعد برنامج CalFresh (برنامج SNAP في كاليفورنيا) في دفع تكاليف البقالة. تستغرق معظم الطلبات حوالي 30 يومًا، وتتأهل بعض الأسر للخدمة العاجلة (3 أيام).",
      eligibilityNote:
        "تعتمد الأهلية على حجم الأسرة والدخل. استخدم أداة الفحص الرسمية أدناه قبل التقديم — تستغرق حوالي 5 دقائق ولا تتطلب إنشاء حساب.",
      documents: [
        "هوية تحمل صورة",
        "إثبات العنوان (عقد إيجار أو فاتورة خدمات أو بريد)",
        "إثبات الدخل لجميع أفراد الأسرة (قسائم الرواتب، خطابات الإعانات)",
        "أرقام الضمان الاجتماعي لأفراد الأسرة المتقدمين (غير مطلوبة من جميع أفراد المنزل)",
      ],
      steps: [
        { title: "تحقق مما إذا كنت مؤهلًا", desc: "استخدم أداة الفحص المسبق للحصول على تقدير تقريبي قبل بدء الطلب الكامل. هذه الخطوة اختيارية لكنها توفر الوقت." },
        { title: "اجمع مستنداتك", desc: "جهّز الهوية وإثبات العنوان وإثبات الدخل. يمكنك بدء الطلب حتى لو لم تكتمل المستندات — يمكنك رفعها لاحقًا." },
        { title: "قدّم طلبك", desc: "قدّم عبر الإنترنت، أو اتصل بخط CalFresh في المقاطعة إذا كنت تفضل التقديم عبر الهاتف أو تحتاج مساعدة بلغة أخرى." },
        { title: "أكمل المقابلة الهاتفية", desc: "ستتصل بك المقاطعة لتأكيد معلوماتك. أجب على المكالمات من أرقام محلية غير معروفة خلال فترة طلبك حتى لا تفوتك." },
        { title: "استلم بطاقة EBT", desc: "في حال الموافقة، ستصلك بطاقة Golden State Advantage EBT بالبريد. فعّلها باستخدام الرقم الموجود على ظهرها قبل الاستخدام الأول." },
      ],
      officialLabel: "ابدأ طلبك على GetCalFresh.org",
      phoneLabel: "خط خدمة CalFresh التابع لـ SFHSA",
    },
    housing: {
      navLabel: "المساعدة السكنية",
      navDesc: "دعم الإيجار والسكن الميسور وحقوق المستأجرين",
      title: "التقديم على المساعدة السكنية",
      intro:
        "تنقسم المساعدة السكنية في سان فرانسيسكو عمومًا إلى ثلاثة مسارات: قوائم السكن الميسور (DAHLIA)، وإعانات الإيجار، ودعم حقوق المستأجرين إذا كان لديك سكن لكنك معرّض للخطر.",
      eligibilityNote:
        "يحدد كل إعلان على DAHLIA حدود الدخل والأفضليات الخاصة به (مثل السكن أو العمل في الحي). لبرامج إعانات الإيجار قوائم انتظار منفصلة وقد تكون مغلقة أحيانًا — تحقق من الحالة الحالية على الموقع الرسمي قبل التقديم.",
      documents: [
        "هوية تحمل صورة لجميع أفراد الأسرة البالغين",
        "إثبات الدخل (قسائم الرواتب أو خطابات الإعانات أو خطاب انعدام الدخل)",
        "حجم الأسرة وتكوينها (الأسماء والأعمار وصلات القرابة)",
        "العنوان الحالي / إثبات الإقامة في سان فرانسيسكو، إذا طلب الإعلان ذلك",
      ],
      steps: [
        { title: "حدد المسار المناسب لوضعك", desc: "يعرض DAHLIA وحدات إيجار وتملّك ميسورة تتقدم لكل منها على حدة. توفر إعانات الإيجار (مثل القسم 8) مساعدة مستمرة لدفع إيجار السوق. أما دعم حقوق المستأجرين فهو لمن يواجهون الإخلاء أو المضايقات أو مشاكل صلاحية السكن." },
        { title: "أنشئ حسابًا على DAHLIA", desc: "حساب واحد يتيح لك تصفح أي إعلان مفتوح والتقديم عليه. يمكنك حفظ معلومات أسرتك حتى لا تعيد إدخالها لكل إعلان." },
        { title: "اجمع مستنداتك", desc: "جهّز الهوية وإثبات الدخل لجميع أفراد الأسرة — تطلبها معظم الإعلانات قبل إتمام الطلب." },
        { title: "قدّم على الإعلانات المفتوحة أو قوائم الانتظار", desc: "تفتح الإعلانات وتغلق وفق جداولها الخاصة. قدّم على عدة إعلانات في آن واحد لزيادة فرصك، ودوّن الموعد النهائي لكل إعلان." },
        { title: "اعرف حقوقك كمستأجر", desc: "إذا كان لديك سكن وتواجه إشعار إخلاء أو مشاكل صيانة أو مضايقات، يمكن لمجلس الإيجارات (Rent Board) ومنظمات استشارات المستأجرين تقديم المشورة مجانًا." },
      ],
      officialLabel: "تصفح القوائم وقدّم على housing.sfgov.org",
      phoneLabel: "استشارات مجلس الإيجارات في سان فرانسيسكو",
    },
    health: {
      navLabel: "التغطية الصحية",
      navDesc: "Medi-Cal وHealthy SF والعيادات المجانية أو منخفضة التكلفة",
      title: "التقديم على التغطية الصحية",
      intro:
        "يمكن لمعظم سكان سان فرانسيسكو الحصول على تغطية صحية مجانية أو منخفضة التكلفة عبر Medi-Cal أو Healthy SF بغض النظر عن وضع الهجرة. تشمل التغطية زيارات الطبيب والرعاية العاجلة والأدوية الموصوفة.",
      eligibilityNote:
        "تعتمد أهلية Medi-Cal على دخل الأسرة وحجمها. إذا لم تكن مؤهلًا لـ Medi-Cal، يغطي Healthy SF سكان سان فرانسيسكو بأي مستوى دخل برسوم متدرجة. سيوجهك الطلب إلى البرنامج المناسب.",
      documents: [
        "هوية تحمل صورة",
        "إثبات الإقامة في سان فرانسيسكو (عقد إيجار أو فاتورة خدمات أو بريد)",
        "إثبات الدخل إن وجد (قسائم الرواتب أو خطاب انعدام الدخل)",
        "لا تُطلب مستندات وضع الهجرة للتقديم — التغطية متاحة بغض النظر عن الوضع",
      ],
      steps: [
        { title: "تعرّف على خياراتك", desc: "لست بحاجة لمعرفة مسبقة بأهليتك لـ Medi-Cal أو Healthy SF — طلب واحد يفحص كليهما." },
        { title: "إذا كان دخلك أعلى من حدود Medi-Cal", desc: "‏Covered California هو سوق الولاية الرسمي للخطط الصحية الخاصة المدعومة — معظم المتقدمين مؤهلون للمساعدة المالية. مساعدة مجانية في التسجيل: (800) 300-1506." },
        { title: "اجمع ما لديك", desc: "أحضر الهوية وإثبات العنوان. مستندات الدخل مفيدة لكنها غير مطلوبة للبدء — يمكنك التقديم بدخل مُصرّح به ذاتيًا واستكمال المستندات لاحقًا." },
        { title: "قدّم عبر الإنترنت أو شخصيًا", desc: "قدّم عبر BenefitsCal، أو قم بزيارة مكتب وكالة الخدمات الإنسانية إذا أردت مساعدة شخصية في إكمال النموذج." },
        { title: "استلم تأكيدك", desc: "ستتلقى إشعارًا بالبريد يؤكد التسجيل، وفي حالة Medi-Cal، تعيين خطتك الصحية." },
        { title: "اعثر على مقدم رعاية", desc: "بعد التسجيل، استخدم دليل مقدمي الخدمة الخاص بخطتك أو اتصل بخدمات الأعضاء لاختيار طبيب رعاية أولية قريب منك." },
      ],
      officialLabel: "قدّم على BenefitsCal.com",
      phoneLabel: "وكالة الخدمات الإنسانية في سان فرانسيسكو",
    },
    transit: {
      navLabel: "تخفيضات Muni والنقل العام",
      navDesc: "ركوب Muni باستخدام Clipper، بالإضافة إلى برامج الأجرة للشباب وكبار السن وذوي الإعاقة وذوي الدخل المحدود",
      title: "التنقّل باستخدام Muni",
      intro:
        "Muni هو نظام النقل العام في San Francisco — الحافلات وMetro والترام (cable cars). وClipper هي بطاقة النقل الشاملة في Bay Area، وهي مقبولة على Muni وفي جميع أنظمة النقل في المنطقة. يمكنك الدفع باستخدام بطاقة Clipper، أو تطبيق MuniMobile، أو نقدًا (بالمبلغ المضبوط تمامًا)، أو ببطاقة مصرفية لا تلامسية.",
      eligibilityNote:
        "تعمل عدة برامج على تخفيض أجرتك أو إعفائك منها. يغطّي برنامج Free Muni for All Youth كل شخص عمره 18 عامًا أو أقل، بغض النظر عن الدخل أو الإقامة. ويغطّي برنامجا Free Muni for Seniors (65+) وFree Muni for People with Disabilities سكان San Francisco من ذوي الدخل المنخفض إلى المتوسط. ويمنح Clipper START البالغين من ذوي الدخل المحدود الذين تتراوح أعمارهم بين 19-64 عامًا تخفيضًا عبر وسائل النقل في Bay Area، وبطاقة Lifeline Pass (التي يجري الآن دمجها ضمن Clipper START) هي بطاقة اشتراك شهرية مخفّضة للركاب ذوي الدخل المحدود. وتوفّر Access Pass خدمة Muni مجانية للأشخاص الذين يعانون من التشرّد.",
      documents: [
        "بطاقة Clipper (لا يحتاج برنامج الشباب إلى بطاقة أو طلب للحصول على خدمة Muni العادية)",
        "إثبات العمر لبرنامجي الشباب وكبار السن",
        "إثبات الدخل لبرامج ذوي الدخل المنخفض — مثل بطاقة EBT أو Medi-Cal، أو خطاب مزايا من المقاطعة، أو الإقرار الضريبي الفيدرالي للعام الماضي",
        "إثبات الإقامة في San Francisco لبرامج المقيمين",
        "بطاقة Clipper Access للتقدّم بطلب للحصول على Free Muni for People with Disabilities",
      ],
      steps: [
        { title: "احصل على بطاقة Clipper", desc: "تعمل Clipper على Muni وعلى كل أنظمة النقل الأخرى في Bay Area. احصل على بطاقة فعلية عبر الإنترنت، أو قم بإعداد Clipper على هاتفك. سجّل بطاقتك بعد الحصول عليها، وأعِد شحن الرصيد عبر الإنترنت متى احتجت إلى ذلك." },
        { title: "اختر طريقة الدفع", desc: "المس بطاقة Clipper، أو اشترِ الأجرة عبر تطبيق MuniMobile وفعّل تذكرتك عند الصعود، أو ادفع نقدًا بالمبلغ المضبوط تمامًا (تُصدر آلات بيع التذاكر قسائم وليس فكة نقدية)، أو المس بطاقة مصرفية لا تلامسية." },
        { title: "احتفظ بإثبات الدفع", desc: "بعد دفع الأجرة، احتفظ بإثبات الدفع معك طوال الرحلة." },
        { title: "تحقّق مما إذا كنت مؤهلاً للحصول على تخفيض", desc: "يركب الشباب من عمر 18 عامًا فأقل مجانًا دون تقديم طلب. وقد يكون كبار السن من عمر 65+ والأشخاص ذوو الإعاقات المؤهِّلة مؤهلين للحصول على Free Muni. وقد يكون البالغون من ذوي الدخل المحدود الذين تتراوح أعمارهم بين 19-64 عامًا مؤهلين للحصول على Clipper START، الذي يسري أيضًا عبر وسائل النقل الأخرى في Bay Area." },
        { title: "تقدّم بطلب لبرنامج التخفيض الخاص بك", desc: "تقدّم بالطلب عبر الإنترنت — Clipper START عبر clipperstartcard.com، وبرنامجا Free Muni لكبار السن وذوي الإعاقة عبر طلب SFMTA. يمكنك أيضًا التقدّم بطلب ورقي في مركز خدمة العملاء SFMTA Customer Service Center، 11 South Van Ness Avenue. تحقّق من الصفحة الرسمية لمعرفة المبالغ الحالية وحدود الدخل وأوقات المعالجة قبل التقديم." },
      ],
      officialLabel: "اطّلع على الأجرة وبرامج التخفيض على SFMTA.com",
      phoneLabel: "معلومات أجرة وخدمات Muni من SFMTA",
    },
    paratransit: {
      navLabel: "رحلات إمكانية الوصول والنقل التكميلي",
      navDesc: "حافلة تسوق للبقالة ورحلات تاكسي مخفضة لكبار السن والأشخاص ذوي الإعاقة",
      title: "الحصول على رحلات ميسّرة: Shop-a-Round وEssential Trip Card",
      intro:
        "تقدّم SFMTA برنامجين لمساعدة الركاب إلى جانب خدمة Muni وADA Paratransit العادية. برنامج Shop-a-Round هو حافلة تنقل الركاب المسجَّلين إلى متاجر البقالة والسوبرماركت في San Francisco. أما بطاقة Essential Trip Card فتخفّض أجرة سيارات الأجرة (التاكسي) للرحلات الأساسية — التسوق لشراء البقالة، وزيارات الصيدلية، والمواعيد الطبية — داخل San Francisco. بدأ برنامج Essential Trip Card خلال جائحة COVID-19 ولا يزال متاحًا حتى إشعار آخر.",
      eligibilityNote:
        "قبل أن تبدأ: التسجيل في Shop-a-Round متاح للركاب البالغين من العمر 65 عامًا فأكثر، أو الحاصلين على بطاقة هوية الخصم Clipper Access (المعروفة سابقًا باسم RTC)، أو المؤهلين للحصول على خدمات ADA Paratransit. أما بطاقة Essential Trip Card فمتاحة للمتقدمين البالغين من العمر 65 عامًا فأكثر، أو الذين لديهم إعاقة، أو الذين يعانون من حالة صحية أو صعوبة في التنقل تمنعهم من استخدام Muni أو الوصول إلى محطات أو مواقف النقل القريبة. لكل برنامج عملية تسجيل أو التحاق خاصة به، لذا يُرجى مراجعة الصفحات الرسمية للاطلاع على أحدث التفاصيل قبل التقديم.",
      documents: [
        "إثبات العمر، في حال التقديم استنادًا إلى بلوغ سن 65 عامًا أو أكثر",
        "إثبات الإعاقة أو حالة صحية أو حالة تنقل مؤهِّلة — مثل بطاقة هوية الخصم Clipper Access (RTC)، أو أهلية ADA Paratransit، أو وثائق من مقدّم رعاية صحية",
        "عنوان بريدي حالي، حيث يُرسَل جدول حافلة Shop-a-Round بالبريد إلى الركاب المسجَّلين بدلاً من نشره علنًا",
        "بطاقة هوية تحمل صورة، في حال الالتحاق ببرنامج Essential Trip Card شخصيًا",
      ],
      steps: [
        { title: "تعرّف على Shop-a-Round", desc: "تنقل هذه الحافلة الركاب المسجَّلين إلى متاجر البقالة والسوبرماركت في San Francisco. ستقضي عادةً نحو ساعة في المتجر لكل توقف، ويمكن للركاب المسجَّلين القيام برحلات غير محدودة. تختلف جداول الحافلة حسب الموقع وتُرسَل بالبريد إلى الركاب بعد التسجيل." },
        { title: "سجّل في Shop-a-Round", desc: "تواصل مع Mobility Management Center للتسجيل إذا كنت تبلغ 65 عامًا أو أكثر، أو تحمل بطاقة هوية الخصم Clipper Access، أو تستوفي شروط خدمات ADA Paratransit. يتم تزويدك بمعلومات الأجرة والجدول الحالية عند التسجيل." },
        { title: "تعرّف على Essential Trip Card", desc: "يخفّض هذا البرنامج أجرة سيارات الأجرة للرحلات الأساسية — التسوق لشراء البقالة، وزيارات الصيدلية، والمواعيد الطبية — داخل San Francisco. يقوم الركاب المؤهَّلون بتحميل رصيد على البطاقة ودفع حصة مخفَّضة من أجرة التاكسي العادية؛ يُرجى مراجعة الصفحة الرسمية للاطلاع على مبالغ الدعم الحالية." },
        { title: "الالتحاق ببرنامج Essential Trip Card", desc: "يمكنك الالتحاق بالبرنامج شخصيًا في SF Paratransit Broker's Office، العنوان 68 12th Street، First Floor، San Francisco، أو الاتصال بخط الالتحاق خلال ساعات العمل أيام الأسبوع للاستفسار عن خياراتك." },
        { title: "تأكد من الأجرة الحالية ومبالغ التحميل", desc: "قد تتغيّر تكاليف كلا البرنامجين بمرور الوقت. راجع صفحات SFMTA الرسمية المرتبطة أدناه للاطلاع على أجرة الاتجاه الواحد الحالية لبرنامج Shop-a-Round ومبالغ التحميل لبطاقة Essential Trip Card قبل التخطيط لرحلاتك." },
      ],
      officialLabel: "اطّلع على برامج إمكانية الوصول والنقل التكميلي على SFMTA.com",
      phoneLabel: "SF Paratransit Mobility Management Center (خط الالتحاق ببطاقة Essential Trip Card: 415-351-7053، أيام الأسبوع من 9:00 صباحًا حتى 4:45 مساءً)",
    },
  },
};

export function getPrograms(lang = "en") {
  return PROGRAMS.map((p) => {
    const t = (PROGRAM_T[lang] || {})[p.slug];
    return t ? { ...p, ...t } : p;
  });
}

export function getProgram(slug, lang = "en") {
  const base = PROGRAMS.find((p) => p.slug === slug);
  if (!base) return null;
  const t = (PROGRAM_T[lang] || {})[slug];
  return t ? { ...base, ...t } : base;
}
