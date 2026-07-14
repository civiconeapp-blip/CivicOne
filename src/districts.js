/**
 * districts.js — single source of truth for all 11 SF supervisor districts.
 *
 * Supervisor roster verified 2026-07-13 against sfbos.org and June 2026
 * special-election results (D2, D4). NOTE: all even-numbered districts
 * (2, 4, 6, 8, 10) are up for election November 2026 — re-verify names
 * in January 2027.
 *
 * `page` links: only D5's deep link has been individually verified.
 * All others point to the verified sfbos.org root until each pattern
 * URL is tap-checked (see /docs verification checklist). Never ship an
 * unverified deep link.
 *
 * `neighborhoods`: only listed where verified from an official source.
 * D5 list is from the official sfbos.org District 5 page.
 */

export const SFBOS_ROOT = "https://sfbos.org";

export const DISTRICTS = [
  { id: 1,  supervisor: "Connie Chan",       page: SFBOS_ROOT, neighborhoods: null },
  { id: 2,  supervisor: "Stephen Sherrill",  page: SFBOS_ROOT, neighborhoods: null },
  { id: 3,  supervisor: "Danny Sauter",      page: SFBOS_ROOT, neighborhoods: null },
  { id: 4,  supervisor: "Alan Wong",         page: SFBOS_ROOT, neighborhoods: null },
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
  { id: 6,  supervisor: "Matt Dorsey",       page: SFBOS_ROOT, neighborhoods: null },
  { id: 7,  supervisor: "Myrna Melgar",      page: SFBOS_ROOT, neighborhoods: null },
  { id: 8,  supervisor: "Rafael Mandelman",  page: SFBOS_ROOT, neighborhoods: null },
  { id: 9,  supervisor: "Jackie Fielder",    page: SFBOS_ROOT, neighborhoods: null },
  { id: 10, supervisor: "Shamann Walton",    page: SFBOS_ROOT, neighborhoods: null },
  { id: 11, supervisor: "Chyanne Chen",      page: SFBOS_ROOT, neighborhoods: null },
];

export function getDistrict(id) {
  const n = Number(id);
  return DISTRICTS.find((d) => d.id === n) || null;
}
