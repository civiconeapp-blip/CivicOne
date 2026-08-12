// Registry of SF311 Verint form flows (mapped by live network/DOM inspection, Aug 2026).
// Every form lives at: https://sanfrancisco.form.us.empro.verintcloudservices.com/form/auto/<slug>
// URL query params (e.g. ?Issue=encampment) pre-select radio choices on page 1.

const BASE = 'https://sanfrancisco.form.us.empro.verintcloudservices.com/form/auto';

export const forms = {
    // Street & sidewalk cleaning — garbage, dumping, waste, etc.
    street_cleaning: {
      slug: 'pw_street_cleaning',
      url: `${BASE}/pw_street_cleaning`,
      // Values scraped from the live <select> on the "Request details" page.
      categories: {
        city_garbage_can_overflowing: 'City garbage can or dumpster overflowing',
        electronics: 'Electronics or e-waste',
        event_parade_mess: 'Event or parade mess',
        furniture: 'Furniture',
        glass: 'Glass',
        christmas_tree: 'Holiday tree',
        human_waste_or_urine: 'Human, animal waste, or bodily fluids',
        mattress: 'Mattress',
        bag_and_tag: 'Miscellaneous unhoused related items',
        missed_route_mechanical_sweeping: 'Missed route mechanical street cleaning',
        missed_trashrecyclecompost_collection: 'Missed trash/recycle/compost collection',
        needles_less_than_20: 'Needles - public property',
        oil_paint_other_liquid_spill_wet: 'Oil, paint, or other spill',
        other_contained_hazardous_waste: 'Other contained hazardous waste',
        refrigerator_appliance: 'Refrigerator or appliance',
        shopping_cart: 'Shopping cart',
        tires_less_than_10: 'Tires',
        transit_shelter_platform: 'Transit shelter or platform',
        auto_accident_debris: 'Vehicle accident debris',
        other_loose_garbage_debris_yard_waste: 'Other loose garbage, debris, or yard waste',
        other_bagged_boxed_contained_garbage: 'Other bagged, boxed, or contained garbage',
      },
      // This form keeps Email (Required) visible even for anonymous reports.
      anonymousNeedsEmail: true,
    },

    // Blocked street/sidewalk — includes encampments and illegally parked vehicles.
    blocked_street_sidewalk: {
      slug: 'cs_block_street_sidewalk',
      url: `${BASE}/cs_block_street_sidewalk`,
      // Radio choice on page 1 is pre-selectable by URL param.
      urlParams: (category) => {
        if (category === 'encampment') return '?Issue=encampment&temp_Header=Encampment%20Issues';
        return '';
      },
      categories: {
        blocking_driveway_cite_only: 'Blocking my driveway - citation only',
        blocking_driveway_cite_tow: 'Blocking my driveway - citation and tow',
        blocking_bicycle_lane: 'Blocking bicycle lane',
        double_parking: 'Double parking',
        large_vehicle: 'Large vehicle - two-hour parking',
        parking_on_sidewalk: 'Parking on sidewalk',
        other_illegal_parking: 'Other illegal parking',
        blocked_sidewalk: 'Blocked sidewalk',
        blocked_parking_space_or_strip: 'Blocked parking space',
        encampment: 'Encampment',
      },
      // This form shows a dedicated "Report Anonymously" button — no email needed.
      anonymousNeedsEmail: false,
    },
};
