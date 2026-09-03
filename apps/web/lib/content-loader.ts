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
  Industry,
  Capability,
  Sector,
  ProjectHighlight,
  ClientRecord,
  type CompanySlug,
} from '@vedanta/schemas'
// Non-CMS page-decoration data has no fs dependency of its own — kept in a
// separate module (site-data.ts) so 'use client' Chrome components can
// import it directly without pulling in this file's node:fs reads. Server
// components that already import both kinds from this module keep working
// via this re-export.
export * from './site-data'

// Next.js sets process.cwd() to the app directory (apps/web) for dev, build,
// and start alike — unlike __dirname, which resolves to the bundled
// webpack chunk's location once this module ships inside .next/server, not
// its original source path.
const CONTENT_ROOT = resolve(process.cwd(), '..', '..', 'content')

// readdirSync returns entries in filesystem (effectively alphabetical) order.
// certifications/ and approvals/ render as ordered lists on the proof pages,
// so their filenames carry an explicit numeric prefix (dhruv-epc-1-…,
// dhruv-epc-2-…) to reproduce the original array order from the pre-JSON
// TS files. products/, companies/, and productCategories/ are looked up by
// slug/companySlug, not rendered in directory order, so no prefix is needed.
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
const industries = loadDir('industries', Industry)
const capabilities = loadDir('capabilities', Capability)
const sectors = loadDir('sectors', Sector)
const projectHighlights = loadDir('projects', ProjectHighlight)
const clients = loadDir('clients', ClientRecord)

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

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getIndustries(): Industry[] {
  return industries
}

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}

export function getCapabilities(): Capability[] {
  return capabilities
}

export function getCapability(slug: string): Capability | undefined {
  return capabilities.find((c) => c.slug === slug)
}

// Sectors served (Clients & Projects §2) — display order per record's own
// `order` field, matching the brochure's own listing sequence.
export function getSectors(): Sector[] {
  return [...sectors].sort((a, b) => a.order - b.order)
}

// Project track record (Clients & Projects §2), grouped by company on the
// page. `company` narrows the result; omit it for the full 15-record list.
export function getProjectHighlights(company?: ProjectHighlight['company']): ProjectHighlight[] {
  const filtered = company ? projectHighlights.filter((p) => p.company === company) : projectHighlights
  return [...filtered].sort((a, b) => a.order - b.order)
}

// Clientele wall records (Clients & Projects §2) — the consent publish gate
// itself lives in ClientLogoWall, not here; this returns every record on
// file (granted, requested, or none) so the component can apply it.
export function getClients(): ClientRecord[] {
  return clients
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
