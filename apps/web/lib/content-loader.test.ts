import { describe, expect, it, afterEach } from 'vitest'
import { writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  getEntity,
  getProduct,
  getProductBySlug,
  getProductsByCompany,
  getCertifications,
  getApprovals,
  getProductCategory,
  getIndustries,
  getIndustry,
  getCapabilities,
  getCapability,
  phoneHref,
  whatsappHref,
} from './content-loader'

describe('content-loader', () => {
  it('parses every EntityRecord in content/companies and exposes it via getEntity', () => {
    const dhruv = getEntity('dhruv-epc')
    expect(dhruv.companySlug).toBe('dhruv-epc')
    expect(dhruv.legalName).toBe('Dhruv EPC Solutions Pvt. Ltd.')
  })

  it('parses every Product and exposes it via getProduct', () => {
    const product = getProduct('dhruv-epc', 'heat-exchangers')
    expect(product.slug).toBe('heat-exchangers')
    expect(product.oneLineScope).toMatch(/\d/)
  })

  it("getProductsByCompany returns only that company's products", () => {
    const products = getProductsByCompany('precise-engineers')
    expect(products.length).toBe(9)
    expect(products.every((p) => p.companySlug === 'precise-engineers')).toBe(true)
    expect(getProductsByCompany('dhruv-epc').length).toBe(8)
  })

  it('getCertifications / getApprovals filter by company and total the known counts', () => {
    expect(getCertifications('dhruv-epc').length).toBe(4)
    expect(getCertifications('precise-engineers').length).toBe(2)
    expect(getApprovals('dhruv-epc').length).toBe(3)
    expect(getApprovals('precise-engineers').length).toBe(1)
  })

  it('getProductCategory resolves a category by slug', () => {
    const cat = getProductCategory('static-equipment')
    expect(cat.companySlug).toBe('dhruv-epc')
  })

  it('every product\'s categorySlug resolves to a real ProductCategory', () => {
    const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
    for (const p of allProducts) {
      expect(() => getProductCategory(p.categorySlug)).not.toThrow()
    }
  })

  it('every product keeps at least one industrySlug (schema min 1)', () => {
    const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
    expect(allProducts.every((p) => p.industrySlugs.length >= 1)).toBe(true)
  })

  it('capabilitySlugs/standardsMatrix stay empty — no capability content exists yet', () => {
    const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
    expect(allProducts.every((p) => p.capabilitySlugs.length === 0)).toBe(true)
    expect(allProducts.every((p) => p.standardsMatrix.length === 0)).toBe(true)
  })

  it('getProductBySlug resolves across both companies', () => {
    expect(getProductBySlug('heat-exchangers')?.companySlug).toBe('dhruv-epc')
    expect(getProductBySlug('rubber-bellows')?.companySlug).toBe('precise-engineers')
    expect(getProductBySlug('does-not-exist')).toBeUndefined()
  })

  // Session 8 (VG-020/021): every Industry/Capability record this session
  // ships is a content-gated placeholder — contentComplete defaults false,
  // and every record must still clear its schema ship gate (Industry
  // productSlugs.min(2), Capability envelope.min(1)) even as a placeholder.
  it('parses every Industry record and keeps the ≥2-product ship gate', () => {
    const industries = getIndustries()
    expect(industries.length).toBeGreaterThan(0)
    expect(industries.every((i) => i.productSlugs.length >= 2)).toBe(true)
    expect(industries.every((i) => i.contentComplete === false)).toBe(true)
    expect(getIndustry('oil-gas')?.name).toBe('Oil & Gas')
    expect(getIndustry('does-not-exist')).toBeUndefined()
  })

  it("every Industry's productSlugs resolve to a real Product", () => {
    for (const industry of getIndustries()) {
      for (const slug of industry.productSlugs) {
        expect(getProductBySlug(slug), `${industry.slug} -> ${slug}`).toBeDefined()
      }
    }
  })

  it('parses every Capability record and keeps the envelope ship gate', () => {
    const capabilities = getCapabilities()
    expect(capabilities.length).toBeGreaterThan(0)
    expect(capabilities.every((c) => c.envelope.length >= 1)).toBe(true)
    expect(capabilities.every((c) => c.contentComplete === false)).toBe(true)
    expect(getCapability('heavy-fabrication')?.name).toBe('Heavy Fabrication')
    expect(getCapability('does-not-exist')).toBeUndefined()
  })

  it('phoneHref/whatsappHref derive tel:/wa.me hrefs from an EntityRecord', () => {
    const dhruv = getEntity('dhruv-epc')
    expect(phoneHref(dhruv)).toBe(`tel:${dhruv.phones[0]}`)
    expect(whatsappHref(dhruv)).toMatch(/^https:\/\/wa\.me\/\d+$/)
  })

  describe('invalid content fails the build', () => {
    const badPath = resolve(__dirname, '../../../content/products/__invalid-test-fixture.json')

    afterEach(() => {
      rmSync(badPath, { force: true })
    })

    it('throws when a Product record fails schema validation', async () => {
      writeFileSync(
        badPath,
        JSON.stringify({
          companySlug: 'dhruv-epc',
          slug: 'invalid-test-fixture',
          name: 'Bad',
          oneLineScope: 'no digits here',
          group: 'static-equipment',
          specTable: [{ param: 'x', value: 'y' }],
          types: [],
          materials: [],
          codes: [],
          faqs: [],
          gallery: [],
          relatedProjectSlugs: [],
          categorySlug: 'static-equipment',
          industrySlugs: ['general'],
          capabilitySlugs: [],
          standardsMatrix: [],
        }),
      )
      // Force a fresh module evaluation so the loader re-reads the directory
      // including the new bad fixture — content-loader reads its directory
      // once at module load, so re-importing with a cache-busting query is
      // the only way to re-trigger that load in the same test process.
      await expect(import(/* @vite-ignore */ `./content-loader?bust=${Date.now()}`)).rejects.toThrow(
        /failed schema validation/,
      )
    })

    // Session 8 (VG-020): integration-level check of the ≥2-product ship
    // gate cms.test.ts already unit-tests on the schema directly — this
    // confirms the loader enforces it too, at the content-directory level.
    const badIndustryPath = resolve(__dirname, '../../../content/industries/__invalid-test-fixture.json')

    afterEach(() => {
      rmSync(badIndustryPath, { force: true })
    })

    it('throws when an Industry record has fewer than two products', async () => {
      writeFileSync(
        badIndustryPath,
        JSON.stringify({
          slug: 'invalid-test-fixture',
          name: 'Bad Industry',
          oneLineScope: 'Serves 1 product',
          requirements: 'x',
          applications: [],
          engineeringConsiderations: 'x',
          productSlugs: ['heat-exchangers'],
          capabilitySlugs: [],
          companySlugs: ['dhruv-epc'],
          faqs: [
            { question: 'q1', answer: 'a1' },
            { question: 'q2', answer: 'a2' },
            { question: 'q3', answer: 'a3' },
            { question: 'q4', answer: 'a4' },
          ],
        }),
      )
      await expect(import(/* @vite-ignore */ `./content-loader?bust=${Date.now()}`)).rejects.toThrow(
        /failed schema validation/,
      )
    })
  })
})
