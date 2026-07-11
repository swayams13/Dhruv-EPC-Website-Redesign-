import type { MetadataRoute } from 'next'

// ponytail: static sitemap stub — Phase 4 generates per-company dynamic sitemaps
// from CMS using next-sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vedantagroup.net'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/dhruv-epc/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/dhruv-epc/equipment/pressure-vessels/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/heat-exchangers/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/storage-tanks/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/process-skids/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/pipe-spools/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/heavy-fabrication/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/heavy-machining/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dhruv-epc/equipment/plate-flanges/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/precise-engineers/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/precise-engineers/products/metallic-bellows-expansion-joint/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/request-a-quote/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
