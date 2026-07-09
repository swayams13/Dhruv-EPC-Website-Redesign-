import type { MetadataRoute } from 'next'

// FR-8: explicitly allow all AI crawlers — the 409 dies here (TRD §T-4)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      // Explicit allow for AI answer-engine crawlers
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: 'https://vedantagroup.net/sitemap.xml',
  }
}
