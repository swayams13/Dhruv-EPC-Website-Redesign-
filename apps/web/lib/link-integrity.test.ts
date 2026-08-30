// General case of the B4 fix (docs/mistakes.md): B4 was two hand-found dead
// Precise nav/footer links. Nothing asserted that every href in the app
// actually resolves to a route, a legacy redirect, or a JSON-LD-visible URL —
// so nothing would catch the next one. This test is that assertion.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEGACY_REDIRECTS } from './redirects.generated'
import sitemap from '../app/sitemap'
import { ROUTES, normalize, pageFiles, walk } from './routes'

const WEB_DIR = resolve(__dirname, '..')

const REDIRECT_SOURCES = new Set(Object.keys(LEGACY_REDIRECTS))

// ── Step 2: scan every .tsx/.ts source file for internal hrefs ───────────
// Matches `href="/x"`, `href='/x'`, `href={'/x'}`, and any `fooHref` prop
// assigned the same way (certificationsHref, privacyHref, whatsappHref-style
// props). Dynamic hrefs (template literals with interpolation, function
// calls, mailto:/tel:/external URLs, in-page `#anchor` only) are not string
// literals starting with '/' and are intentionally not matched — the schema,
// mailto/tel builders, and external links are outside link-integrity's scope.
const HREF_RE = /\b\w*[Hh]ref\s*[:=]\s*\{?\s*(['"`])(\/(?!\/)[^'"`]*)\1/g

const sourceFiles = walk(WEB_DIR, (name) => /\.(ts|tsx)$/.test(name) && !name.endsWith('.test.ts') && !name.endsWith('.test.tsx'))

function findHrefs(file: string): string[] {
  const src = readFileSync(file, 'utf8')
  const hrefs: string[] = []
  for (const match of src.matchAll(HREF_RE)) {
    hrefs.push(match[2] as string)
  }
  return hrefs
}

const hrefsByFile = new Map<string, string[]>()
for (const file of sourceFiles) {
  const hrefs = findHrefs(file)
  if (hrefs.length > 0) hrefsByFile.set(relative(WEB_DIR, file), hrefs)
}

describe('link integrity — route enumeration', () => {
  it('found at least one real page route', () => {
    expect(ROUTES.size).toBeGreaterThan(0)
  })
})

describe('link integrity — internal hrefs resolve', () => {
  const broken: string[] = []
  for (const [file, hrefs] of hrefsByFile) {
    for (const href of hrefs) {
      const canonical = normalize(href)
      const resolves = ROUTES.has(canonical) || REDIRECT_SOURCES.has(href) || REDIRECT_SOURCES.has(canonical)
      if (!resolves) broken.push(`${file}: ${href}`)
    }
  }

  it('every internal href matches a real route or a known redirect source', () => {
    expect(broken).toEqual([])
  })
})

describe('link integrity — sitemap.ts URLs resolve', () => {
  const entries = sitemap()
  const broken = entries.map((e) => e.url).filter((url) => !ROUTES.has(normalize(url)))

  it('every sitemap URL matches a real route', () => {
    expect(broken).toEqual([])
  })
})

describe('link integrity — redirect-map.csv destinations resolve', () => {
  const broken = Object.entries(LEGACY_REDIRECTS)
    .filter(([, v]) => !ROUTES.has(normalize(v.to)))
    .map(([from, v]) => `${from} -> ${v.to}`)

  it('every redirect destination matches a real route', () => {
    expect(broken).toEqual([])
  })
})

describe('link integrity — JSON-LD BreadcrumbList URLs resolve', () => {
  // jsonld.ts's builders are pure functions fed data from pages at build/render
  // time; the URLs themselves are authored as string literals in each page.
  // Statically extract them from source rather than executing the RSC pages
  // (which would require a Next.js server-component runtime).
  const BREADCRUMB_CALL_RE = /buildBreadcrumbList\(\[([\s\S]*?)\]\)/g
  const URL_FIELD_RE = /url:\s*(['"`])((?:(?!\1).)*)\1/g

  const broken: string[] = []
  for (const file of pageFiles) {
    const src = readFileSync(file, 'utf8')
    for (const call of src.matchAll(BREADCRUMB_CALL_RE)) {
      const body = call[1] as string
      for (const urlMatch of body.matchAll(URL_FIELD_RE)) {
        const raw = (urlMatch[2] as string).replace('${BASE}', '')
        const canonical = normalize(raw)
        if (!ROUTES.has(canonical)) broken.push(`${relative(WEB_DIR, file)}: ${raw}`)
      }
    }
  }

  it('every BreadcrumbList JSON-LD url matches a real route in canonical form', () => {
    expect(broken).toEqual([])
  })
})
