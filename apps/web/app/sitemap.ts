import type { MetadataRoute } from 'next'

// ponytail: static sitemap stub — Phase 4 generates per-company dynamic sitemaps
// from CMS using next-sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vedantagroup.net'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/dhruv-epc/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/precise-engineers/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/request-a-quote/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
