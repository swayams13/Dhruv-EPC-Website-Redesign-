import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
// ponytail: parse at config time (Node.js context); Edge runtime never sees the file
const _csv = readFileSync(resolve(__dirname, '../../content/redirect-map.csv'), 'utf8')
const _redirectEntries = _csv
  .split('\n')
  .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('legacy_path'))
  .map(l => {
    const parts = l.split(',')
    return { source: parts[0].trim(), destination: parts[1].trim(), permanent: true }
  })
  .filter(r => r.source !== r.destination)

/** @type {import('next').NextConfig} */
const config = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440],
    remotePatterns: [],
  },

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
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },

  async redirects() {
    return _redirectEntries
  },
}

export default config
