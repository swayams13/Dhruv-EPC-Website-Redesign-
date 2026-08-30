#!/usr/bin/env node
// CI gate: content/redirect-map.csv row-format integrity.
//
// Moved out of .github/workflows/ci.yml's "Redirect map integrity" step,
// which embedded this as a multi-line `run: node -e "..."` shell string.
// That construct is not valid YAML — a plain scalar (`node -e "`) followed
// by a bare `"` on its own dedented line — and both PyYAML and GitHub
// Actions' own parser reject the whole workflow file on it (confirmed
// 2026-08-30; docs/mistakes.md's 2026-08-27 entry had this as untested).
// The result: CI failed to even start on every push since 2026-07-17,
// silently — no lint/typecheck/test/build gate ran on any PR in that
// window. See docs/mistakes.md for the incident.
//
// Run: node scripts/check-redirect-map-integrity.mjs

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CSV = resolve(root, 'content/redirect-map.csv')

export function checkIntegrity(csv) {
  const rows = csv
    .trim()
    .split('\n')
    .filter((r) => r.trim() && !r.startsWith('#') && !r.startsWith('legacy_path'))
  const invalid = rows.filter((r) => !r.match(/^\/[^,]*,\/[^,]*,(301|302)$/))
  return { rows, invalid }
}

function main() {
  const { rows, invalid } = checkIntegrity(readFileSync(CSV, 'utf8'))
  if (invalid.length) {
    console.error('Invalid rows:', invalid)
    process.exit(1)
  }
  console.log(`${rows.length} redirect rules validated`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
