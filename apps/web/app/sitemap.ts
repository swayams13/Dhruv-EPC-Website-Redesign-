import type { MetadataRoute } from 'next'
import { getEntity, getProductCategoriesByCompany, getProductsByCompany } from '../lib/content-loader'
import { BASE } from '../lib/site'
import type { CompanySlug } from '@vedanta/schemas'

// VG-013: generated from the content source instead of a hardcoded array —
// the array broke the moment routing went dynamic (VG-012). lastModified
// uses each EntityRecord's contentRevisedDate where a page is entity-scoped;
// Product/ProductCategory carry no revision date of their own yet, so those
// fall back to `now` rather than inventing one.
//
// ponytail: flat sitemap, no generateSitemaps() split — Next.js 14.2's
// generateSitemaps() emits /sitemap/[id].xml with no auto-generated index at
// /sitemap.xml, breaking robots.ts's reference (Session 13 finding, unchanged
// by this session). Per-company split deferred to Phase 5 (next-sitemap).
const COMPANIES: CompanySlug[] = ['dhruv-epc', 'precise-engineers']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const w = (url: string, lastModified: Date, priority = 0.8) =>
    ({ url: `${BASE}${url}`, lastModified, changeFrequency: 'weekly' as const, priority })
  const m = (url: string, lastModified: Date, priority = 0.7) =>
    ({ url: `${BASE}${url}`, lastModified, changeFrequency: 'monthly' as const, priority })

  const entries: MetadataRoute.Sitemap = [
    // Group — hand-written pages with no content-loader record
    m('/', now, 1),
    m('/about/', now),
    m('/contact/', now),
    m('/request-a-quote/', now, 0.8),
    // /privacy/, /terms/, /request-a-quote/thank-you/ excluded — noindex
  ]

  for (const companySlug of COMPANIES) {
    const entity = getEntity(companySlug)
    const revised = new Date(entity.contentRevisedDate)
    const base = `/${companySlug}`

    entries.push(w(`${base}/`, revised, 0.9))
    entries.push(w(`${base}/products/`, revised, 0.85))
    entries.push(w(`${base}/capabilities/`, revised))
    entries.push(m(`${base}/proof/`, revised))
    entries.push(m(`${base}/company/`, revised))

    for (const category of getProductCategoriesByCompany(companySlug)) {
      entries.push(w(`${base}/products/${category.slug}/`, revised))
    }

    for (const product of getProductsByCompany(companySlug)) {
      // Products carry no contentRevisedDate of their own yet — `now` is
      // honest rather than borrowing the company's, which would claim a
      // revision that didn't happen.
      entries.push(w(`${base}/products/${product.categorySlug}/${product.slug}/`, now))
    }
  }

  return entries
}
