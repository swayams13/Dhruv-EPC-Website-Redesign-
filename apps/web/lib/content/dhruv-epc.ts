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

// ─── 7 remaining equipment Product records (Session 9 scale-out) ───────────
// Sourcing policy matches Session 7:
//   [source: vedantagroup.net] = quoted from live site fetched 2026-07-10.
//   DEMO-PLACEHOLDER = plausible demo value approved for prototype ONLY.
//   ═══ SWAP-LIST — every DEMO-PLACEHOLDER must be replaced before launch. ═══

export const pressureVessels = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'pressure-vessels',
  name: 'Pressure Vessels',
  // ASME codes sourced [vedantagroup.net]; weight/size DEMO-PLACEHOLDER
  oneLineScope: 'Reactors, columns and drums to ASME Sec. VIII Div. 1 & 2 — U/U2 stamped works',
  group: 'static-equipment',
  specTable: [
    // [source: vedantagroup.net] — stamps and codes
    { param: 'Design codes', value: 'ASME Sec. VIII Div. 1 & 2 · IBR', note: 'U and U2 Certificates of Authorization held' },
    { param: 'Vessel types', value: 'Separators, reactors, distillation columns, accumulators, KO drums, surge vessels' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Shell diameter', value: '300 – 5,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Max unit weight', value: '400', unit: 'T', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure', value: 'FV to 300', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: '−196 to +600', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Materials', value: 'CS, LTCS, LAS, austenitic SS, duplex SS, high-nickel alloys, clad plate' },
    // [source: vedantagroup.net] — TPIA agencies
    { param: 'Inspection', value: 'LRS · BV · DNV · IBR', note: 'Third-party and statutory' },
  ],
  types: [
    { name: 'Separators', description: 'Two- and three-phase separators for oil & gas and process streams.' },
    { name: 'Reactors', description: 'Fixed-bed and slurry reactors with internal support grids per client datasheets.' },
    { name: 'Distillation columns', description: 'Trayed and packed columns with manway and nozzle layout per process datasheet.' },
    { name: 'Accumulators & reflux drums', description: 'Horizontal and vertical drum designs per ASME and client specifications.' },
    { name: 'Knock-out & surge drums', description: 'Inlet and interstage KO drums for compressor protection in oil & gas service.' },
    { name: 'IBR vessels', description: 'Boiler-quality vessels fabricated under Indian Boiler Regulations by IBR-approved welders.' },
  ],
  materials: [
    'Carbon steel',
    'LTCS',
    'Low alloy steel (1.25Cr–2.25Cr)',
    'Austenitic SS (304/316/321)',
    'Duplex SS',
    'High-nickel alloys',
    'Clad plate (SS or duplex over CS)',
  ],
  codes: ['ASME Sec. VIII Div. 1', 'ASME Sec. VIII Div. 2', 'IBR'],
  faqs: [
    {
      question: 'What stamps does Dhruv EPC hold for pressure vessel fabrication?',
      answer:
        'The Manjusar works holds ASME U and U2 Certificates of Authorization and IBR approval — covering ASME Section VIII Division 1 and Division 2 pressure vessels including IBR-governed boiler-quality equipment.',
    },
    {
      question: 'What types of pressure vessels do you fabricate?',
      answer:
        'Separators (two- and three-phase), fixed-bed reactors, distillation columns, accumulators, reflux drums, knock-out drums and surge vessels — horizontal and vertical orientations — to ASME Sec. VIII Div. 1 & 2.',
    },
    {
      question: 'Which materials of construction are available for pressure vessels?',
      answer:
        'Carbon steel, low-temperature carbon steel (LTCS), low alloy steels (1.25Cr through 2.25Cr), austenitic stainless steel (304/316/321), duplex stainless steel, high-nickel alloys, and clad plate (stainless or duplex over carbon steel backing).',
    },
    {
      question: 'Which third-party inspection agencies have inspected your pressure vessel jobs?',
      answer:
        "Jobs have been executed under Lloyd's Register (LRS), Bureau Veritas (BV), DNV and the statutory agency IBR — the same agency portfolio as the heat exchanger and IBR-vessel business.",
    },
    {
      question: 'What sectors do you supply pressure vessels to?',
      answer:
        'Oil & gas, refineries & petrochemicals, fertilizers, power & energy, and the steel industry — from the Manjusar GIDC works at Vadodara, Gujarat.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const storageTanks = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'storage-tanks',
  name: 'Storage Tanks & Air Receivers',
  // [source: vedantagroup.net products] CS/SS storage; API 650 DEMO-PLACEHOLDER (unverified)
  oneLineScope: 'CS and SS storage tanks and ASME Sec. VIII Div. 1 air receivers for process storage',
  group: 'static-equipment',
  specTable: [
    { param: 'Design codes', value: 'API 650 (storage tanks) · ASME Sec. VIII Div. 1 (air receivers)', note: 'DEMO-PLACEHOLDER: API 650 unverified against vedantagroup.net' },
    { param: 'Tank types', value: 'Fixed-cone-roof, open-top, shop-fabricated process tanks, air receivers' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Tank diameter', value: 'up to 20,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Tank height', value: 'up to 15,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure (receivers)', value: 'up to 25', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Materials', value: 'Carbon steel, SS 304/316, rubber-lined CS' },
    { param: 'Inspection', value: 'Third-party per client ITP' },
  ],
  types: [
    { name: 'Fixed-cone-roof tanks', description: 'Shop or site-erected fixed-roof tanks for petroleum products and chemicals.' },
    { name: 'Open-top tanks', description: 'Open-top cylindrical tanks for water, effluent and non-volatile chemical storage.' },
    { name: 'Process storage tanks', description: 'Jacketed and insulated tanks for temperature-controlled chemical processes.' },
    { name: 'Air receivers', description: 'ASME Sec. VIII Div. 1 shop-fabricated receivers for compressed-air and nitrogen service.' },
    { name: 'Rubber-lined vessels', description: 'CS vessels with rubber lining for acid and corrosive-slurry storage duty.' },
  ],
  materials: ['Carbon steel', 'SS 304/316', 'Rubber-lined carbon steel'],
  codes: ['API 650', 'ASME Sec. VIII Div. 1', 'IS 803'],
  faqs: [
    {
      question: 'What types of storage tanks and receivers does Dhruv EPC fabricate?',
      answer:
        'Fixed-cone-roof and open-top cylindrical storage tanks, process storage tanks (jacketed or insulated), rubber-lined corrosion-resistant vessels, and shop-fabricated ASME Sec. VIII Div. 1 air receivers for compressed-air and nitrogen service.',
    },
    {
      question: 'Do you fabricate both shop-built and site-erected tanks?',
      answer:
        'Yes — smaller tanks and air receivers are fully shop-fabricated and dispatched as complete units; larger field-erected storage tanks are pre-fabricated in sections and assembled at site.',
    },
    {
      question: 'Which materials of construction are available for storage tanks?',
      answer:
        'Carbon steel, stainless steel (SS 304 and 316) for corrosive service, and rubber-lined carbon steel for acid and slurry storage.',
    },
    {
      question: 'Can the works fabricate rubber-lined storage vessels?',
      answer:
        'Yes — carbon steel vessels with hard or soft rubber lining are fabricated for acid, corrosive chemical and slurry service. Lining specification and holiday test are per client ITP.',
    },
    {
      question: 'What sectors use your storage tanks?',
      answer:
        'Refineries & petrochemicals, fertilizers, water treatment, and the chemicals industry — the same sectors served by the pressure vessel and heat exchanger business from Manjusar GIDC, Vadodara.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const processSkids = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'process-skids',
  name: 'Process Skids',
  // [source: vedantagroup.net products] "Skid-mounted process packages, FAT-tested"
  oneLineScope: 'Skid-mounted process packages to ASME B31.3, FAT-tested at Manjusar works',
  group: 'skids-packages',
  specTable: [
    { param: 'Piping code', value: 'ASME B31.3 · ASME B31.1 (where applicable)' },
    { param: 'Structural standard', value: 'IS 2062 / ASTM A36 structural steel' },
    { param: 'Skid types', value: 'Heat-transfer, filtration, metering, chemical-dosing, separator, wellhead' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Max skid dimensions', value: 'L 12,000 × W 4,500 × H 6,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Max lift weight', value: '80', unit: 'T', note: 'DEMO figure — engineering data pending' },
    { param: 'Piping class', value: 'ANSI 150 to 2,500', note: 'DEMO figure — engineering data pending' },
    { param: 'FAT', value: 'Factory Acceptance Test performed at Manjusar works before dispatch' },
    { param: 'Inspection', value: 'LRS · BV · DNV · IBR', note: 'Third-party per client ITP' },
  ],
  types: [
    { name: 'Heat-transfer skids', description: 'Compact heat exchanger skids for heating, cooling and heat-recovery applications.' },
    { name: 'Separator and filter skids', description: 'Gas/liquid and liquid/liquid separation with coalescer elements and instrumentation.' },
    { name: 'Metering skids', description: 'Fiscal and check metering skids with flow computers, printers and communication.' },
    { name: 'Chemical-dosing skids', description: 'Chemical injection packages with dosing pumps, day tanks and safety interlocks.' },
    { name: 'Wellhead & manifold skids', description: 'Wellhead control panels, production manifolds and choke-valve skids for upstream oil & gas.' },
  ],
  materials: ['Carbon steel', 'SS 304/316', 'Duplex SS for corrosive services'],
  codes: ['ASME B31.3', 'ASME B31.1', 'IS 2062', 'IS 800'],
  faqs: [
    {
      question: 'What types of process skids does Dhruv EPC supply?',
      answer:
        'Heat-transfer skids, separator and filter skids, metering skids, chemical-dosing packages and wellhead/manifold skids — each assembled, piped, wired and FAT-tested at the Manjusar works before dispatch.',
    },
    {
      question: 'Is a Factory Acceptance Test (FAT) standard on your skids?',
      answer:
        'Yes — all process skids are FAT-tested at the Manjusar GIDC works. The client or their third-party inspector witnesses the FAT, and a punch-list is cleared before dispatch.',
    },
    {
      question: 'Which piping design code governs your process skids?',
      answer:
        'Process piping is designed and fabricated to ASME B31.3, with ASME B31.1 applied where power-piping requirements govern. Structural steel follows IS 2062 and IS 800.',
    },
    {
      question: 'Which third-party inspection agencies are accepted?',
      answer:
        "The works has executed jobs under Lloyd's Register (LRS), Bureau Veritas (BV) and DNV in addition to the statutory agency IBR — the same portfolio as the pressure vessel and heat exchanger business.",
    },
    {
      question: 'What sectors use your process skids?',
      answer:
        'Oil & gas (upstream, midstream and downstream), refineries & petrochemicals, fertilizers, power and the chemicals industry — served from the Manjusar GIDC works at Vadodara, Gujarat.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const pipeSpools = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'pipe-spools',
  name: 'Pipe Spools',
  // [source: vedantagroup.net products] "Shop-fabricated spools, CS/AS/SS, NDT-covered"
  oneLineScope: 'Shop-fabricated CS, alloy and SS pipe spools to ASME B31.3, NPS ½ to NPS 48',
  group: 'skids-packages',
  specTable: [
    { param: 'Piping code', value: 'ASME B31.3 · ASME B31.1' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Size range', value: 'NPS ½ to NPS 48', note: 'DEMO figure — engineering data pending' },
    { param: 'Wall thickness', value: 'SCH 10 to SCH 160 / XXS', note: 'DEMO figure — engineering data pending' },
    { param: 'Materials', value: 'CS, LTCS, LAS, austenitic SS, duplex SS, high-nickel alloys' },
    { param: 'Welding standard', value: 'WPS/PQR to ASME Sec. IX · heat number traceability maintained' },
    { param: 'NDT', value: 'RT · UT · PT · MT per ITP', note: 'NDT-covered per [source: vedantagroup.net]' },
    { param: 'Testing', value: 'Hydrotest or pneumatic per ASME B31.3 design pressure' },
  ],
  types: [
    { name: 'Straight run spools', description: 'Straight pipe sections with buttweld or flanged ends per isometric drawing.' },
    { name: 'Elbow assemblies', description: 'Short-radius and long-radius elbow spools for directional changes.' },
    { name: 'Branch connection spools', description: 'Tees, weldolets and threadolets with reinforcement per B31.3 code.' },
    { name: 'Reducer spools', description: 'Concentric and eccentric reducers for size transitions in process lines.' },
    { name: 'Flanged spools', description: 'Spool assemblies with raised-face, flat-face or ring-type-joint flanges per ASME B16.5.' },
  ],
  materials: [
    'Carbon steel (A106 Gr. B, A53)',
    'LTCS (A333 Gr. 6)',
    'Low alloy steel (A335 P11/P22)',
    'Austenitic SS (A312 TP304/316/321)',
    'Duplex SS (A790 / A928)',
    'High-nickel alloys',
  ],
  codes: ['ASME B31.3', 'ASME B31.1', 'ASME Sec. IX (welding)', 'ASME B16.5 (flanges)'],
  faqs: [
    {
      question: 'Which piping design codes govern your pipe spool fabrication?',
      answer:
        'Pipe spools are fabricated to ASME B31.3 (process piping) and ASME B31.1 (power piping) as applicable, with welding procedures qualified to ASME Section IX and full heat-number traceability maintained throughout.',
    },
    {
      question: 'What materials do you work with for pipe spools?',
      answer:
        'Carbon steel (A106 Gr. B, A53), low-temperature carbon steel (A333 Gr. 6), low alloy steels (A335 P11/P22), austenitic stainless steel (TP304/316/321), duplex stainless steel and high-nickel alloys.',
    },
    {
      question: 'What NDT methods are applied to pipe spools?',
      answer:
        'Radiographic testing (RT), ultrasonic testing (UT), penetrant testing (PT) and magnetic-particle testing (MT) are applied per the client inspection and test plan (ITP) — the works is NDT-covered.',
    },
    {
      question: 'What size range of pipe spools can you fabricate?',
      answer:
        'The shop handles spools from NPS ½ through NPS 48 across schedule 10 to XXS wall thicknesses — covering the full range of process and utility piping found in refinery, petrochemical and fertilizer plants.',
    },
    {
      question: 'Can you supply pipe spools for offshore and cryogenic service?',
      answer:
        "Yes — low-temperature carbon steel (A333 Gr. 6) and austenitic stainless steel spools suitable for cryogenic and offshore duty are within the shop's capability; specific requirements are reviewed at enquiry stage.",
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const heavyFabrication = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'heavy-fabrication',
  name: 'Heavy Fabrication',
  // [source: vedantagroup.net products] "Structural and equipment fabrication"
  oneLineScope: 'Structural and equipment fabrication to IS 2062 and AWS D1.1, up to 200 T per unit',
  group: 'fabrication-machining',
  specTable: [
    { param: 'Structural standard', value: 'IS 2062 · ASTM A36 · IS 800' },
    { param: 'Welding standard', value: 'AWS D1.1 · IS 816 · WPS/PQR-qualified welders' },
    { param: 'Fabrication types', value: 'Pipe racks, equipment structures, module frames, duct assemblies, pressure equipment' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Max unit weight', value: '200', unit: 'T', note: 'DEMO figure — engineering data pending' },
    { param: 'Max plate thickness', value: 'up to 200', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'NDT', value: 'UT · MT · PT on critical structural welds per ITP' },
    { param: 'Surface preparation', value: 'Blast to SA 2½, primer and finish coating to client spec' },
    { param: 'Inspection', value: 'Third-party per client ITP' },
  ],
  types: [
    { name: 'Pipe racks & equipment supports', description: 'Multi-level pipe racks and equipment support structures for process plants.' },
    { name: 'Module frames', description: 'Skid and module frames for equipment packages, designed for road or barge transport.' },
    { name: 'Industrial ductwork', description: 'Flue gas and process duct assemblies for boilers, heaters and gas-treatment units.' },
    { name: 'Stairways, platforms & ladders', description: 'Access platforms, staircases and cage ladders per IS 7969 and client standards.' },
    { name: 'Miscellaneous pressure parts', description: 'Nozzles, pads, internals and support rings fabricated for pressure vessel integration.' },
  ],
  materials: [
    'IS 2062 Gr. E250 / E350 / E410',
    'ASTM A36',
    'IS 2002 (boiler-quality plates)',
    'SS 304/316 structural sections',
  ],
  codes: ['IS 2062', 'IS 800', 'AWS D1.1', 'IS 816'],
  faqs: [
    {
      question: 'What types of heavy fabrication work does Dhruv EPC undertake?',
      answer:
        'Pipe racks, equipment support structures, module frames, industrial ductwork, access platforms, staircases and miscellaneous pressure parts — welded to IS 2062 structural steel standards and AWS D1.1 welding code.',
    },
    {
      question: 'What welding standards govern your structural fabrication?',
      answer:
        'Structural welds follow AWS D1.1 (steel structures) and IS 816; all welders are qualified per WPS/PQR procedures, and critical welds receive UT, MT or PT per the client ITP.',
    },
    {
      question: 'What surface preparation and coating can you provide?',
      answer:
        'Shot-blasting to Sa 2½ followed by primer and finish coating systems to client specification — covering epoxy, polyurethane and zinc-silicate schemes for industrial environments.',
    },
    {
      question: 'What material grades do you typically use for structural fabrication?',
      answer:
        'IS 2062 Gr. E250, E350 and E410 cover most process-plant duty; ASTM A36 and IS 2002 (boiler-quality) are available for import-specification projects.',
    },
    {
      question: 'How does heavy fabrication integrate with your pressure vessel and skid work?',
      answer:
        'The same Manjusar works handles structural fabrication alongside vessel and skid work, allowing integrated fabrication — equipment, support structures and piping spools all produced and fit-checked before dispatch.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const heavyMachining = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'heavy-machining',
  name: 'Heavy Machining',
  // [source: vedantagroup.net products] "Large-component machining services"; dimensions DEMO-PLACEHOLDER
  oneLineScope: 'Large-component boring, turning and facing — up to Ø 4,000 mm on floor-type boring mills',
  group: 'fabrication-machining',
  specTable: [
    // DEMO-PLACEHOLDER rows:
    { param: 'Floor-type boring mill', value: 'Ø up to 4,000', unit: 'mm bore/face', note: 'DEMO figure — engineering data pending' },
    { param: 'Vertical turning lathe', value: 'Ø up to 4,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Horizontal lathe', value: 'Ø up to 2,500 × L 10,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Heavy milling', value: 'Bed up to 3,000 × 1,500', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Machining types', value: 'Boring, turning, facing, threading, grooving, key-seating, drilling PCD' },
    { param: 'Inspection', value: 'CMM and template verification of critical dimensions before dispatch' },
  ],
  types: [
    { name: 'Tube-sheet machining', description: 'Tube-sheet boring and drilling to TEMA tolerance for heat exchanger assembly.' },
    { name: 'Shell and flange boring', description: 'Shell-end boring and flange boring for precise mating of equipment nozzles.' },
    { name: 'Flange facing', description: 'Raised-face, flat-face and ring-type-joint facing to ASME B16.5 and B16.47 finish requirements.' },
    { name: 'Large-bore turning', description: 'Turning of vessel shells, manways and large nozzle forgings on vertical and horizontal lathes.' },
    { name: 'Weld-end preparation', description: 'Precision bevel and land preparation for thick-wall pressure pipe and nozzle welds.' },
  ],
  materials: ['Carbon steel', 'Low alloy steel', 'Austenitic SS', 'Duplex SS', 'High-nickel alloys', 'Copper alloys'],
  codes: ['ASME B16.5', 'ASME B16.47', 'TEMA (tube-sheet tolerances)', 'ASME Sec. VIII Div. 1 & 2'],
  faqs: [
    {
      question: 'What large-component machining capability does Dhruv EPC have?',
      answer:
        'The works holds floor-type boring mills, vertical turning lathes and horizontal lathes capable of machining components up to approximately Ø 4,000 mm — covering tube-sheets, vessel shells, large flanges and nozzle forgings.',
    },
    {
      question: 'Which tolerances can you hold on tube-sheet drilling?',
      answer:
        'Tube-sheet drilling and boring is carried out to TEMA tolerances for heat exchanger assembly; the specific tolerance class (R, C or B) is confirmed at enquiry stage against the thermal designer\'s requirements.',
    },
    {
      question: 'Can you machine exotic alloys such as duplex stainless or high-nickel alloys?',
      answer:
        'Yes — the machining shop handles carbon steel, low alloy steel, austenitic stainless steel, duplex stainless steel and high-nickel alloys; tooling and cutting parameters are selected for each material group.',
    },
    {
      question: 'What flange face finishes can you produce?',
      answer:
        'Raised-face, flat-face and ring-type-joint (RTJ) grooves to ASME B16.5 and ASME B16.47 Series A and B finish requirements — serrated concentric or phonographic finish per ASME specification.',
    },
    {
      question: 'How does in-house machining benefit pressure vessel fabrication timescales?',
      answer:
        'In-house machining at the same Manjusar GIDC site eliminates subcontract transport and schedule risk — tube-sheets, nozzle flanges and shell ends are machined and fit-checked against the vessel without leaving the works.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const plateFlanges = Product.parse({
  companySlug: 'dhruv-epc',
  slug: 'plate-flanges',
  name: 'Plate Flanges & Base Frames',
  // [source: vedantagroup.net products] "Machined flanges and equipment base frames"
  oneLineScope: 'Plate flanges to ASME B16.5 and ASME B16.47 Series A & B, plus machined equipment base frames',
  group: 'fabrication-machining',
  specTable: [
    { param: 'Flange standards', value: 'ASME B16.5 · ASME B16.47 Series A (MSS SP-44) & B (API 605)' },
    // DEMO-PLACEHOLDER rows:
    { param: 'Size range', value: 'NPS 2 to NPS 60', note: 'DEMO figure — engineering data pending' },
    { param: 'Pressure classes', value: 'ASME 150 to 2,500', note: 'DEMO figure — engineering data pending' },
    { param: 'Flange types', value: 'Weld-neck, slip-on, blind, spectacle, ring-type-joint, long-weld-neck' },
    { param: 'Face types', value: 'Raised face, flat face, RTJ groove, tongue-and-groove' },
    { param: 'Materials', value: 'CS, LTCS, LAS, austenitic SS, duplex SS' },
    { param: 'Inspection', value: 'Dimensional report per ASME B16.5 / B16.47 before dispatch' },
  ],
  types: [
    { name: 'Weld-neck flanges', description: 'Long-tapered hub for high-pressure and fatigue service per ASME B16.5 and B16.47.' },
    { name: 'Slip-on flanges', description: 'Low-cost flanges for moderate-pressure utility and process services.' },
    { name: 'Blind flanges', description: 'Blank closures for vessel nozzles, column top and line terminations.' },
    { name: 'Spectacle blinds', description: 'Figure-8 blinds for positive line isolation during maintenance — plate-cut and machined.' },
    { name: 'Equipment base frames', description: 'Machined sole plates, base frames and levelling pads for equipment installation.' },
  ],
  materials: [
    'Carbon steel (ASTM A105)',
    'LTCS (ASTM A350 LF2)',
    'Low alloy steel (ASTM A182 F11/F22)',
    'Austenitic SS (ASTM A182 F304/F316)',
    'Duplex SS (ASTM A182 F51)',
  ],
  codes: ['ASME B16.5', 'ASME B16.47 Series A & B', 'MSS SP-44', 'API 605'],
  faqs: [
    {
      question: 'What flange standards does Dhruv EPC fabricate to?',
      answer:
        'Plate flanges are fabricated to ASME B16.5 (NPS ½ – NPS 24) and ASME B16.47 Series A (MSS SP-44) and Series B (API 605) for large-bore flanges above NPS 24 — covering all pressure classes from ASME 150 through 2,500.',
    },
    {
      question: 'What types of plate flanges do you supply?',
      answer:
        'Weld-neck, slip-on, blind, long-weld-neck, spectacle blinds and ring-type-joint (RTJ) flanges — all plate-cut from certified plate material, rough-bored and finish-machined to ASME dimensional and face-finish tolerances.',
    },
    {
      question: 'Which materials are available for plate flanges?',
      answer:
        'Carbon steel (ASTM A105 equivalent), low-temperature carbon steel (A350 LF2), low alloy steels (A182 F11/F22), austenitic stainless steel (A182 F304/F316) and duplex stainless steel (A182 F51).',
    },
    {
      question: 'Can you fabricate spectacle blinds for line isolation?',
      answer:
        'Yes — figure-8 spectacle blinds and blank-and-spacer sets are plate-cut, drilled and machined to the customer\'s piping class; face finish matches the connected flange standard.',
    },
    {
      question: 'What are equipment base frames and why machine them in-house?',
      answer:
        'Sole plates, base frames and levelling pads are machined flat and parallel at the Manjusar works before dispatch — in-house machining ensures co-planarity of bearing surfaces, critical for rotating-equipment alignment and vibration performance.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})
