import { describe, it, expect } from 'vitest'
import { Product, Testimonial, CompanySlug } from './cms'

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
