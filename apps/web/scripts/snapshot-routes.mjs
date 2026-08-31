#!/usr/bin/env node
// Crawls .next/server/app output for the routes this session's content
// migration (VG-011) must not change. Run BEFORE migrating (baseline) and
// AFTER (compare) — see compare-snapshots.mjs.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Optional first CLI arg overrides the output dir — used to write the
// pre-migration baseline to a separate, never-touched-again directory
// (see compare-snapshots.mjs).
const OUT_DIR = resolve(root, process.argv[2] ?? '__snapshots__/routes')

const ROUTES = [
  '/', '/about', '/contact', '/privacy', '/terms',
  '/dhruv-epc', '/dhruv-epc/company', '/dhruv-epc/proof', '/dhruv-epc/capabilities',
  '/dhruv-epc/equipment/heat-exchangers', '/dhruv-epc/equipment/pressure-vessels',
  '/dhruv-epc/equipment/storage-tanks', '/dhruv-epc/equipment/process-skids',
  '/dhruv-epc/equipment/pipe-spools', '/dhruv-epc/equipment/heavy-fabrication',
  '/dhruv-epc/equipment/heavy-machining', '/dhruv-epc/equipment/plate-flanges',
  '/precise-engineers', '/precise-engineers/company', '/precise-engineers/proof',
  '/precise-engineers/capabilities',
  '/precise-engineers/products/metallic-bellows-expansion-joint',
  '/precise-engineers/products/telescopic-expansion-joint',
  '/precise-engineers/products/rubber-bellows',
  '/precise-engineers/products/fabric-bellows',
  '/precise-engineers/products/dismantling-joint',
  '/precise-engineers/products/flange-adaptor',
  '/precise-engineers/products/zero-velocity-valve',
  '/precise-engineers/products/dual-plate-check-valve',
  '/precise-engineers/products/damper',
]

function routeToHtmlPath(route) {
  const seg = route === '/' ? 'index' : route.slice(1)
  return resolve(root, '.next/server/app', `${seg}.html`)
}

function slugify(route) {
  return route === '/' ? 'home' : route.slice(1).replace(/\//g, '__')
}

mkdirSync(OUT_DIR, { recursive: true })
let missing = 0
for (const route of ROUTES) {
  const src = routeToHtmlPath(route)
  if (!existsSync(src)) {
    console.error(`MISSING built HTML for ${route} (expected ${src})`)
    missing++
    continue
  }
  const html = readFileSync(src, 'utf8')
  writeFileSync(resolve(OUT_DIR, `${slugify(route)}.html`), html)
}
if (missing > 0) {
  console.error(`${missing}/${ROUTES.length} routes missing — run "next build" first`)
  process.exit(1)
}
console.log(`Snapshotted ${ROUTES.length} routes to ${OUT_DIR}`)
