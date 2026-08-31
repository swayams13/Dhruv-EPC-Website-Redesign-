import { describe, it, expect } from 'vitest'
import {
  Product,
  Testimonial,
  CompanySlug,
  Project,
  ProductCategory,
  Industry,
  Capability,
  Resource,
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

