// Seeded CMS content — Precise Engineers (Session 8 proving pair).
// Every record is parsed through @vedanta/schemas at module load: invalid
// content fails the build, not the reader (validation-as-law, TRD §T-3).
//
// SOURCING (CLAUDE.md: no invented claims):
// - Facts marked [source: vedantagroup.net] are quoted from the live site
//   (precise-engineers, precise-engineers/about-us.php,
//   precise-engineers/metallic-expansion-bellows-joint.php), fetched 2026-07-11.
// - Figures marked DEMO-PLACEHOLDER are industry-plausible demo values
//   approved by Swayam (2026-07-10, Session 7 precedent) for the management
//   prototype ONLY.
//   ═══ SWAP-LIST — every DEMO-PLACEHOLDER below must be replaced with
//   engineering-supplied data before launch (plan §P-5). ═══

import { Approval, Certification, EntityRecord, Product } from '@vedanta/schemas'

export const preciseEntity = EntityRecord.parse({
  companySlug: 'precise-engineers',
  legalName: 'Precise Engineers',
  worksAddresses: [
    // [source: vedantagroup.net/precise-engineers/about-us.php] "established at
    // V.U.Nagar G.I.D.C, Anand, Gujarat, in the year 1994"
    { label: 'Works', address: '705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat, India' },
  ],
  registeredOffice:
    '705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat, India', // [source: vedantagroup.net]
  phones: ['+919377773186'], // [source: vedantagroup.net/precise-engineers]
  emails: ['preciseengineers@vedantagroup.net', 'sjm@vedantagroup.net'], // [source: vedantagroup.net]
  // Canonical Stamp codes (§12). EIL approval is an Approval record, not a stamp.
  stampsHeld: ['ISO-9001'], // [source: vedantagroup.net "ISO 9001:2015 certified"]
  whatsapp: '+919377773186', // DEMO-PLACEHOLDER: WhatsApp number unconfirmed — using primary phone
  contentRevisedDate: '2026-07-11',
})

const primaryPhone = preciseEntity.phones[0] ?? ''
export const precisePhoneHref = `tel:${primaryPhone}`
export const preciseWhatsappHref = `https://wa.me/${(preciseEntity.whatsapp ?? primaryPhone).replace('+', '')}`

export const metallicBellows = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'metallic-bellows-expansion-joint', // plan §3.2 sitemap slug
  name: 'Metallic Bellows Expansion Joints',
  // [source: vedantagroup.net metallic-expansion-bellows-joint.php] "80 mm to
  // 8000 mm for circular bellows"; EJMA/ASME per same page + plan §6.2
  oneLineScope: 'Metallic bellows expansion joints to EJMA and ASME B31.3, 80 – 8,000 mm NB circular',
  group: 'expansion-joints',
  specTable: [
    // [source: vedantagroup.net metallic-expansion-bellows-joint.php]
    { param: 'Design codes', value: 'EJMA · ASME B31.3', note: 'FEA analysis under special conditions' },
    { param: 'Size range — circular', value: '80 – 8,000', unit: 'mm NB' },
    { param: 'Size range — rectangular', value: 'up to 9,000 × 5,000', unit: 'mm' },
    {
      param: 'Bellows materials',
      value: 'SS 304/304L/316/316L/321/310, Inconel 600/625, Incoloy 800/825, Hastelloy, duplex',
    },
    // DEMO-PLACEHOLDER rows (plan Appendix A fields) — swap with engineering data before launch:
    { param: 'Design pressure', value: 'full vacuum to 40', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: '−100 to +900', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Movements', value: 'axial · lateral · angular, per EJMA design', note: 'DEMO — movement tables pending' },
    { param: 'Cycle life', value: 'per EJMA fatigue design', note: 'DEMO — cycle-life data pending' },
    { param: 'End connections', value: 'Weld ends, fixed & rotating flanges', note: 'DEMO — engineering data pending' },
  ],
  types: [
    // [source: vedantagroup.net metallic-expansion-bellows-joint.php] — all 8
    // configurations named on the live site; application notes are standard
    // EJMA configuration descriptions, not capability claims.
    { name: 'Single', description: 'One bellows absorbing axial movement in a straight run.' },
    { name: 'Universal', description: 'Two bellows with centre spool for large lateral movement.' },
    { name: 'Tied lateral', description: 'Tie rods restrain pressure thrust; absorbs lateral offset.' },
    { name: 'Hinged', description: 'Angular rotation in one plane; used in sets of two or three.' },
    { name: 'Gimbal', description: 'Angular rotation in any plane via a gimbal ring.' },
    { name: 'Pressure-balanced elbow', description: 'Balances pressure thrust at a change of direction.' },
    { name: 'Inline pressure-balanced', description: 'Balances pressure thrust in a straight run.' },
    { name: 'Externally pressurized', description: 'Pressure applied to the bellows OD; suits high axial travel.' },
  ],
  materials: [
    // [source: vedantagroup.net metallic-expansion-bellows-joint.php]
    'SS 304 / 304L',
    'SS 316 / 316L',
    'SS 321',
    'SS 310',
    'Inconel 600 / 625',
    'Incoloy 800 / 825',
    'Hastelloy',
    'Duplex',
  ],
  codes: ['EJMA', 'ASME B31.3'],
  faqs: [
    {
      question: 'Which design codes do you design metallic bellows expansion joints to?',
      answer:
        'Metallic bellows expansion joints are designed and engineered to the EJMA (Expansion Joint Manufacturers Association) standards and ASME B31.3 piping code requirements. Under special conditions FEA analysis is carried out.',
    },
    {
      question: 'What size range of metallic expansion joints do you manufacture?',
      answer:
        'Circular metallic bellows from 80 mm to 8,000 mm nominal bore, and rectangular bellows up to 9,000 mm × 5,000 mm — manufactured at the Vitthal Udyognagar works, Anand, Gujarat.',
    },
    {
      question: 'What types of metallic expansion joints do you supply?',
      answer:
        'Single, universal, tied lateral, hinged, gimbal, pressure-balanced elbow, inline pressure-balanced and externally pressurized expansion joints — selected to absorb axial, lateral, angular or combined movements per the EJMA design method.',
    },
    {
      question: 'Which bellows materials can you work with?',
      answer:
        'Stainless steel grades SS 304, 304L, 316, 316L, 321 and 310; nickel alloys Inconel 600 and 625, Incoloy 800 and 825, and Hastelloy; and duplex materials.',
    },
    {
      question: 'Which industry sectors do you supply expansion joints to?',
      answer:
        'Oil & gas, refineries & petrochemicals, fertilizers, power & energy, steel, cement, ship building, cross-country pipelines, sugar, dairy, paper and the Department of Atomic Energy. Precise Engineers is an EIL-approved unit, established 1994.',
    },
  ],
  gallery: [], // real works photography pending (plan §P-5) — no-photo variants render
  relatedProjectSlugs: [], // case-study records land in Phase 4
})

export const preciseCertifications = [
  // [source: vedantagroup.net] — scope statements are the credential's plain
  // meaning per Datum §20; validity dates DEMO-PLACEHOLDER until scans arrive
  Certification.parse({
    companySlug: 'precise-engineers',
    name: 'ISO 9001:2015',
    scopeStatement: 'Certified quality management system for design and manufacture of expansion joints and bellows',
    issuer: 'ISO',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — certificate scan pending
  }),
  Certification.parse({
    companySlug: 'precise-engineers',
    name: 'EIL Approved Vendor',
    scopeStatement: 'Approved unit of Engineers India Limited for expansion bellows and joints',
    issuer: 'Engineers India Limited',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — approval document pending
  }),
]

export const preciseApprovals = [
  // [source: vedantagroup.net] "EIL approved unit"; year DEMO-PLACEHOLDER
  Approval.parse({ companySlug: 'precise-engineers', approvingOrg: 'Engineers India Limited (EIL)', entityClass: 'EPC', category: 'Approved vendor — expansion bellows & joints', year: 2020 }),
]

// §19 home stats band — four mono figures, all sourced.
export const preciseStats = [
  { value: '30+ yrs', label: 'In expansion joints', source: 'Est. 1994, V.U.Nagar, Anand' }, // [source: vedantagroup.net]
  { value: '80 – 8,000 mm', label: 'Bellows size range', source: 'Circular NB; rectangular to 9,000 × 5,000 mm' }, // [source: vedantagroup.net]
  { value: 'EJMA · ASME', label: 'Design codes' }, // [source: vedantagroup.net]
  { value: '12 sectors', label: 'Oil & gas to atomic energy' }, // [source: vedantagroup.net about-us.php sector list]
]

// Mega-menu / home-grid product list — [source: vedantagroup.net/precise-engineers].
// Grouped per plan §3.2. Scopes carry figures per §16 only where sourced;
// only /products/metallic-bellows-expansion-joint is built (proving pair);
// remaining routes are Phase 4 scale-out.
export const preciseProducts = {
  'expansion-joints': [
    { name: 'Metallic Bellows Expansion Joints', scope: 'EJMA/ASME B31.3, 80 – 8,000 mm NB circular', href: '/precise-engineers/products/metallic-bellows-expansion-joint' },
    { name: 'Telescopic Expansion Joints', scope: 'Slip-type joints for axial traverse', href: '/precise-engineers/products/telescopic-expansion-joint' },
    { name: 'Rubber Bellows', scope: 'Elastomeric joints for vibration and movement', href: '/precise-engineers/products/rubber-bellows' },
    { name: 'Fabric Bellows', scope: 'Fabric layup joints for hot flue-gas ducting', href: '/precise-engineers/products/fabric-bellows' },
    { name: 'Dismantling Joints', scope: 'Flanged joints with adjustment length for valve removal', href: '/precise-engineers/products/dismantling-joint' },
    { name: 'Flange Adaptors', scope: 'Pipe-to-flange transition couplings', href: '/precise-engineers/products/flange-adaptor' },
  ],
  'flow-control': [
    { name: 'Zero Velocity Valves', scope: 'Water-hammer protection for pumping mains', href: '/precise-engineers/products/zero-velocity-valve' },
    { name: 'Dual Plate Check Valves', scope: 'Compact non-return valves', href: '/precise-engineers/products/dual-plate-check-valve' },
    { name: 'Dampers', scope: 'Louver, butterfly and guillotine duct dampers', href: '/precise-engineers/products/damper' },
  ],
}
