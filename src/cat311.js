/**
 * cat311.js — static translations for DataSF 311 category names.
 *
 * DataSF's service_name values come from a finite official list; these are
 * translated once as verified static strings. Any category not in this map
 * renders in its original English — never machine-translated, never guessed.
 * zh is Traditional Chinese per site standard.
 */

const CAT_T = {
  "Street and Sidewalk Cleaning": { es: "Limpieza de calles y aceras", zh: "街道與人行道清潔", vi: "Vệ sinh đường phố và vỉa hè", ar: "تنظيف الشوارع والأرصفة" },
  "Graffiti": { es: "Grafiti", zh: "塗鴉", vi: "Vẽ bậy", ar: "كتابات على الجدران" },
  "Encampments": { es: "Campamentos", zh: "露宿營地", vi: "Lều trại", ar: "مخيمات المشردين" },
  "Encampment": { es: "Campamento", zh: "露宿營地", vi: "Lều trại", ar: "مخيم مشردين" },
  "Abandoned Vehicle": { es: "Vehículo abandonado", zh: "廢棄車輛", vi: "Xe bỏ hoang", ar: "مركبة مهجورة" },
  "Sewer Issues": { es: "Problemas de alcantarillado", zh: "下水道問題", vi: "Sự cố cống thoát nước", ar: "مشاكل الصرف الصحي" },
  "Damaged Property": { es: "Propiedad dañada", zh: "公物損壞", vi: "Tài sản bị hư hại", ar: "ممتلكات متضررة" },
  "Noise Report": { es: "Reporte de ruido", zh: "噪音舉報", vi: "Báo cáo tiếng ồn", ar: "بلاغ ضوضاء" },
  "Tree Maintenance": { es: "Mantenimiento de árboles", zh: "樹木養護", vi: "Bảo dưỡng cây xanh", ar: "صيانة الأشجار" },
  "Streetlights": { es: "Alumbrado público", zh: "路燈", vi: "Đèn đường", ar: "إنارة الشوارع" },
  "Illegal Postings": { es: "Carteles ilegales", zh: "非法張貼", vi: "Dán quảng cáo trái phép", ar: "ملصقات غير قانونية" },
  "Parking Enforcement": { es: "Control de estacionamiento", zh: "違規停車執法", vi: "Thực thi đỗ xe", ar: "مخالفات وقوف السيارات" },
  "Sidewalk or Curb": { es: "Acera o bordillo", zh: "人行道或路緣", vi: "Vỉa hè hoặc lề đường", ar: "الرصيف أو الحافة" },
  "Blocked Street or SideWalk": { es: "Calle o acera bloqueada", zh: "街道或人行道受阻", vi: "Đường hoặc vỉa hè bị chặn", ar: "شارع أو رصيف مسدود" },
  "Muni Service Feedback": { es: "Comentarios sobre el servicio Muni", zh: "Muni 服務意見", vi: "Góp ý dịch vụ Muni", ar: "ملاحظات على خدمة Muni" },
  "Litter Receptacles": { es: "Contenedores de basura", zh: "垃圾桶", vi: "Thùng rác", ar: "حاويات القمامة" },
  "Rec and Park Requests": { es: "Solicitudes de parques y recreación", zh: "公園與康樂請求", vi: "Yêu cầu về công viên", ar: "طلبات الحدائق والترفيه" },
  "Homeless Concerns": { es: "Asuntos de personas sin hogar", zh: "無家者相關事項", vi: "Vấn đề người vô gia cư", ar: "شؤون المشردين" },
  "General Request": { es: "Solicitud general", zh: "一般請求", vi: "Yêu cầu chung", ar: "طلب عام" },
};

export function translateCategory(name, lang) {
  if (!name || lang === "en") return name;
  const exact = CAT_T[name];
  if (exact && exact[lang]) return exact[lang];
  // "General Request - PUBLIC WORKS" style: translate the prefix, keep the rest
  if (name.startsWith("General Request")) {
    const g = CAT_T["General Request"][lang];
    const rest = name.slice("General Request".length);
    return g ? g + rest : name;
  }
  return name; // unknown category: honest English fallback
}
