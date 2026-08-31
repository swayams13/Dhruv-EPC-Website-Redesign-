// Single source of truth for "what are the real routes" — shared by
// link-integrity.test.ts (vitest) and e2e/a11y.spec.ts (Playwright), so a
// route added to one and not the other can't happen by construction.

import { readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { BASE } from './site'
import { getProductCategoriesByCompany, getProductsByCompany } from './content-loader'
import type { CompanySlug } from '@vedanta/schemas'

const APP_DIR = resolve(__dirname, '../app')
const SKIP_DIRS = new Set(['node_modules', '.next', 'dist'])

export function walk(dir: string, matches: (name: string) => boolean): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full, matches))
    } else if (matches(entry.name)) {
      out.push(full)
    }
  }
  return out
}

export const pageFiles = walk(APP_DIR, (name) => name === 'page.tsx')

function routeFromPageFile(file: string): string {
  const rel = relative(APP_DIR, file)
  const segments = rel
    .split('/')
    .slice(0, -1) // drop page.tsx
    .filter((s) => !/^\(.*\)$/.test(s)) // drop route groups, e.g. (group)
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`
}

// VG-012 (session 5): the first dynamic segments this app has ever had. A
// literal filesystem walk sees only "/{company}/products/[category]/[slug]/"
// — the bracket segments un-substituted — which never matches a real,
// crawlable URL. Expand them the same way generateStaticParams does, from
// the same content source, so ROUTES always agrees with what actually
// prerenders (mirrors the generateStaticParams pattern in
// lib/product-detail-page.tsx / lib/product-category-pages.tsx).
const DYNAMIC_COMPANIES: CompanySlug[] = ['dhruv-epc', 'precise-engineers']

function expandDynamicRoutes(literalRoutes: string[]): string[] {
  const out: string[] = []
  for (const route of literalRoutes) {
    if (!route.includes('[')) {
      out.push(route)
      continue
    }
    for (const companySlug of DYNAMIC_COMPANIES) {
      if (route === `/${companySlug}/products/[category]/`) {
        for (const category of getProductCategoriesByCompany(companySlug)) {
          out.push(`/${companySlug}/products/${category.slug}/`)
        }
      } else if (route === `/${companySlug}/products/[category]/[slug]/`) {
        for (const product of getProductsByCompany(companySlug)) {
          out.push(`/${companySlug}/products/${product.categorySlug}/${product.slug}/`)
        }
      }
    }
  }
  return out
}

export const ROUTES: ReadonlySet<string> = new Set(expandDynamicRoutes(pageFiles.map(routeFromPageFile)))

// path/query/hash -> canonical trailing-slash form comparable to ROUTES.
// trailingSlash: true (next.config) means '/foo' and '/foo/' both resolve,
// but the canonical form everything should point at has the slash.
export function normalize(path: string): string {
  const withoutBase = path.startsWith(BASE) ? path.slice(BASE.length) : path
  const bare = withoutBase.split('#')[0]?.split('?')[0] ?? ''
  if (bare === '') return '/'
  return bare.endsWith('/') ? bare : `${bare}/`
}
