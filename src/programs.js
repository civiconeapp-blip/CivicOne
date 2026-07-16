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
        { title: "Reúna lo que tenga", desc: "Traiga identificación y comprobante de domicilio. Los documentos de ingresos ayudan pero no son necesarios para comenzar — puede solicitar con un ingreso autodeclarado y complementar después." },
        { title: "Solicite en línea o en persona", desc: "Solicite a través de BenefitsCal, o visite una oficina de la Agencia de Servicios Humanos si desea ayuda en persona para completar el formulario." },
        { title: "Reciba su confirmación", desc: "Recibirá un aviso por correo confirmando su inscripción y, en el caso de Medi-Cal, la asignación de su plan de salud." },
        { title: "Encuentre un proveedor", desc: "Una vez inscrito, use el directorio de proveedores de su plan o llame a servicios para miembros para elegir un médico de cabecera cerca de usted." },
      ],
      officialLabel: "Solicite en BenefitsCal.com",
      phoneLabel: "Agencia de Servicios Humanos de SF",
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
        { title: "準備現有資料", desc: "帶上身份證件和地址證明。收入文件有幫助但並非開始申請的必要條件——您可以先自行申報收入,之後再補交。" },
        { title: "線上或親自申請", desc: "透過 BenefitsCal 線上申請,或前往人類服務局辦公室獲得現場協助填寫表格。" },
        { title: "獲取確認通知", desc: "您將收到郵寄的通知,確認您已加入;如為 Medi-Cal,還會告知您的健康計劃分配。" },
        { title: "尋找醫療服務提供者", desc: "加入後,使用您計劃的服務提供者名錄,或致電會員服務部,選擇您附近的家庭醫生。" },
      ],
      officialLabel: "在 BenefitsCal.com 申請",
      phoneLabel: "舊金山人類服務局",
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
        { title: "Chuẩn bị những gì bạn có", desc: "Mang theo giấy tờ tùy thân và bằng chứng địa chỉ. Giấy tờ thu nhập hữu ích nhưng không bắt buộc để bắt đầu — bạn có thể tự khai thu nhập và bổ sung sau." },
        { title: "Nộp đơn trực tuyến hoặc trực tiếp", desc: "Nộp đơn qua BenefitsCal, hoặc đến văn phòng Cơ quan Dịch vụ Nhân sinh nếu bạn muốn được trợ giúp trực tiếp khi điền đơn." },
        { title: "Nhận xác nhận", desc: "Bạn sẽ nhận thông báo qua bưu điện xác nhận việc ghi danh và, với Medi-Cal, chương trình bảo hiểm được chỉ định." },
        { title: "Tìm nhà cung cấp dịch vụ y tế", desc: "Sau khi ghi danh, dùng danh bạ nhà cung cấp của chương trình hoặc gọi bộ phận dịch vụ hội viên để chọn bác sĩ gia đình gần bạn." },
      ],
      officialLabel: "Nộp đơn tại BenefitsCal.com",
      phoneLabel: "Cơ quan Dịch vụ Nhân sinh SF",
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
        { title: "اجمع ما لديك", desc: "أحضر الهوية وإثبات العنوان. مستندات الدخل مفيدة لكنها غير مطلوبة للبدء — يمكنك التقديم بدخل مُصرّح به ذاتيًا واستكمال المستندات لاحقًا." },
        { title: "قدّم عبر الإنترنت أو شخصيًا", desc: "قدّم عبر BenefitsCal، أو قم بزيارة مكتب وكالة الخدمات الإنسانية إذا أردت مساعدة شخصية في إكمال النموذج." },
        { title: "استلم تأكيدك", desc: "ستتلقى إشعارًا بالبريد يؤكد التسجيل، وفي حالة Medi-Cal، تعيين خطتك الصحية." },
        { title: "اعثر على مقدم رعاية", desc: "بعد التسجيل، استخدم دليل مقدمي الخدمة الخاص بخطتك أو اتصل بخدمات الأعضاء لاختيار طبيب رعاية أولية قريب منك." },
      ],
      officialLabel: "قدّم على BenefitsCal.com",
      phoneLabel: "وكالة الخدمات الإنسانية في سان فرانسيسكو",
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
