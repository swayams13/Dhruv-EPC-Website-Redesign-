// Non-CMS page-decoration data (stats bands, mega-menu lists) — no Zod
// schema exists for these (VG-011 scopes the JSON migration to
// Product/EntityRecord/Certification/Approval/ProductCategory only). Split
// out of content-loader.ts because that module does `node:fs` reads at load
// time — importing it from a 'use client' component (Chrome nav components)
// would try to bundle 'fs' into the browser build. This file has no fs
// dependency, so it's safe for both server and client imports. Relocated
// unchanged from the old lib/content/{dhruv-epc,precise-engineers,group}.ts
// files.

export const dhruvStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' },
  { value: 'U · U2 · IBR', label: 'Stamps held' },
  { value: '100 T', label: 'Max unit weight', source: 'DEMO figure — engineering data pending' },
  { value: '5 sectors', label: 'Oil & gas to steel' },
]

export const preciseStats = [
  { value: '30+ yrs', label: 'In expansion joints', source: 'Est. 1994, V.U.Nagar, Anand' },
  { value: '80 – 8,000 mm', label: 'Bellows size range', source: 'Circular NB; rectangular to 9,000 × 5,000 mm' },
  { value: 'EJMA · ASME', label: 'Design codes' },
  { value: '12 sectors', label: 'Oil & gas to atomic energy' },
]

export const groupStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' },
  { value: '2 works', label: 'Vadodara · Anand', source: 'Manjusar GIDC · V.U.Nagar GIDC' },
  { value: 'U · U2 · IBR', label: 'Stamps held' },
  { value: '12 sectors', label: 'Oil & gas to atomic energy' },
]

export const dhruvEquipment = {
  'static-equipment': [
    { name: 'Pressure Vessels', scope: 'Reactors, columns, drums to ASME Sec. VIII Div. 1 & 2', href: '/dhruv-epc/products/static-equipment/pressure-vessels/' },
    { name: 'Heat Exchangers', scope: 'Shell & tube to ASME Sec. VIII Div. 1 & 2, TEMA', href: '/dhruv-epc/products/static-equipment/heat-exchangers/' },
    { name: 'Storage Tanks & Air Receivers', scope: 'CS/SS storage to API 650 class duty', href: '/dhruv-epc/products/static-equipment/storage-tanks/' },
  ],
  'skids-packages': [
    { name: 'Process Skids', scope: 'Skid-mounted process packages, FAT-tested', href: '/dhruv-epc/products/skids-packages/process-skids/' },
    { name: 'Pipe Spools', scope: 'Shop-fabricated spools, CS/AS/SS, NDT-covered', href: '/dhruv-epc/products/skids-packages/pipe-spools/' },
  ],
  'fabrication-machining': [
    { name: 'Heavy Fabrication', scope: 'Structural and equipment fabrication', href: '/dhruv-epc/products/fabrication-machining/heavy-fabrication/' },
    { name: 'Heavy Machining', scope: 'Large-component machining services', href: '/dhruv-epc/products/fabrication-machining/heavy-machining/' },
    { name: 'Plate Flanges & Base Frames', scope: 'Machined flanges and equipment base frames', href: '/dhruv-epc/products/fabrication-machining/plate-flanges/' },
  ],
}

export const preciseProducts = {
  'expansion-joints': [
    { name: 'Metallic Bellows Expansion Joints', scope: 'EJMA/ASME B31.3, 80 – 8,000 mm NB circular', href: '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint/' },
    { name: 'Telescopic Expansion Joints', scope: 'Slip-type joints for axial traverse', href: '/precise-engineers/products/expansion-joints/telescopic-expansion-joint/' },
    { name: 'Rubber Bellows', scope: 'Elastomeric joints for vibration and movement', href: '/precise-engineers/products/expansion-joints/rubber-bellows/' },
    { name: 'Fabric Bellows', scope: 'Fabric layup joints for hot flue-gas ducting', href: '/precise-engineers/products/expansion-joints/fabric-bellows/' },
    { name: 'Dismantling Joints', scope: 'Flanged joints with adjustment length for valve removal', href: '/precise-engineers/products/expansion-joints/dismantling-joint/' },
    { name: 'Flange Adaptors', scope: 'Pipe-to-flange transition couplings', href: '/precise-engineers/products/expansion-joints/flange-adaptor/' },
  ],
  'flow-control': [
    { name: 'Zero Velocity Valves', scope: 'Water-hammer protection for pumping mains', href: '/precise-engineers/products/flow-control/zero-velocity-valve/' },
    { name: 'Dual Plate Check Valves', scope: 'Compact non-return valves', href: '/precise-engineers/products/flow-control/dual-plate-check-valve/' },
    { name: 'Dampers', scope: 'Louver, butterfly and guillotine duct dampers', href: '/precise-engineers/products/flow-control/damper/' },
  ],
}
