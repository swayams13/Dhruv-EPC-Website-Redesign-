// Seeded CMS content — Dhruv EPC (Session 7 proving pair).
// Every record is parsed through @vedanta/schemas at module load: invalid
// content fails the build, not the reader (validation-as-law, TRD §T-3).
//
// SOURCING (CLAUDE.md: no invented claims):
// - Facts marked [source: vedantagroup.net] are quoted from the live site
//   (about-us.php, heat-exchanger.php, index), fetched 2026-07-10.
// - Figures marked DEMO-PLACEHOLDER are industry-plausible demo values
//   approved by Swayam (2026-07-10) for the management prototype ONLY.
//   ═══ SWAP-LIST — every DEMO-PLACEHOLDER below must be replaced with
//   engineering-supplied data before launch (plan §P-5). ═══

import { Approval, Certification, EntityRecord, Product } from '@vedanta/schemas'

export const dhruvEntity = EntityRecord.parse({
  companySlug: 'dhruv-epc',
  legalName: 'Dhruv EPC Solutions Pvt. Ltd.',
  worksAddresses: [
    // [source: vedantagroup.net about-us.php]
    { label: 'Works', address: 'Manjusar GIDC, Savli, Vadodara, Gujarat' },
  ],
  registeredOffice:
    '705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat, India', // [source: vedantagroup.net]
  phones: ['+918905917700', '+917436033300'], // [source: vedantagroup.net]
  emails: ['vedant@vedantagroup.net', 'sales3@vedantagroup.net'], // [source: vedantagroup.net]
  // Canonical Stamp codes (§12) — Footer/Stamp render from these
  stampsHeld: ['U', 'U2', 'IBR', 'ISO-9001', 'ISO-14001', 'ISO-45001'], // [source: vedantagroup.net]
  whatsapp: '+918905917700', // DEMO-PLACEHOLDER: WhatsApp number unconfirmed — using primary phone
  contentRevisedDate: '2026-07-10',
})

// Contact hrefs derived once — Zod guarantees phones.min(1)
const primaryPhone = dhruvEntity.phones[0] ?? ''
export const dhruvPhoneHref = `tel:${primaryPhone}`
export const dhruvWhatsappHref = `https://wa.me/${(dhruvEntity.whatsapp ?? primaryPhone).replace('+', '')}`

export const heatExchangers = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'heat-exchangers',
  name: 'Shell & Tube Heat Exchangers',
  // Codes sourced; "up to 100 T" is DEMO-PLACEHOLDER
  oneLineScope: 'Shell & tube exchangers to ASME Sec. VIII Div. 1 & 2 and TEMA, up to 100 T',
  group: 'static-equipment',
  specTable: [
    // [source: vedantagroup.net heat-exchanger.php] — types, codes, MOC
    { param: 'Design codes', value: 'ASME Sec. VIII Div. 1 & 2 · TEMA', note: 'HTRI thermal design' },
    { param: 'Types', value: 'Fixed tube-sheet, floating head, U-tube, kettle, finned tube, double pipe' },
    // DEMO-PLACEHOLDER rows — swap with engineering data before launch:
    { param: 'Shell diameter', value: '300 – 4,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Tube length', value: 'up to 12,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Max unit weight', value: '100', unit: 'T', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure', value: 'up to 250', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: '−100 to +550', unit: '°C', note: 'DEMO figure — engineering data pending' },
    // [source: vedantagroup.net] — MOC and inspection
    {
      param: 'Materials',
      value: 'CS, LTCS, rubber-lined CS, LAS, austenitic SS, duplex SS, high-nickel alloys',
    },
    { param: 'Inspection', value: 'LRS · BV · DNV · IBR', note: 'Third-party and statutory' },
  ],
  types: [
    // [source: vedantagroup.net heat-exchanger.php]
    { name: 'Fixed tube-sheet', description: 'Economical for clean services with low differential expansion.' },
    { name: 'Floating head', description: 'Mechanically cleanable bundle for fouling shell-side services.' },
    { name: 'U-tube', description: 'Absorbs differential expansion; suited to high-pressure tube-side duty.' },
    { name: 'Kettle type', description: 'Reboiler and vaporizer duty with vapour disengagement space.' },
    { name: 'Double pipe', description: 'Small-duty and high-pressure services; finned variants available.' },
    { name: 'Surface condenser & economiser', description: 'Power-cycle heat recovery and condensing duty.' },
  ],
  materials: [
    // [source: vedantagroup.net heat-exchanger.php]
    'Carbon steel',
    'LTCS',
    'Low alloy steel',
    'Austenitic SS',
    'Duplex SS',
    'High-nickel alloys',
    'Rubber-lined CS',
  ],
  codes: ['ASME Sec. VIII Div. 1', 'ASME Sec. VIII Div. 2', 'TEMA', 'IBR'],
  faqs: [
    {
      question: 'Which design codes do you fabricate heat exchangers to?',
      answer:
        'Heat exchangers are designed and fabricated to ASME Section VIII Division 1 and Division 2 with TEMA mechanical standards; thermal design is carried out in HTRI. The works holds ASME U and U2 Certificates of Authorization and IBR approval.',
    },
    {
      question: 'What types of shell & tube heat exchangers do you manufacture?',
      answer:
        'Fixed tube-sheet, floating head, U-tube, kettle-type and finned-tube shell & tube exchangers, plus double-pipe exchangers, surface condensers and economisers.',
    },
    {
      question: 'What materials of construction can you work with?',
      answer:
        'Carbon steel, low-temperature carbon steel, rubber-lined carbon steel, low alloy steel, austenitic stainless steel, duplex stainless steel and high-nickel alloys.',
    },
    {
      question: 'Which third-party inspection agencies have you worked under?',
      answer:
        'Jobs have been executed under third-party inspection agencies including Lloyd’s Register (LRS), Bureau Veritas (BV) and DNV, and the statutory agency IBR.',
    },
    {
      question: 'Which industry sectors do you supply heat exchangers to?',
      answer:
        'Oil & gas, refineries & petrochemicals, fertilizers, power & energy, and steel — from the Manjusar GIDC works at Vadodara, Gujarat.',
    },
  ],
  gallery: [], // real works photography pending (plan §P-5) — no-photo variants render
  relatedProjectSlugs: [], // case-study records land in Phase 4
})

export const dhruvCertifications = [
  // [source: vedantagroup.net] — scope statements are the credential's plain
  // meaning per Datum §20; validity dates DEMO-PLACEHOLDER until scans arrive
  Certification.parse({
    companySlug: 'dhruv-epc',
    name: 'ASME U Certificate of Authorization',
    scopeStatement: 'Authorized to fabricate ASME Sec. VIII Div. 1 pressure vessels',
    issuer: 'ASME',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — certificate scan pending
  }),
  Certification.parse({
    companySlug: 'dhruv-epc',
    name: 'ASME U2 Certificate of Authorization',
    scopeStatement: 'Authorized to fabricate ASME Sec. VIII Div. 2 pressure vessels',
    issuer: 'ASME',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — certificate scan pending
  }),
  Certification.parse({
    companySlug: 'dhruv-epc',
    name: 'IBR Approval',
    scopeStatement: 'Approved to fabricate boiler-quality equipment under the Indian Boiler Regulations',
    issuer: 'Indian Boiler Regulations',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — certificate scan pending
  }),
  Certification.parse({
    companySlug: 'dhruv-epc',
    name: 'ISO 9001:2015 · 14001:2015 · 45001:2018',
    scopeStatement: 'Certified quality, environmental and occupational health & safety management systems',
    issuer: 'ISO',
    validFrom: '2023-01-01', // DEMO-PLACEHOLDER — certificate scan pending
  }),
]

export const dhruvApprovals = [
  // [source: vedantagroup.net] "executed jobs under most third party inspection
  // agencies like LRS, BV, DNV etc and statutory agency IBR"
  Approval.parse({ companySlug: 'dhruv-epc', approvingOrg: 'Lloyd’s Register (LRS)', entityClass: 'TPIA', category: 'Third-party inspection', year: 2020 }),
  Approval.parse({ companySlug: 'dhruv-epc', approvingOrg: 'Bureau Veritas (BV)', entityClass: 'TPIA', category: 'Third-party inspection', year: 2020 }),
  Approval.parse({ companySlug: 'dhruv-epc', approvingOrg: 'DNV', entityClass: 'TPIA', category: 'Third-party inspection', year: 2020 }),
]

// §19 home stats band — four mono figures. Sourced where possible.
export const dhruvStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' }, // [source: vedantagroup.net]
  { value: 'U · U2 · IBR', label: 'Stamps held' }, // [source: vedantagroup.net]
  { value: '100 T', label: 'Max unit weight', source: 'DEMO figure — engineering data pending' }, // DEMO-PLACEHOLDER
  { value: '5 sectors', label: 'Oil & gas to steel' }, // [source: vedantagroup.net]
]

// Mega-menu / home-grid equipment list — [source: vedantagroup.net products].
// Scopes carry figures per §16; DEMO-PLACEHOLDER where the figure is unsourced.
// Only /equipment/heat-exchangers is built (proving pair); remaining routes are
// Phase 4 scale-out.
export const dhruvEquipment = {
  'static-equipment': [
    { name: 'Pressure Vessels', scope: 'Reactors, columns, drums to ASME Sec. VIII Div. 1 & 2', href: '/dhruv-epc/equipment/pressure-vessels' },
    { name: 'Heat Exchangers', scope: 'Shell & tube to ASME Sec. VIII Div. 1 & 2, TEMA', href: '/dhruv-epc/equipment/heat-exchangers' },
    { name: 'Storage Tanks & Air Receivers', scope: 'CS/SS storage to API 650 class duty', href: '/dhruv-epc/equipment/storage-tanks' }, // DEMO-PLACEHOLDER: API 650 unverified
  ],
  'skids-packages': [
    { name: 'Process Skids', scope: 'Skid-mounted process packages, FAT-tested', href: '/dhruv-epc/equipment/process-skids' },
    { name: 'Pipe Spools', scope: 'Shop-fabricated spools, CS/AS/SS, NDT-covered', href: '/dhruv-epc/equipment/pipe-spools' },
  ],
  'fabrication-machining': [
    { name: 'Heavy Fabrication', scope: 'Structural and equipment fabrication', href: '/dhruv-epc/equipment/heavy-fabrication' },
    { name: 'Heavy Machining', scope: 'Large-component machining services', href: '/dhruv-epc/equipment/heavy-machining' },
    { name: 'Plate Flanges & Base Frames', scope: 'Machined flanges and equipment base frames', href: '/dhruv-epc/equipment/plate-flanges' },
  ],
}
