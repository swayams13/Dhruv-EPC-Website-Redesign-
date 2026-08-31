// Reads /content/**/*.json, validates every record against its Zod schema
// at module load, and fails the build on any invalid record — the same
// validation-as-law contract the old inline .parse() calls enforced
// (TRD §T-3). See packages/schemas/src/cms.ts for the schemas themselves.
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  EntityRecord,
  Product,
  Certification,
  Approval,
  ProductCategory,
  type CompanySlug,
} from '@vedanta/schemas'
import type { ExplodedFrame } from '../components/ExplodedSequence'

// apps/web/lib -> apps/web -> apps -> repo root -> content
const CONTENT_ROOT = resolve(__dirname, '..', '..', '..', 'content')

function loadDir<T>(dirName: string, schema: { parse: (v: unknown) => T }): T[] {
  const dir = resolve(CONTENT_ROOT, dirName)
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = JSON.parse(readFileSync(resolve(dir, f), 'utf8'))
      try {
        return schema.parse(raw)
      } catch (err) {
        throw new Error(
          `content/${dirName}/${f} failed schema validation: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    })
}

const entities = loadDir('companies', EntityRecord)
const products = loadDir('products', Product)
const productCategories = loadDir('productCategories', ProductCategory)
const certifications = loadDir('certifications', Certification)
const approvals = loadDir('approvals', Approval)

export function getEntity(companySlug: CompanySlug): EntityRecord {
  const found = entities.find((e) => e.companySlug === companySlug)
  if (!found) throw new Error(`No EntityRecord for companySlug "${companySlug}"`)
  return found
}

export function getProduct(companySlug: CompanySlug, slug: string): Product {
  const found = products.find((p) => p.companySlug === companySlug && p.slug === slug)
  if (!found) throw new Error(`No Product for ${companySlug}/${slug}`)
  return found
}

export function getProductsByCompany(companySlug: CompanySlug): Product[] {
  return products.filter((p) => p.companySlug === companySlug)
}

export function getCertifications(companySlug: CompanySlug): Certification[] {
  return certifications.filter((c) => c.companySlug === companySlug)
}

export function getApprovals(companySlug: CompanySlug): Approval[] {
  return approvals.filter((a) => a.companySlug === companySlug)
}

export function getProductCategory(slug: string): ProductCategory {
  const found = productCategories.find((c) => c.slug === slug)
  if (!found) throw new Error(`No ProductCategory "${slug}"`)
  return found
}

export function getProductCategoriesByCompany(companySlug: CompanySlug): ProductCategory[] {
  return productCategories.filter((c) => c.companySlug === companySlug)
}

// Zod guarantees phones.min(1) — same derivation as the old per-company
// dhruvPhoneHref/precisePhoneHref helpers, now company-agnostic.
export function phoneHref(entity: EntityRecord): string {
  return `tel:${entity.phones[0] ?? ''}`
}

export function whatsappHref(entity: EntityRecord): string {
  const number = entity.whatsapp ?? entity.phones[0] ?? ''
  return `https://wa.me/${number.replace('+', '')}`
}

// ─── Non-CMS page-decoration data ───────────────────────────────────────
// No Zod schema exists for these (stats bands, exploded-hero frame paths,
// mega-menu lists) — VG-011 scopes the JSON migration to the four
// schema-backed record types above. Relocated unchanged from the old
// lib/content/{dhruv-epc,precise-engineers,group}.ts files.

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

export const dhruvExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/pressure-vessel/frame-01.avif', webp: '/exploded/pressure-vessel/frame-01.webp' },
  { avif: '/exploded/pressure-vessel/frame-02.avif', webp: '/exploded/pressure-vessel/frame-02.webp' },
  { avif: '/exploded/pressure-vessel/frame-03.avif', webp: '/exploded/pressure-vessel/frame-03.webp' },
]

export const preciseExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/expansion-joint/frame-01.avif', webp: '/exploded/expansion-joint/frame-01.webp' },
  { avif: '/exploded/expansion-joint/frame-02.avif', webp: '/exploded/expansion-joint/frame-02.webp' },
]

export const groupExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/heat-exchanger/frame-01.avif', webp: '/exploded/heat-exchanger/frame-01.webp' },
  { avif: '/exploded/heat-exchanger/frame-02.avif', webp: '/exploded/heat-exchanger/frame-02.webp' },
  { avif: '/exploded/heat-exchanger/frame-03.avif', webp: '/exploded/heat-exchanger/frame-03.webp' },
  { avif: '/exploded/heat-exchanger/frame-04.avif', webp: '/exploded/heat-exchanger/frame-04.webp' },
]

export const dhruvEquipment = {
  'static-equipment': [
    { name: 'Pressure Vessels', scope: 'Reactors, columns, drums to ASME Sec. VIII Div. 1 & 2', href: '/dhruv-epc/equipment/pressure-vessels' },
    { name: 'Heat Exchangers', scope: 'Shell & tube to ASME Sec. VIII Div. 1 & 2, TEMA', href: '/dhruv-epc/equipment/heat-exchangers' },
    { name: 'Storage Tanks & Air Receivers', scope: 'CS/SS storage to API 650 class duty', href: '/dhruv-epc/equipment/storage-tanks' },
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
