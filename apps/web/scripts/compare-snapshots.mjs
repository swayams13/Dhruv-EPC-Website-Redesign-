#!/usr/bin/env node
// Compares the CURRENT .next build output (freshly snapshotted into
// __snapshots__/routes/) against the baseline checked into
// __snapshots__/routes-baseline/ (written by snapshot-routes.mjs, updated
// whenever a phase intentionally changes rendered output — see
// FINAL_IMPLEMENTATION_PLAN.md's per-phase "Snapshot: regenerate and
// commit" instruction). Re-anchored 2026-09-02 (Phase 24) to the
// post-retheme route set — the original VG-011 baseline was permanently
// pre-VG-012 URL structure and could never again produce a real diff
// after routes were restructured (docs/mistakes.md).
//
// Tolerance (documented per VG-011 C1):
//   1. Whitespace between tags is collapsed.
//   2. Next's own hydration-id attributes are stripped.
//   3. External build-hashed asset references are stripped entirely —
//      <script src="/_next/static/…">, <link rel="preload|stylesheet"
//      href="/_next/static/…"> — because webpack's chunk graph (filenames,
//      hashes, AND chunk count) legitimately differs between any two
//      `next build` runs, independent of rendered content. Confirmed by
//      running two builds of the pre-migration code and seeing the same
//      false-positive diff before this session touched anything.
//   4. The inline `self.__next_f.push(...)` RSC flight-data script is
//      stripped — it embeds the same webpack chunk-id manifest as #3, just
//      serialized as JS instead of an href. `<script type="application/
//      ld+json">` (real structured-data content) is NOT stripped.
// Anything else — text, attribute values, element order, class names — is a
// failure.
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
    .replace(/<link rel="preload"[^>]*href="\/_next\/static\/[^"]*"[^>]*\/>/g, '')
    .replace(/<link rel="stylesheet"[^>]*href="\/_next\/static\/[^"]*"[^>]*\/>/g, '')
    .replace(/<script src="\/_next\/static\/[^"]*"[^>]*><\/script>/g, '')
    .replace(/<script>self\.__next_f\.push\([\s\S]*?\)<\/script>/g, '')
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
