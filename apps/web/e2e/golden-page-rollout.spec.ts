import { expect, test } from '@playwright/test'
import { getProductsByCompany } from '../lib/content-loader'
import { productHref } from '../lib/product-urls'
import type { CompanySlug } from '@vedanta/schemas'

// Session 7 (T2): the golden-page layout (SpecRail sidebar + Inspection
// Record section) is now the default render for every product, both
// companies — this is the regression gate for that generalization. A
// product missing its rail/provenance content (Tasks 3-19) fails here
// instead of silently rendering an empty sidebar.
const COMPANIES: CompanySlug[] = ['dhruv-epc', 'precise-engineers']

const PRODUCTS = COMPANIES.flatMap((companySlug) =>
  getProductsByCompany(companySlug).map((product) => ({
    company: companySlug,
    slug: product.slug,
    href: productHref(companySlug, product.categorySlug, product.slug),
  })),
)

test('found all 17 products across both companies', () => {
  expect(PRODUCTS.length).toBe(17)
})

for (const { company, slug, href } of PRODUCTS) {
  test(`${company}/${slug}: golden-page rail and inspection record render with data`, async ({ page }) => {
    await page.goto(href)
    await page.waitForLoadState('networkidle')

    // SpecRail — desktop sidebar heading. The identical heading also renders
    // in the mobile SpecRail block (lg:hidden, earlier in DOM order), so at
    // this test's default desktop viewport we must filter to the visible
    // instance rather than take .first() by DOM order.
    await expect(page.locator('p:visible', { hasText: 'Key figures' })).toBeVisible()

    // At least one rail row actually has a value — not an empty <dl>. Same
    // mobile/desktop duplication as above: scope to the visible copy.
    const railValues = page.locator('dd.font-mono:visible')
    await expect(railValues.first()).toBeVisible()
    const firstValueText = await railValues.first().textContent()
    expect(firstValueText?.trim().length).toBeGreaterThan(0)

    // Inspection Record section is present (golden layout, every product).
    await expect(page.getByRole('heading', { name: 'Inspection record' })).toBeVisible()
  })
}
