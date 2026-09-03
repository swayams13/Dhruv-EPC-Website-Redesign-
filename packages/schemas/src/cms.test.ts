import { describe, it, expect } from 'vitest'
import {
  Product,
  Testimonial,
  CompanySlug,
  Project,
  Client,
  ProductCategory,
  Industry,
  Capability,
  Resource,
  SpecTableRow,
  validateProjectClientPermission,
  Approval,
  Sector,
  ClientRecord,
  ProjectHighlight,
} from './cms'

const minProduct = {
  companySlug: 'dhruv-epc' as const,
  slug: 'pressure-vessel-8m3',
  name: 'Pressure Vessel',
  oneLineScope: 'ASME Sec VIII Div 1 vessels up to 8 m³',
  group: 'static-equipment' as const,
  specTable: [{ param: 'Capacity', value: '8', unit: 'm³' }],
  types: [],
  materials: [],
  codes: [],
  faqs: Array.from({ length: 4 }, (_, i) => ({
    question: `Q${i + 1}`,
    answer: `A${i + 1}`,
  })),
  gallery: [],
  relatedProjectSlugs: [],
  categorySlug: 'static-equipment',
  industrySlugs: ['refining'],
  capabilitySlugs: [],
  standardsMatrix: [],
}

const minFaqs = Array.from({ length: 4 }, (_, i) => ({
  question: `Q${i + 1}`,
  answer: `A${i + 1}`,
}))

const minProject = {
  companySlug: 'dhruv-epc' as const,
  slug: 'refinery-vessel-revamp',
  sector: 'Refining',
  title: 'Refinery Vessel Revamp',
  year: 2024,
  metrics: [{ label: 'Weight', value: '50 T' }],
  body: 'x'.repeat(100),
  qaSection: 'Hydrotested per ASME Sec VIII.',
  photos: [{ src: '/p.jpg', alt: 'A vessel during hydrotest at works' }],
  anonymized: false,
  productSlugs: ['pressure-vessel-8m3'],
  industrySlug: 'refining',
  capabilitySlugs: [],
  location: 'Vadodara, Gujarat',
  documents: [],
}

describe('Product.oneLineScope', () => {
  it('rejects a scope with no digit', () => {
    const result = Product.safeParse({ ...minProduct, oneLineScope: 'Pressure vessel design and fabrication' })
    expect(result.success).toBe(false)
  })
  it('accepts a scope containing a digit', () => {
    const result = Product.safeParse(minProduct)
    expect(result.success).toBe(true)
  })
})

describe('SpecTableRow provenance (Session 6, golden page)', () => {
  it('accepts an optional provenance field (SpecRail reads note for the footnote)', () => {
    const row = SpecTableRow.parse({
      param: 'Shell diameter',
      value: '300 – 5,000',
      unit: 'mm',
      note: 'DEMO figure — engineering data pending',
      provenance: 'unverified',
    })
    expect(row.provenance).toBe('unverified')
    expect(row.note).toBe('DEMO figure — engineering data pending')
  })
  it('rejects an invalid provenance value', () => {
    expect(() => SpecTableRow.parse({ param: 'x', value: 'y', provenance: 'confirmed' })).toThrow()
  })
  it('still accepts a row with neither field (existing products)', () => {
    const row = SpecTableRow.parse({ param: 'x', value: 'y' })
    expect(row.provenance).toBeUndefined()
  })
})

describe('SpecTableRow rail flag (Session 7, template rollout)', () => {
  it('accepts an optional rail boolean, independent of provenance', () => {
    const row = SpecTableRow.parse({ param: 'x', value: 'y', rail: true })
    expect(row.rail).toBe(true)
  })

  it('defaults to undefined when omitted (no rail row implied)', () => {
    const row = SpecTableRow.parse({ param: 'x', value: 'y' })
    expect(row.rail).toBeUndefined()
  })

  it('rejects a non-boolean rail value', () => {
    expect(() => SpecTableRow.parse({ param: 'x', value: 'y', rail: 'yes' })).toThrow()
  })
})

describe('Testimonial attribution gate', () => {
  const base = { companySlug: 'dhruv-epc' as const, quote: 'Excellent quality.' }
  it('blocks publish when attnCompany is missing', () => {
    const result = Testimonial.safeParse({ ...base, attnRole: 'PM', provenance: 'Eval 2024' })
    expect(result.success).toBe(false)
  })
  it('blocks publish when attnRole is missing', () => {
    const result = Testimonial.safeParse({ ...base, attnCompany: 'BPCL', provenance: 'Eval 2024' })
    expect(result.success).toBe(false)
  })
  it('blocks publish when provenance is missing', () => {
    const result = Testimonial.safeParse({ ...base, attnCompany: 'BPCL', attnRole: 'PM' })
    expect(result.success).toBe(false)
  })
  it('passes with full attribution', () => {
    const result = Testimonial.safeParse({ ...base, attnCompany: 'BPCL', attnRole: 'PM', provenance: 'Vendor eval 2024' })
    expect(result.success).toBe(true)
  })
})

describe('CompanySlug', () => {
  it('rejects cross-entity slug', () => {
    expect(CompanySlug.safeParse('dhruv-precise').success).toBe(false)
  })
  it('accepts valid slugs', () => {
    expect(CompanySlug.safeParse('dhruv-epc').success).toBe(true)
    expect(CompanySlug.safeParse('precise-engineers').success).toBe(true)
    expect(CompanySlug.safeParse('group').success).toBe(true)
  })
})

describe('ProductCategory shape', () => {
  const min = {
    slug: 'static-equipment',
    companySlug: 'dhruv-epc' as const,
    name: 'Static Equipment',
    oneLineScope: 'Pressure vessels and heat exchangers up to 8 m³',
    productSlugs: ['pressure-vessel-8m3'],
  }
  it('parses a valid minimal record', () => {
    expect(ProductCategory.safeParse(min).success).toBe(true)
  })
  it('rejects a bad slug format', () => {
    expect(ProductCategory.safeParse({ ...min, slug: 'Static Equipment' }).success).toBe(false)
  })
  it('rejects a record missing name', () => {
    const { name, ...rest } = min
    expect(ProductCategory.safeParse(rest).success).toBe(false)
  })
})

describe('Industry shape', () => {
  const min = {
    slug: 'refining',
    name: 'Refining',
    oneLineScope: 'Refinery vessels rated to 150 bar',
    requirements: 'Hydrotest per ASME Sec VIII.',
    applications: ['Crude distillation'],
    engineeringConsiderations: 'High-pressure sour service.',
    productSlugs: ['pressure-vessel-8m3', 'heat-exchanger-4m2'],
    capabilitySlugs: [],
    companySlugs: ['dhruv-epc' as const],
    faqs: minFaqs,
  }
  it('parses a valid minimal record', () => {
    expect(Industry.safeParse(min).success).toBe(true)
  })
  it('rejects a bad slug format', () => {
    expect(Industry.safeParse({ ...min, slug: 'Refining' }).success).toBe(false)
  })
  it('rejects a record missing requirements', () => {
    const { requirements, ...rest } = min
    expect(Industry.safeParse(rest).success).toBe(false)
  })
})

describe('Industry productSlugs gate', () => {
  const min = {
    slug: 'refining',
    name: 'Refining',
    oneLineScope: 'Refinery vessels rated to 150 bar',
    requirements: 'Hydrotest per ASME Sec VIII.',
    applications: ['Crude distillation'],
    engineeringConsiderations: 'High-pressure sour service.',
    capabilitySlugs: [],
    companySlugs: ['dhruv-epc' as const],
    faqs: minFaqs,
  }
  it('rejects an industry with fewer than two products (generic SEO page)', () => {
    const result = Industry.safeParse({ ...min, productSlugs: ['pressure-vessel-8m3'] })
    expect(result.success).toBe(false)
  })
  it('accepts an industry with two or more products', () => {
    const result = Industry.safeParse({ ...min, productSlugs: ['pressure-vessel-8m3', 'heat-exchanger-4m2'] })
    expect(result.success).toBe(true)
  })
})

describe('Capability shape', () => {
  const min = {
    slug: 'heavy-fabrication',
    name: 'Heavy Fabrication',
    companySlugs: ['dhruv-epc' as const],
    equipmentList: ['200 T EOT crane'],
    envelope: [{ param: 'Max weight', value: '200', unit: 'T' }],
    standards: ['ASME Sec VIII'],
    productSlugs: ['pressure-vessel-8m3'],
    faqs: minFaqs,
  }
  it('parses a valid minimal record', () => {
    expect(Capability.safeParse(min).success).toBe(true)
  })
  it('rejects a bad slug format', () => {
    expect(Capability.safeParse({ ...min, slug: 'Heavy Fabrication' }).success).toBe(false)
  })
  it('rejects a record missing equipmentList', () => {
    const { equipmentList, ...rest } = min
    expect(Capability.safeParse(rest).success).toBe(false)
  })
})

describe('Capability envelope gate', () => {
  const min = {
    slug: 'heavy-fabrication',
    name: 'Heavy Fabrication',
    companySlugs: ['dhruv-epc' as const],
    equipmentList: ['200 T EOT crane'],
    standards: ['ASME Sec VIII'],
    productSlugs: ['pressure-vessel-8m3'],
    faqs: minFaqs,
  }
  it('rejects a capability without an envelope spec table', () => {
    const result = Capability.safeParse({ ...min, envelope: [] })
    expect(result.success).toBe(false)
  })
  it('accepts a capability with at least one envelope row', () => {
    const result = Capability.safeParse({ ...min, envelope: [{ param: 'Max weight', value: '200', unit: 'T' }] })
    expect(result.success).toBe(true)
  })
})

describe('Resource shape', () => {
  const min = {
    slug: 'welding-procedure-spec',
    title: 'Welding Procedure Specification',
    type: 'datasheet',
    fileHref: '/resources/wps.pdf',
    gated: false,
    relatedSlugs: ['pressure-vessel-8m3'],
  }
  it('parses a valid minimal record', () => {
    expect(Resource.safeParse(min).success).toBe(true)
  })
  it('rejects a bad slug format', () => {
    expect(Resource.safeParse({ ...min, slug: 'Welding Procedure' }).success).toBe(false)
  })
  it('rejects a record missing fileHref', () => {
    const { fileHref, ...rest } = min
    expect(Resource.safeParse(rest).success).toBe(false)
  })
})

describe('Product junction fields (S2)', () => {
  it('accepts a product with categorySlug, industrySlugs, capabilitySlugs, standardsMatrix', () => {
    expect(Product.safeParse(minProduct).success).toBe(true)
  })
  it('rejects a product with zero industrySlugs', () => {
    const result = Product.safeParse({ ...minProduct, industrySlugs: [] })
    expect(result.success).toBe(false)
  })
})

describe('Project junction fields (S2)', () => {
  it('accepts a project with productSlugs, industrySlug, location, documents', () => {
    expect(Project.safeParse(minProject).success).toBe(true)
  })
  it('rejects a project with zero productSlugs', () => {
    const result = Project.safeParse({ ...minProject, productSlugs: [] })
    expect(result.success).toBe(false)
  })
  it('accepts optional narrative fields when present', () => {
    const result = Project.safeParse({
      ...minProject,
      scope: 'Full EPC scope.',
      challenge: 'Sour service metallurgy.',
      solution: 'Duplex stainless cladding.',
      testing: 'Hydrotest + radiography.',
      inspection: 'TPIA witnessed.',
      documents: [{ label: 'Datasheet', href: '/docs/x.pdf', gated: true }],
    })
    expect(result.success).toBe(true)
  })
})

describe('validateProjectClientPermission (cross-entity gate)', () => {
  const client: Client = {
    companySlugs: ['dhruv-epc'],
    name: 'BPCL',
    sector: 'Oil & Gas',
    permission: 'logo-approved',
  }
  it('passes when the referenced client is on file with an approved permission', () => {
    const project = { ...minProject, clientSlug: 'bpcl' }
    const result = validateProjectClientPermission(project, [{ slug: 'bpcl', ...client }])
    expect(result.success).toBe(true)
  })
  it('passes when clientSlug is not set — no client to check', () => {
    const result = validateProjectClientPermission(minProject, [])
    expect(result.success).toBe(true)
  })
  it('fails when clientSlug references a client not on file', () => {
    const project = { ...minProject, clientSlug: 'missing-client' }
    const result = validateProjectClientPermission(project, [{ slug: 'bpcl', ...client }])
    expect(result.success).toBe(false)
  })
  it('fails when the referenced client permission is not an approved value', () => {
    const project = { ...minProject, clientSlug: 'bpcl' }
    const unapproved = { slug: 'bpcl', ...client, permission: 'unapproved' as unknown as Client['permission'] }
    const result = validateProjectClientPermission(project, [unapproved])
    expect(result.success).toBe(false)
  })
})

describe('Approval — group-level extension (Clients & Projects §2)', () => {
  it('accepts an existing per-company record unchanged (entityClass + year, no logo/kind)', () => {
    const result = Approval.safeParse({
      companySlug: 'dhruv-epc',
      approvingOrg: "Lloyd's Register (LRS)",
      entityClass: 'TPIA',
      category: 'Third-party inspection',
      year: 2020,
    })
    expect(result.success).toBe(true)
  })
  it('accepts a group-level agency record with neither entityClass nor year', () => {
    const result = Approval.safeParse({
      companySlug: 'group',
      approvingOrg: "Lloyd's Register",
    })
    expect(result.success).toBe(true)
  })
  it('accepts logo and kind once the client classifies the agency', () => {
    const result = Approval.safeParse({
      companySlug: 'group',
      approvingOrg: 'SGS',
      logo: '/clients-review/approvals/a5.png',
      kind: 'tpi',
    })
    expect(result.success).toBe(true)
  })
})

describe('Sector (Clients & Projects §2)', () => {
  it('accepts a sector with slug, name, order', () => {
    const result = Sector.safeParse({ slug: 'city-gas-distribution', name: 'City Gas Distribution', order: 2 })
    expect(result.success).toBe(true)
  })
  it('rejects a sector with an uppercase or spaced slug', () => {
    const result = Sector.safeParse({ slug: 'City Gas', name: 'City Gas Distribution', order: 2 })
    expect(result.success).toBe(false)
  })
})

describe('ClientRecord — consent publish gate (Clients & Projects §2/§5)', () => {
  const base = { slug: 'ongc', name: 'ONGC', sectors: ['oil-gas-refinery'], featuredOnHome: true }
  it('accepts a granted client record', () => {
    expect(ClientRecord.safeParse({ ...base, consent: 'granted' }).success).toBe(true)
  })
  it('accepts a requested/none client record — the loader, not the schema, omits it from render', () => {
    expect(ClientRecord.safeParse({ ...base, consent: 'requested' }).success).toBe(true)
    expect(ClientRecord.safeParse({ ...base, consent: 'none' }).success).toBe(true)
  })
  it('rejects an unrecognized consent value', () => {
    const result = ClientRecord.safeParse({ ...base, consent: 'pending' })
    expect(result.success).toBe(false)
  })
})

describe('ProjectHighlight — brochure track record (Clients & Projects §2/§6)', () => {
  const base = {
    slug: 'precise-expansion-joint-chevron-usa',
    company: 'precise-engineers' as const,
    order: 1,
    statement: 'Expansion Joint Designed and manufactured for CHEVRON USA with Design Pressure of 3700 PSI.',
    tags: ['CHEVRON USA'],
  }
  it('accepts a record with an explicit figure', () => {
    const result = ProjectHighlight.safeParse({
      ...base,
      figures: [{ label: 'Design pressure', value: '3700', unit: 'PSI' }],
    })
    expect(result.success).toBe(true)
  })
  it('accepts a record with zero figures — not every job states a number', () => {
    const result = ProjectHighlight.safeParse({ ...base, figures: [] })
    expect(result.success).toBe(true)
  })
  it('rejects a company outside the two-company enum', () => {
    const result = ProjectHighlight.safeParse({ ...base, company: 'group', figures: [] })
    expect(result.success).toBe(false)
  })
})

