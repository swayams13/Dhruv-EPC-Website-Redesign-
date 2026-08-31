#!/usr/bin/env node
// Compares the CURRENT .next build output (freshly snapshotted into
// __snapshots__/routes/) against the pre-migration baseline checked into
// __snapshots__/routes-baseline/ (written once by snapshot-routes.mjs before
// any content migration and never touched again).
//
// Tolerance (documented per VG-011 C1): collapse whitespace between tags and
// strip Next's own hydration-id attributes. Any other difference — text,
// attribute values, element order, class names — is a failure.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE_DIR = resolve(root, '__snapshots__/routes-baseline')
const CURRENT_DIR = resolve(root, '__snapshots__/routes')

if (!existsSync(BASELINE_DIR)) {
  console.error(`No baseline at ${BASELINE_DIR} — run "node scripts/snapshot-routes.mjs __snapshots__/routes-baseline" against a pre-migration build first`)
  process.exit(1)
}

execFileSync(process.execPath, [resolve(root, 'scripts/snapshot-routes.mjs')], { stdio: 'inherit' })

function normalize(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\sdata-[a-z-]*hydrat[a-z-]*="[^"]*"/gi, '')
    .trim()
}

const baselineFiles = readdirSync(BASELINE_DIR).filter((f) => f.endsWith('.html'))
let failures = 0

for (const file of baselineFiles) {
  const currentPath = resolve(CURRENT_DIR, file)
  if (!existsSync(currentPath)) {
    console.error(`MISSING in current build: ${file}`)
    failures++
    continue
  }
  const pre = normalize(readFileSync(resolve(BASELINE_DIR, file), 'utf8'))
  const post = normalize(readFileSync(currentPath, 'utf8'))
  if (pre !== post) {
    console.error(`DIFF: ${file}`)
    failures++
  }
}

if (failures > 0) {
  console.error(`${failures}/${baselineFiles.length} route(s) changed beyond tolerance`)
  process.exit(1)
}
console.log(`All ${baselineFiles.length} routes byte-identical (within documented tolerance)`)
