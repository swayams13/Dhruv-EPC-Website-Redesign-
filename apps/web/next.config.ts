import type { NextConfig } from 'next'

const config: NextConfig = {
  // TypeScript + ESLint errors fail the build in CI
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Images: AVIF first per P-4 performance requirements
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440],
    // CMS image domains added here when CMS is configured
    remotePatterns: [],
  },

  // Security headers (P-4)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },

  // Redirect map loaded from content/redirect-map.csv (edge middleware handles runtime;
  // this Next.js redirects config handles static routes during build)
  async redirects() {
    return []  // ponytail: populated Phase 1 once redirect-map.csv is finalized
  },
}

export default config
