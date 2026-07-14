#!/usr/bin/env node
// CI gate: every legacy_path in redirect-map.csv must return 301 → correct Location
import { readFileSync } from 'fs'
import http from 'http'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.TEST_URL || 'http://localhost:3000'

const csv = readFileSync(resolve(__dirname, '../content/redirect-map.csv'), 'utf8')
const rows = csv
  .split('\n')
  .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('legacy_path'))
  .map(l => { const p = l.split(','); return { src: p[0].trim(), dst: p[1].trim() } })
  .filter(r => r.src !== r.dst)

let failures = 0

async function check({ src, dst }) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE}${src}`, { headers: { host: 'localhost' } }, (res) => {
      const location = (res.headers.location || '').replace(/^https?:\/\/[^/]+/, '')
      if (res.statusCode !== 301 || location !== dst) {
        console.error(`FAIL  ${src}`)
        console.error(`      got  ${res.statusCode} ${res.headers.location || '(none)'}`)
        console.error(`      want 301 ${dst}`)
        failures++
      } else {
        console.log(`OK    ${src} → ${dst}`)
      }
      res.resume()
      resolve()
    })
    req.on('error', (e) => {
      console.error(`ERROR ${src}: ${e.message}`)
      failures++
      resolve()
    })
  })
}

for (const row of rows) {
  await check(row)
}

if (failures) {
  console.error(`\n${failures}/${rows.length} redirect(s) failed`)
  process.exit(1)
}
console.log(`\nAll ${rows.length} redirects verified ✓`)
