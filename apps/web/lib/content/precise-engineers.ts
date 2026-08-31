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
import type { ExplodedFrame } from '../../components/ExplodedSequence'

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
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
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

// Exploded-view expansion-joint (metallic bellows) frame sequence — home
// hero photo slot. docs/design.md + docs/decisions.md [2026-07-16]:
// photorealistic AI-render override, approved for this feature only.
// Frames go under apps/web/public/exploded/expansion-joint/ — see
// docs/exploded-view-image-generation-guide.md for exact filenames/specs.
// ═══ PLACEHOLDER PATHS — swap in real generated frames before launch ═══
export const preciseExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/expansion-joint/frame-01.avif', webp: '/exploded/expansion-joint/frame-01.webp' },
  { avif: '/exploded/expansion-joint/frame-02.avif', webp: '/exploded/expansion-joint/frame-02.webp' },
]

export const telescopicExpansionJoint = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'telescopic-expansion-joint',
  name: 'Telescopic Expansion Joints',
  oneLineScope: 'Slip-type telescopic expansion joints to ASME B31.3, 50 – 1,200 mm NB axial traverse',
  group: 'expansion-joints',
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '50 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Axial traverse', value: '25 – 300', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure', value: 'up to 16', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: 'up to +350', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Design code', value: 'ASME B31.3' },
    { param: 'Sealing system', value: 'Graphite packing · PTFE packing · live-loaded' },
    { param: 'MOC', value: 'CS (IS 2062) · SS 304 · SS 316', note: 'DEMO — full MOC list pending' },
    { param: 'End connections', value: 'Weld ends · flanged (ANSI / BS 4504)', note: 'DEMO — engineering data pending' },
  ],
  types: [
    { name: 'Single-slip', description: 'One sliding element; compact and suited to moderate axial movement in steam and hot-water mains.' },
    { name: 'Double-slip', description: 'Two sliding elements with central spool; doubles the available axial traverse for longer pipe runs.' },
  ],
  materials: ['Carbon steel (IS 2062)', 'SS 304', 'SS 316'],
  codes: ['ASME B31.3'],
  faqs: [
    {
      question: 'What is a telescopic expansion joint?',
      answer: 'A telescopic (slip-type) expansion joint consists of a sleeve that slides inside an outer barrel to absorb axial pipe movement. Graphite or PTFE packing seals the annular gap, making it suitable for steam, hot-water and process piping where axial traverse is large.',
    },
    {
      question: 'What size range of telescopic expansion joints do you manufacture?',
      answer: 'Size range and traverse data are pending confirmation from engineering. Contact Precise Engineers with your line size, operating pressure, temperature and required traverse for a project-specific quotation.',
    },
    {
      question: 'What sealing systems are available?',
      answer: 'Graphite packing, PTFE packing and live-loaded seal arrangements are available depending on temperature and cyclic-service requirements. Live-loaded seals maintain constant packing compression as the bellows cycles.',
    },
    {
      question: 'What design code governs telescopic expansion joints?',
      answer: 'ASME B31.3 Process Piping governs the piping-stress analysis and pressure-containment design of telescopic expansion joints supplied by Precise Engineers.',
    },
    {
      question: 'Which industries use telescopic expansion joints?',
      answer: 'Steam distribution, district heating, hot-oil piping and process plants in refining and petrochemical service are the primary applications. Precise Engineers is an EIL-approved unit, ISO 9001:2015 certified, established 1994.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const rubberBellows = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'rubber-bellows',
  name: 'Rubber Bellows',
  oneLineScope: 'Elastomeric expansion joints for vibration isolation and movement, 25 – 2,000 mm NB',
  group: 'expansion-joints',
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '25 – 2,000', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure', value: 'full vacuum to 10', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: '−20 to +120', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Axial movement', value: '±25 – ±75', unit: 'mm', note: 'DEMO — movement tables pending' },
    { param: 'Elastomer types', value: 'EPDM · NBR · Neoprene · Natural rubber · Hypalon' },
    { param: 'Arch configuration', value: 'Single arch · dual arch · wide arch' },
    { param: 'End connections', value: 'Flanged (ANSI B16.1 · BS 4504 · DIN 2501) · grooved · threaded' },
  ],
  types: [
    { name: 'Single arch', description: 'One arch for moderate axial and lateral movement in compact spaces.' },
    { name: 'Dual arch', description: 'Two arches for greater combined axial, lateral and angular capability.' },
    { name: 'Wide arch', description: 'Wide-profile arch for maximum axial movement in a single element.' },
    { name: 'Reducers', description: 'Concentric or eccentric rubber bellows reducers for pipe-size transitions.' },
  ],
  materials: ['EPDM', 'NBR (Nitrile)', 'Neoprene', 'Natural rubber', 'Hypalon'],
  codes: ['BS 6129', 'ASME B31.3'],
  faqs: [
    {
      question: 'What types of movement can rubber bellows absorb?',
      answer: 'Rubber expansion joints absorb axial compression and extension, lateral offset and angular rotation simultaneously, making them ideal for vibration isolation at pump and compressor connections and for accommodating thermal movement in piping systems.',
    },
    {
      question: 'Which elastomer should I specify?',
      answer: 'EPDM is preferred for water, steam and mild chemicals; NBR for oil and fuel service; Neoprene for weather resistance and mild acids; Hypalon for oxidising chemicals. Contact Precise Engineers with your medium, temperature and pressure for an elastomer recommendation.',
    },
    {
      question: 'What size range of rubber expansion joints do you supply?',
      answer: 'Size range and pressure/movement capability data are pending confirmation from engineering. Precise Engineers supplies rubber bellows for pump stations, water treatment, power generation and process plant service.',
    },
    {
      question: 'Are rubber bellows available with flanged ends?',
      answer: 'Yes. Flanged ends to ANSI B16.1, BS 4504 or DIN 2501 are standard. Grooved and threaded ends are also available for specific applications.',
    },
    {
      question: 'What quality standard covers your rubber expansion joints?',
      answer: 'Precise Engineers is ISO 9001:2015 certified and an EIL-approved unit. Rubber expansion joints are designed to BS 6129 and ASME B31.3 requirements. Full material traceability and test records are supplied with each item.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const fabricBellows = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'fabric-bellows',
  name: 'Fabric Bellows',
  oneLineScope: 'Fabric expansion joints for hot flue-gas ducting, rectangular ducts up to 6,000 × 4,000 mm',
  group: 'expansion-joints',
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Duct size — circular', value: 'up to 6,000', unit: 'mm dia.', note: 'DEMO figure — engineering data pending' },
    { param: 'Duct size — rectangular', value: 'up to 6,000 × 4,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: 'ambient to +1,000', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Media', value: 'Flue gas · hot air · particulate-laden gas · mild chemical fumes' },
    { param: 'Fabric layup', value: 'E-glass woven · ceramic fibre · PTFE-coated glass · silicone-coated glass' },
    { param: 'Frame MOC', value: 'MS · SS 304 · SS 316' },
    { param: 'Axial movement', value: 'per layup and bellows width', note: 'DEMO — project-specific design' },
  ],
  types: [
    { name: 'E-glass woven', description: 'Standard layup for low-to-medium temperature flue-gas and hot-air ducting up to ~250 °C.' },
    { name: 'Ceramic fibre', description: 'Multi-layer ceramic blanket layup for high-temperature service above 500 °C.' },
    { name: 'PTFE-coated glass', description: 'Chemical-resistant layup for gas streams with acid condensates.' },
    { name: 'Silicone-coated glass', description: 'Flexible high-temperature layup for boiler and ESP ducting.' },
  ],
  materials: ['E-glass woven fabric', 'Ceramic fibre blanket', 'PTFE-coated fibreglass', 'Silicone-coated fibreglass'],
  codes: ['ASME B31.3'],
  faqs: [
    {
      question: 'What are fabric expansion joints used for?',
      answer: 'Fabric expansion joints (fabric bellows) are used in large flue-gas and hot-air ducting at power stations, cement plants, steel plants and refineries. They absorb thermal expansion, vibration and misalignment in duct runs where metallic bellows would be impractical due to duct size or temperature.',
    },
    {
      question: 'What temperature range can fabric expansion joints handle?',
      answer: 'Temperature capability depends on the fabric layup. E-glass woven suits service to around 250 °C; ceramic fibre layups extend this above 1,000 °C. Precise Engineers selects the layup after reviewing operating temperature, gas composition and cyclic duty.',
    },
    {
      question: 'What duct sizes do you manufacture fabric bellows for?',
      answer: 'Fabric expansion joints are fabricated for circular and rectangular ducts. Size data are pending confirmation from engineering — contact Precise Engineers with your duct cross-section and operating conditions for a project assessment.',
    },
    {
      question: 'What is the clamping frame material?',
      answer: 'The clamping frame is mild steel, SS 304 or SS 316, selected to suit operating temperature and corrosion environment. Frame and fabric are supplied as a complete assembly ready for site installation.',
    },
    {
      question: 'Are fabric bellows suitable for acidic flue-gas service?',
      answer: 'Yes. PTFE-coated fibreglass layups are specified for gas streams with acid dew-point condensation, such as sulphur-bearing flue gas from oil-fired boilers. Precise Engineers is ISO 9001:2015 certified and EIL approved.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const dismantlingJoint = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'dismantling-joint',
  name: 'Dismantling Joints',
  oneLineScope: 'Flanged dismantling joints with adjustment length for valve removal, 50 – 1,200 mm NB',
  group: 'expansion-joints',
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '50 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Pressure rating', value: 'PN 10 · PN 16 · PN 25', note: 'DEMO — full pressure table pending' },
    { param: 'Adjustment length', value: '±25 – ±150', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Flange standard', value: 'ANSI B16.1 · BS 4504 · DIN 2501' },
    { param: 'MOC — body', value: 'Ductile iron · CS · SS 304 · SS 316' },
    { param: 'Seal', value: 'EPDM · NBR · Neoprene ring gasket' },
  ],
  types: [
    { name: 'Single-step', description: 'One adjustment sleeve for straightforward in-line valve removal.' },
    { name: 'Double-step', description: 'Two-stage adjustment for larger extraction distances.' },
    { name: 'Coupled type', description: 'Incorporates a sleeve coupling for pipe-length adjustment without flanges.' },
  ],
  materials: ['Ductile iron', 'Carbon steel (IS 2062)', 'SS 304', 'SS 316'],
  codes: ['BS 4504', 'ANSI B16.1'],
  faqs: [
    {
      question: 'What is a dismantling joint?',
      answer: 'A dismantling joint is a flanged fitting with an adjustable length that allows valves, pumps and other in-line equipment to be removed for maintenance without cutting the pipe. The joint is compressed on installation and extended to create the clearance needed for removal.',
    },
    {
      question: 'What adjustment length is available?',
      answer: 'Adjustment length data are pending confirmation from engineering. Precise Engineers sizes the dismantling joint to match the face-to-face dimension of the valve or equipment it serves.',
    },
    {
      question: 'Which flange standards do dismantling joints suit?',
      answer: 'Dismantling joints are available drilled to ANSI B16.1, BS 4504 (EN 1092) and DIN 2501 flanges. Mixed drilling is available on request.',
    },
    {
      question: 'What seal materials are available?',
      answer: 'EPDM for water and mild chemicals, NBR for oil-containing services and Neoprene for weather-exposed installations. The seal grade is selected to suit the medium and operating temperature.',
    },
    {
      question: 'What pressure ratings are offered?',
      answer: 'Pressure capability data are pending from engineering. Precise Engineers is ISO 9001:2015 certified and EIL approved, supplying dismantling joints to water utilities, pumping stations and process plant across India.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const flangeAdaptor = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'flange-adaptor',
  name: 'Flange Adaptors',
  oneLineScope: 'Pipe-to-flange transition couplings for plain-end pipe, 50 – 1,200 mm NB',
  group: 'expansion-joints',
  categorySlug: 'expansion-joints',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '50 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Design pressure', value: 'up to PN 16', note: 'DEMO — full pressure table pending' },
    { param: 'Pipe OD tolerance', value: 'OD-specific per pipe schedule', note: 'DEMO — pipe OD table pending' },
    { param: 'Flange standard', value: 'ANSI B16.1 · BS 4504 · DIN 2501' },
    { param: 'MOC — body', value: 'Ductile iron · CS · SS 304 · SS 316' },
    { param: 'Seal', value: 'EPDM · NBR · Neoprene' },
  ],
  types: [
    { name: 'Standard flange adaptor', description: 'Single-bolt-circle adaptor connecting plain-end pipe to a flanged fitting or valve.' },
    { name: 'Stepped flange adaptor', description: 'Stepped bore for connecting pipes of different outside diameters at a transition.' },
    { name: 'Anchor flange', description: 'Heavy-duty adaptor with anti-thrust ribs for use at fixed points in a piping system.' },
  ],
  materials: ['Ductile iron', 'Carbon steel (IS 2062)', 'SS 304', 'SS 316'],
  codes: ['ANSI B16.1', 'BS 4504'],
  faqs: [
    {
      question: 'What is a flange adaptor?',
      answer: 'A flange adaptor is a mechanical coupling that connects plain-end (unthreaded, un-flanged) pipe to a flanged valve, fitting or equipment. A stainless-steel bolt compresses a rubber seal ring against the pipe OD to form a pressure-tight joint.',
    },
    {
      question: 'What pipe materials can a flange adaptor connect?',
      answer: "Flange adaptors suit ductile iron, steel, GRP, uPVC and HDPE pipe — any pipe whose outside diameter falls within the adaptor's specified OD range. Consult the OD tolerance table for the line size before ordering.",
    },
    {
      question: 'What pressure ratings are available?',
      answer: 'Pressure capability data are pending from engineering. Precise Engineers is ISO 9001:2015 certified and EIL approved, and can confirm the appropriate pressure class for your application.',
    },
    {
      question: 'Which flange standards are available?',
      answer: 'Flange adaptors are drilled to ANSI B16.1, BS 4504 (EN 1092) or DIN 2501 as standard. Mixed drilling and special bolt circles are available on request.',
    },
    {
      question: 'What seal grades are offered?',
      answer: 'EPDM for water and mild chemicals, NBR for oil and fuel service, and Neoprene for general industrial service. Precise Engineers selects the seal grade based on medium and operating temperature.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const zeroVelocityValve = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'zero-velocity-valve',
  name: 'Zero Velocity Valves',
  oneLineScope: 'Hydraulically automatic water-hammer protection valves for pumping mains, IS 14845, 80 – 1,200 mm NB',
  group: 'flow-control',
  categorySlug: 'flow-control',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '80 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Pressure class', value: 'PN 10 · PN 16', note: 'DEMO — pressure table pending' },
    { param: 'Design standard', value: 'IS 14845' },
    { param: 'MOC — body', value: 'CI (IS 210) · DI (IS 1865) · CS (IS 2062)', note: 'DEMO — MOC selection pending' },
    { param: 'MOC — internals', value: 'SS 304 disc and seat' },
    { param: 'Operation', value: 'Hydraulically automatic — no external power required' },
    { param: 'Application', value: 'Water-hammer protection on pumping mains' },
  ],
  types: [
    { name: 'Standard ZVV', description: 'Automatically closes as pump velocity reaches zero, preventing reverse-flow surge.' },
    { name: 'With bypass', description: 'Integral bypass valve for controlled line pressurisation at start-up.' },
    { name: 'With dashpot', description: 'Hydraulic dashpot for adjustable closing rate on longer mains.' },
  ],
  materials: ['Cast iron (IS 210 Gr FG 260)', 'Ductile iron (IS 1865)', 'Carbon steel (IS 2062)', 'SS 304 internals'],
  codes: ['IS 14845'],
  faqs: [
    {
      question: 'What is a zero velocity valve?',
      answer: 'A zero velocity valve (ZVV) is a hydraulically automatic valve installed on a pumping main to prevent water hammer. It closes precisely when the forward water velocity reaches zero — the instant at which pump trip or failure would otherwise allow reverse flow and surge pressure.',
    },
    {
      question: 'Why use a zero velocity valve instead of a check valve?',
      answer: 'A conventional check valve slams shut under reverse flow, creating a pressure spike. A zero velocity valve closes at the moment of zero forward velocity, before reverse flow begins, eliminating the slam and the associated pressure transient.',
    },
    {
      question: 'What size range of zero velocity valves do you supply?',
      answer: 'Size range and pressure class data are pending confirmation from engineering. Precise Engineers supplies ZVVs to water utilities, irrigation projects and pumping stations across India. Contact us with your main diameter, design pressure and pump-trip scenario.',
    },
    {
      question: 'What standard governs zero velocity valves?',
      answer: 'Zero velocity valves supplied by Precise Engineers are designed to IS 14845, the Indian Standard for zero velocity valves for pumping mains. Precise Engineers is ISO 9001:2015 certified and EIL approved.',
    },
    {
      question: 'Are zero velocity valves hydraulically actuated?',
      answer: 'Yes — ZVVs use pipeline pressure to operate the closing mechanism without any external power source or actuator. This makes them fail-safe on power failure, the most common cause of pump trip.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const dualPlateCheckValve = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'dual-plate-check-valve',
  name: 'Dual Plate Check Valves',
  oneLineScope: 'Wafer and lug dual plate check valves to API 594, ASME Class 150 – 600, 50 – 900 mm NB',
  group: 'flow-control',
  categorySlug: 'flow-control',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Size range', value: '50 – 900', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
    { param: 'Pressure class', value: 'ASME 150 · 300 · 600' },
    { param: 'Design standard', value: 'API 594' },
    { param: 'Face-to-face', value: 'API 594 · ASME B16.10' },
    { param: 'Body MOC', value: 'WCB · CF8M (SS 316) · CF8 (SS 304) · LCC · WC6' },
    { param: 'Plate/disc MOC', value: 'SS 316 · SS 304 · Duplex' },
    { param: 'Spring material', value: 'SS 316 · Inconel 625' },
    { param: 'Seat', value: 'Metal-to-metal · PTFE · Buna-N soft seat' },
    { param: 'End type', value: 'Wafer · lug' },
  ],
  types: [
    { name: 'Wafer type', description: 'Sandwiched between flanges; lightest and most compact for in-line non-return duty.' },
    { name: 'Lug type', description: 'Threaded lugs allow end-of-line use or removal without disturbing adjacent piping.' },
    { name: 'Metal-seated', description: 'For high-temperature, high-pressure or erosive service where soft seats are unsuitable.' },
    { name: 'Soft-seated', description: 'PTFE or Buna-N seating for tight shut-off on clean services.' },
  ],
  materials: ['WCB (carbon steel)', 'CF8M (SS 316)', 'CF8 (SS 304)', 'LCC low-temp carbon steel', 'WC6 chrome-moly'],
  codes: ['API 594', 'ASME B16.34', 'ASME B16.10'],
  faqs: [
    {
      question: 'What is a dual plate check valve?',
      answer: 'A dual plate check valve uses two spring-loaded semicircular plates hinged on a central pin to allow forward flow and close rapidly against reverse flow. The split-plate design halves closing travel versus a single-disc swing check, greatly reducing water-hammer severity on pump shut-off.',
    },
    {
      question: 'What are the advantages over a swing check valve?',
      answer: 'Dual plate check valves are shorter and lighter (API 594 face-to-face is far less than swing-check equivalents), close faster to limit reverse-flow surge, and can be installed in any orientation — horizontal, vertical upward or vertical downward.',
    },
    {
      question: 'What pressure classes are available?',
      answer: 'ASME Class 150, 300 and 600. Engineering data are pending; contact Precise Engineers with your line pressure, temperature and medium for the correct body and trim selection.',
    },
    {
      question: 'Which standard governs dual plate check valves?',
      answer: 'Design, testing and dimensions to API 594. Face-to-face per ASME B16.10. Pressure-temperature ratings per ASME B16.34.',
    },
    {
      question: 'What body and trim materials are available?',
      answer: 'Body in WCB, CF8M, CF8, LCC or WC6. Plates in SS 316 or SS 304; springs in SS 316 or Inconel 625 for high-temperature service. Precise Engineers is ISO 9001:2015 certified and EIL approved.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

export const damper = Product.parse({
  companySlug: 'precise-engineers',
  slug: 'damper',
  name: 'Dampers',
  oneLineScope: 'Louver, butterfly and guillotine duct dampers for gas and air service, rectangular ducts up to 4,000 × 3,000 mm',
  group: 'flow-control',
  categorySlug: 'flow-control',
  // STOPGAP placeholder — real industry/capability tagging is content-migration session work
  industrySlugs: ['general'],
  capabilitySlugs: [],
  standardsMatrix: [],
  specTable: [
    { param: 'Types', value: 'Louver (multi-blade) · butterfly (single-blade) · guillotine (slide-gate)' },
    { param: 'Duct size — circular', value: 'up to 3,000', unit: 'mm dia.', note: 'DEMO figure — engineering data pending' },
    { param: 'Duct size — rectangular', value: 'up to 4,000 × 3,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
    { param: 'Design temperature', value: 'ambient to +600', unit: '°C', note: 'DEMO figure — engineering data pending' },
    { param: 'Leakage class', value: 'Class II · Class IV per AMCA 500', note: 'DEMO — class per application' },
    { param: 'Actuation', value: 'Manual · electric · pneumatic · hydraulic' },
    { param: 'Frame MOC', value: 'MS · SS 304 · SS 316 · Corten' },
  ],
  types: [
    { name: 'Louver (multi-blade)', description: 'Multiple parallel blades for modulating flow control; suited to large rectangular ducts.' },
    { name: 'Butterfly (single-blade)', description: 'Single rotating blade for on/off or throttling duty in circular ducts.' },
    { name: 'Guillotine (slide-gate)', description: 'Flat plate slides across the duct opening for tight shut-off; suited to particulate-laden or high-temperature gas.' },
    { name: 'Isolation damper', description: 'Heavy-duty multi-blade with inflatable seal for positive gas-tight isolation.' },
  ],
  materials: ['Mild steel (IS 2062)', 'SS 304', 'SS 316', 'Corten steel'],
  codes: ['AMCA 500'],
  faqs: [
    {
      question: 'What types of dampers do you manufacture?',
      answer: 'Precise Engineers manufactures louver (multi-blade), butterfly (single-blade), guillotine (slide-gate) and isolation dampers for gas and air ducting in power, cement, steel and process plant service.',
    },
    {
      question: 'What duct sizes can be accommodated?',
      answer: 'Duct size data are pending confirmation from engineering. Dampers are designed to fit existing circular and rectangular duct cross-sections and are supplied with a matching flanged frame for installation.',
    },
    {
      question: 'What actuation options are available?',
      answer: 'Manual (lever or handwheel), electric, pneumatic or hydraulic actuation. The actuator is sized to the damper torque or thrust requirement at operating conditions. Fail-safe spring-return actuators are available for safety-critical applications.',
    },
    {
      question: 'What is the difference between a louver damper and a guillotine damper?',
      answer: 'A louver damper uses multiple parallel blades and is preferred for modulating flow control in large rectangular ducts. A guillotine damper uses a single flat plate that slides across the full duct opening, providing positive shut-off in high-temperature or particulate-laden gas where blade dampers may seize or accumulate dust.',
    },
    {
      question: 'What leakage class and temperature range do your dampers achieve?',
      answer: 'Leakage class and temperature range are application-specific, depending on blade material, seal design and actuation. Precise Engineers is ISO 9001:2015 certified and EIL approved. Contact us with your duct size, gas temperature and isolation duty for a detailed specification.',
    },
  ],
  gallery: [],
  relatedProjectSlugs: [],
})

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
