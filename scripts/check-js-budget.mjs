#!/usr/bin/env node
// CI gate: JS (gz) budget per CLAUDE.md — Marketing (SSG) ≤ 120 KB, RFQ form ≤ 180 KB.
//
// Reuses `next build`'s own "First Load JS" column rather than reimplementing
// bundle-size math (webpack chunk graph, gzip, per-route dedup) — next build
// already computes it correctly per route. LCP/CLS/INP are NOT checked here:
// there's no real hero photography yet (C-6 open), so any LCP assertion
// against the current placeholder imagery would be unrepresentative rather
// than a real budget. Activate an LCP/CLS/INP check (Lighthouse CI or
// web-vitals in the Playwright suite) once real photography lands.
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WEB_DIR = resolve(__dirname, '../apps/web')

const MARKETING_BUDGET_KB = 120
const RFQ_BUDGET_KB = 180

function toKb(size) {
  const m = size.match(/^([\d.]+)\s*(B|kB|MB)$/)
  if (!m) throw new Error(`Unrecognized size format: ${size}`)
  const [, num, unit] = m
  const n = Number(num)
  if (unit === 'B') return n / 1000
  if (unit === 'kB') return n
  return n * 1000
}

function isRfqRoute(route) {
  return route.startsWith('/request-a-quote')
}

// Skip non-page rows: API routes, generated files (robots/sitemap/opengraph-image),
// and Next's internal /_not-found — none carry a page JS budget.
function isBudgetedRoute(route) {
  return (
    !route.startsWith('/api/') &&
    !route.endsWith('/opengraph-image') &&
    route !== '/robots.txt' &&
    route !== '/sitemap.xml' &&
    route !== '/_not-found'
  )
}

console.log('Running next build to read First Load JS per route...\n')
const output = execFileSync('npx', ['next', 'build'], { cwd: WEB_DIR, encoding: 'utf8' })
console.log(output)

// Route table rows look like:
// ├ ○ /dhruv-epc/capabilities                                                       225 B           103 kB
const ROW_RE = /^[├└]\s*[○ƒλ]\s+(\S+)\s+([\d.]+\s*(?:B|kB|MB))\s+([\d.]+\s*(?:B|kB|MB))\s*$/gm

const violations = []
let checked = 0

for (const match of output.matchAll(ROW_RE)) {
  const [, route, , firstLoadJs] = match
  if (!isBudgetedRoute(route)) continue
  checked++
  const kb = toKb(firstLoadJs)
  const budget = isRfqRoute(route) ? RFQ_BUDGET_KB : MARKETING_BUDGET_KB
  if (kb > budget) {
    violations.push(`${route}: ${kb.toFixed(1)} kB gz > ${budget} kB budget`)
  }
}

if (checked === 0) {
  console.error('Parsed zero routes from next build output — table format may have changed.')
  process.exit(1)
}

if (violations.length > 0) {
  console.error(`\n${violations.length} route(s) over JS budget:`)
  for (const v of violations) console.error(`  FAIL  ${v}`)
  process.exit(1)
}

console.log(`\nAll ${checked} routes within JS budget ✓`)
