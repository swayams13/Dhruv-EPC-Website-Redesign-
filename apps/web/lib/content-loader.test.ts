import { describe, expect, it, afterEach } from 'vitest'
import { writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  getEntity,
  getProduct,
  getProductsByCompany,
  getCertifications,
  getApprovals,
  getProductCategory,
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
  })
})
