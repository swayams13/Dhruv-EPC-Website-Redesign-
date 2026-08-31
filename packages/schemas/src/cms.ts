// CMS schemas — Zod validation for T-3 data model
// Rules are the design system's law made executable (TRD §T-3):
//   - Product.oneLineScope must contain a digit
//   - Testimonial publish blocked without all attribution fields
//   - EntityRecord is a singleton — entity data never hard-coded

import { z } from 'zod'

export const CompanySlug = z.enum(['dhruv-epc', 'precise-engineers', 'group'])
export type CompanySlug = z.infer<typeof CompanySlug>

export const EntityRecord = z.object({
  companySlug: CompanySlug,
  legalName: z.string().min(1),
  cin: z.string().optional(),
  gst: z.string().optional(),
  worksAddresses: z.array(z.object({
    label: z.string(),
    address: z.string(),
  })).min(1),
  registeredOffice: z.string(),
  phones: z.array(z.string()).min(1),
  emails: z.array(z.string().email()).min(1),
  stampsHeld: z.array(z.string()),
  whatsapp: z.string().optional(),
  contentRevisedDate: z.string(),  // ISO date string
})
export type EntityRecord = z.infer<typeof EntityRecord>

// onlineLineScope MUST contain at least one digit — CMS validation rule
const oneLinescopeWithNumber = z.string().regex(/\d/, 'One-line scope must contain at least one figure (e.g. a size, code, or tonnage)')

export const SpecTableRow = z.object({
  param: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  note: z.string().optional(),
})

export const ProductFAQ = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})
export type ProductFAQ = z.infer<typeof ProductFAQ>

// Which code governs which phase of a product's lifecycle — design/fab/test
// are distinct approval gates for an EPC buyer, unlike the flat `codes` list.
export const StandardsMatrixEntry = z.object({
  code: z.string().min(1),
  phase: z.enum(['design', 'fabrication', 'testing']),
})

// Session-5 (VG-012) product-detail presentation copy — moved out of the 17
// hand-written page.tsx files so a single [category]/[slug] route can render
// every product. Optional: the dynamic route falls back to a generic render
// (built from name/codes/materials) for products that don't carry this yet.
export const ProductPage = z.object({
  metaTitle: z.string().max(60, 'Title budget is 60 chars — VG-062 metadata-uniqueness'),
  metaDescription: z.string(),
  breadcrumbLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  valueStatement: z.string().min(1),
  heroChips: z.array(z.string()),
  certChips: z.array(z.string()),
  specCaption: z.string().min(1),
  materialsHeading: z.string().min(1),
  qaSteps: z.array(z.object({ step: z.string().min(1), caption: z.string().min(1) })),
  qaClosing: z.string().min(1),
})
export type ProductPage = z.infer<typeof ProductPage>

export const Product = z.object({
  companySlug: CompanySlug,
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase hyphenated'),
  name: z.string().min(1),
  oneLineScope: oneLinescopeWithNumber,
  group: z.enum(['static-equipment', 'skids-packages', 'fabrication-machining', 'expansion-joints', 'flow-control']),
  specTable: z.array(SpecTableRow).min(1, 'A product page without a spec table does not ship'),
  types: z.array(z.object({ name: z.string(), description: z.string() })),
  materials: z.array(z.string()),
  codes: z.array(z.string()),
  faqs: z.array(ProductFAQ).min(4, 'FAQ block requires 4–6 Q&As (GEO surface — Datum §21)').max(6),
  gallery: z.array(z.object({
    src: z.string(),
    alt: z.string().min(10, 'Alt text must carry technical facts (a11y + SEO + GEO)'),
    caption: z.string().optional(),
  })),
  relatedProjectSlugs: z.array(z.string()),
  categorySlug: z.string(),
  industrySlugs: z.array(z.string()).min(1, 'A product without an industry is unfindable — assign at least one'),
  capabilitySlugs: z.array(z.string()),
  standardsMatrix: z.array(StandardsMatrixEntry),
  page: ProductPage.optional(),
})
export type Product = z.infer<typeof Product>

// Testimonial: blocked without full attribution (Datum §20 + FR-4)
export const Testimonial = z.object({
  companySlug: CompanySlug,
  quote: z.string().max(200, 'Quote must be ≤ 40 words (200 chars)'),
  // These three fields are required to publish — no unattributed quotes render
  attnCompany: z.string().min(1, 'Attribution company required to publish'),
  attnRole: z.string().min(1, 'Attribution role required to publish'),
  provenance: z.string().min(1, 'Provenance (e.g. "Vendor performance evaluation, 2024") required to publish'),
})
export type Testimonial = z.infer<typeof Testimonial>

export const Certification = z.object({
  companySlug: CompanySlug,
  name: z.string().min(1),
  scopeStatement: z.string().min(10, 'Scope statement required — a credential without scope is decoration'),
  issuer: z.string().min(1),
  validFrom: z.string(),
  validTo: z.string().optional(),
  artifactUrl: z.string().url().optional(),
})
export type Certification = z.infer<typeof Certification>

export const Approval = z.object({
  companySlug: CompanySlug,
  approvingOrg: z.string().min(1),
  entityClass: z.enum(['PSU', 'EPC', 'TPIA']),
  category: z.string().optional(),
  year: z.number().int().min(1990),
})
export type Approval = z.infer<typeof Approval>

export const Client = z.object({
  companySlugs: z.array(CompanySlug).min(1),
  name: z.string().min(1),
  sector: z.string().min(1),
  logoUrl: z.string().url().optional(),
  // If no logo, a text-tile renders — never a blank (Datum §20)
  permission: z.enum(['logo-approved', 'name-only']),
})
export type Client = z.infer<typeof Client>

export const ProjectMetric = z.object({
  label: z.string().min(1),
  value: z.string().min(1),  // mono display — must be a figure with unit
})

export const Project = z.object({
  companySlug: CompanySlug,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  sector: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int(),
  metrics: z.array(ProjectMetric).min(1).max(4),
  body: z.string().min(100),
  qaSection: z.string().min(1, 'QA section required — TPIA persona reads this'),
  photos: z.array(z.object({
    src: z.string(),
    alt: z.string().min(10),
    caption: z.string().optional(),
  })).min(1),
  anonymized: z.boolean(),
  anonymizationLabel: z.string().optional(),
  productSlugs: z.array(z.string()).min(1, 'A project without a linked product is unfindable — assign at least one'),
  industrySlug: z.string(),
  capabilitySlugs: z.array(z.string()),
  location: z.string(),
  clientSlug: z.string().optional(),
  scope: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  testing: z.string().optional(),
  inspection: z.string().optional(),
  documents: z.array(z.object({
    label: z.string().min(1),
    href: z.string().min(1),
    gated: z.boolean(),
  })),
})
export type Project = z.infer<typeof Project>

// Cross-entity gate (Datum/blueprint §6): a Project referencing a Client
// must resolve to a Client on file with an approved permission. Project
// only holds a slug, so this can't be a Zod .refine() on Project alone —
// the content loader calls this once all entities are parsed.
//
// By design, a Client record is only ever created once permission is
// granted — Client.permission has no "unapproved" state to model, so
// there's no scenario where a Client exists but isn't approved. This
// means "no matching Client record" IS "not approved" — the two are the
// same failure, not two different ones. Confirmed 2026-08-31.
export function validateProjectClientPermission(
  project: Project,
  allClients: (Client & { slug: string })[],
): { success: true } | { success: false; error: string } {
  if (!project.clientSlug) return { success: true }
  const client = allClients.find((c) => c.slug === project.clientSlug)
  if (!client) {
    return { success: false, error: `Project references clientSlug "${project.clientSlug}" with no matching Client record (a Client record only exists once permission is approved)` }
  }
  if (client.permission !== 'logo-approved' && client.permission !== 'name-only') {
    return { success: false, error: `Client "${client.slug}" does not have an approved permission on file` }
  }
  return { success: true }
}

const slugField = z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase hyphenated')

export const ProductCategory = z.object({
  slug: slugField,
  companySlug: CompanySlug,
  name: z.string().min(1),
  oneLineScope: oneLinescopeWithNumber,
  productSlugs: z.array(z.string()),
})
export type ProductCategory = z.infer<typeof ProductCategory>

export const Industry = z.object({
  slug: slugField,
  name: z.string().min(1),
  oneLineScope: oneLinescopeWithNumber,
  requirements: z.string().min(1),
  applications: z.array(z.string()),
  engineeringConsiderations: z.string().min(1),
  // An industry with fewer than two products is the generic SEO page the plan forbids.
  productSlugs: z.array(z.string()).min(2, 'An industry with fewer than two products is the generic SEO page the plan forbids.'),
  capabilitySlugs: z.array(z.string()),
  companySlugs: z.array(CompanySlug),
  faqs: z.array(ProductFAQ).min(4, 'FAQ block requires 4–6 Q&As (GEO surface — Datum §21)').max(6),
})
export type Industry = z.infer<typeof Industry>

export const Capability = z.object({
  slug: slugField,
  name: z.string().min(1),
  companySlugs: z.array(CompanySlug),
  equipmentList: z.array(z.string()),
  envelope: z.array(SpecTableRow).min(1, 'A capability without an envelope spec table does not ship'),
  standards: z.array(z.string()),
  productSlugs: z.array(z.string()),
  faqs: z.array(ProductFAQ).min(4, 'FAQ block requires 4–6 Q&As (GEO surface — Datum §21)').max(6),
})
export type Capability = z.infer<typeof Capability>

export const Resource = z.object({
  slug: slugField,
  title: z.string().min(1),
  type: z.string().min(1),
  fileHref: z.string().min(1),
  gated: z.boolean(),
  relatedSlugs: z.array(z.string()),
})
export type Resource = z.infer<typeof Resource>
