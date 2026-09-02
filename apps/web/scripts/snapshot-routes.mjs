#!/usr/bin/env node
// Crawls .next/server/app output for every prerendered route's HTML, so a
// content/token change can be diffed against a prior snapshot (see
// compare-snapshots.mjs). Originally (VG-011) a hand-maintained ROUTES
// array — that went stale the moment VG-012 (Session 5, dynamic product
// routing) restructured URLs, and stayed stale for several sessions (see
// docs/mistakes.md, 2026-09-02). Auto-discovers .html files under
// .next/server/app instead, so it can never drift from the real build
// output again — no second route list to keep in sync.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Optional first CLI arg overrides the output dir — used to write a
// baseline to a separate, deliberately-not-auto-updated directory (see
// compare-snapshots.mjs).
const OUT_DIR = resolve(root, process.argv[2] ?? '__snapshots__/routes')
const APP_BUILD_DIR = resolve(root, '.next/server/app')

if (!existsSync(APP_BUILD_DIR)) {
  console.error(`${APP_BUILD_DIR} does not exist — run "next build" first`)
  process.exit(1)
}

function findHtmlFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...findHtmlFiles(full))
    } else if (entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

// _not-found is a Next-generated route, not app content — excluded, same
// as the hand-maintained ROUTES array never included it either.
const htmlFiles = findHtmlFiles(APP_BUILD_DIR).filter((f) => relative(APP_BUILD_DIR, f) !== '_not-found.html')

function slugify(relPath) {
  const noExt = relPath.replace(/\.html$/, '')
  return noExt === 'index' ? 'home' : noExt.replace(/\//g, '__')
}

mkdirSync(OUT_DIR, { recursive: true })
for (const src of htmlFiles) {
  const rel = relative(APP_BUILD_DIR, src)
  const html = readFileSync(src, 'utf8')
  writeFileSync(resolve(OUT_DIR, `${slugify(rel)}.html`), html)
}
console.log(`Snapshotted ${htmlFiles.length} routes to ${OUT_DIR}`)
