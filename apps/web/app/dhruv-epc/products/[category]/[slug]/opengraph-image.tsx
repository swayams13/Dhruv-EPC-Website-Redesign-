// Dhruv EPC product OG image — VG-012 R7. Template in lib/product-og-image.tsx
// (shared with precise-engineers).
import { productOgImage } from '../../../../../lib/product-og-image'

// Node.js runtime, not edge (the old per-product files' choice) — this
// shared version reads product data via content-loader.ts (node:fs), which
// the edge bundler rejects. All params are prerendered at build time via
// generateStaticParams, so the runtime only affects bundling, not latency.
const impl = productOgImage('dhruv-epc')

export const generateStaticParams = impl.generateStaticParams
export const alt = impl.alt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default impl.Image
