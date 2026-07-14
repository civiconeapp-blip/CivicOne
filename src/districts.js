/**
 * districts.js — single source of truth for all 11 SF supervisor districts.
 *
 * Supervisor roster verified 2026-07-13 against sfbos.org and June 2026
 * special-election results (D2, D4). NOTE: all even-numbered districts
 * (2, 4, 6, 8, 10) are up for election November 2026 — re-verify names
 * in January 2027.
 *
 * `page` links: all 11 deep links tap-verified by Amal on 2026-07-13.
 * Re-verify after any supervisor change (sfbos.org URLs embed the
 * supervisor's name). Never ship an unverified deep link.
 *
 * `neighborhoods`: only listed where verified from an official source.
 * D5 list is from the official sfbos.org District 5 page.
 */

export const SFBOS_ROOT = "https://sfbos.org";

export const DISTRICTS = [
  { id: 1,  supervisor: "Connie Chan",       page: "https://sfbos.org/supervisor-chan-district-1", neighborhoods: null },
  { id: 2,  supervisor: "Stephen Sherrill",  page: "https://sfbos.org/supervisor-sherrill-district-2", neighborhoods: null },
  { id: 3,  supervisor: "Danny Sauter",      page: "https://sfbos.org/supervisor-sauter-district-3", neighborhoods: null },
  { id: 4,  supervisor: "Alan Wong",         page: "https://sfbos.org/supervisor-wong-district-4", neighborhoods: null },
  {
    id: 5,
    supervisor: "Bilal Mahmood",
    page: "https://sfbos.org/supervisor-mahmood-district-5",
    neighborhoods:
      "Tenderloin · Hayes Valley · Lower Haight · Western Addition · Fillmore · Alamo Square · Japantown · NoPa · Haight Ashbury",
    // Verified 2026-07-13 from the official sfbos.org District 5 page:
    office: {
      address: "1 Dr. Carlton B. Goodlett Place, City Hall, Room 244",
      phone: "(415) 554-7630",
      email: "MahmoodStaff@sfgov.org",
    },
    featured: true, // pilot district — gets verified programs section
  },
  { id: 6,  supervisor: "Matt Dorsey",       page: "https://sfbos.org/supervisor-dorsey-district-6", neighborhoods: null },
  { id: 7,  supervisor: "Myrna Melgar",      page: "https://sfbos.org/supervisor-melgar-district-7", neighborhoods: null },
  { id: 8,  supervisor: "Rafael Mandelman",  page: "https://sfbos.org/supervisor-mandelman-district-8", neighborhoods: null },
  { id: 9,  supervisor: "Jackie Fielder",    page: "https://sfbos.org/supervisor-fielder-district-9", neighborhoods: null },
  { id: 10, supervisor: "Shamann Walton",    page: "https://sfbos.org/supervisor-walton-district-10", neighborhoods: null },
  { id: 11, supervisor: "Chyanne Chen",      page: "https://sfbos.org/supervisor-chen-district-11", neighborhoods: null },
];

export function getDistrict(id) {
  const n = Number(id);
  return DISTRICTS.find((d) => d.id === n) || null;
}
