import type { MetadataRoute } from 'next'

// ponytail: flat sitemap — 29 URLs. generateSitemaps() moves routes to /sitemap/[id].xml
// and doesn't auto-generate /sitemap.xml index in Next.js 14.2; adds complexity for zero
// SEO gain at this scale. Per-company split deferred to Phase 5 (CMS-driven, next-sitemap).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vedantagroup.net'
  const now = new Date()
  const w = (path: string, priority = 0.8) =>
    ({ url: `${base}${path}`, lastModified: now, changeFrequency: 'weekly' as const, priority })
  const m = (path: string, priority = 0.7) =>
    ({ url: `${base}${path}`, lastModified: now, changeFrequency: 'monthly' as const, priority })

  return [
    // Group
    m('/', 1),
    m('/about/'),
    m('/contact/'),
    m('/request-a-quote/', 0.8),
    // Dhruv EPC
    w('/dhruv-epc/', 0.9),
    w('/dhruv-epc/equipment/heat-exchangers/'),
    w('/dhruv-epc/equipment/pressure-vessels/'),
    w('/dhruv-epc/equipment/storage-tanks/'),
    w('/dhruv-epc/equipment/process-skids/'),
    w('/dhruv-epc/equipment/pipe-spools/'),
    w('/dhruv-epc/equipment/heavy-fabrication/'),
    w('/dhruv-epc/equipment/heavy-machining/'),
    w('/dhruv-epc/equipment/plate-flanges/'),
    w('/dhruv-epc/capabilities/'),
    m('/dhruv-epc/proof/'),
    m('/dhruv-epc/company/'),
    // Precise Engineers
    w('/precise-engineers/', 0.9),
    w('/precise-engineers/products/metallic-bellows-expansion-joint/'),
    w('/precise-engineers/products/telescopic-expansion-joint/'),
    w('/precise-engineers/products/rubber-bellows/'),
    w('/precise-engineers/products/fabric-bellows/'),
    w('/precise-engineers/products/dismantling-joint/'),
    w('/precise-engineers/products/flange-adaptor/'),
    w('/precise-engineers/products/zero-velocity-valve/'),
    w('/precise-engineers/products/dual-plate-check-valve/'),
    w('/precise-engineers/products/damper/'),
    w('/precise-engineers/capabilities/'),
    m('/precise-engineers/proof/'),
    m('/precise-engineers/company/'),
  ]
}
