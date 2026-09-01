// Metadata uniqueness (VG-062). Every route's <title>/<meta description>
// is a distinct crawler/SERP-facing claim — two routes rendering the same
// one collapses their identity for both audiences. Also locks in the ~60
// char title budget (B10 dropped the double-suffix bug; this holds the length
// line so a new page can't reintroduce a 90-char title).

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { productDetailPageData } from './product-detail-page-data'
import { productCategoryIndexPageData, productCategoryListingPageData } from './product-category-pages-data'
import {
  capabilityDetailPageData,
  capabilityIndexMetadata,
  industryDetailPageData,
  industryIndexMetadata,
} from './industry-capability-pages-data'
import type { CompanySlug } from '@vedanta/schemas'

const APP_DIR = resolve(__dirname, '../app')
const SKIP_DIRS = new Set(['node_modules', '.next', 'dist'])
const TITLE_BUDGET = 60

function walk(dir: string, matches: (name: string) => boolean): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, matches))
    else if (matches(entry.name)) out.push(full)
  }
  return out
}

const pageFiles = walk(APP_DIR, (name) => name === 'page.tsx')

function extractMetadata(file: string): { title: string | undefined; description: string | undefined } {
  const src = readFileSync(file, 'utf8')
  const titleMatch = src.match(/\btitle:\s*'([^']*)'/)
  const descMatch = src.match(/\bdescription:\s*\n?\s*'([^']*)'/)
  return { title: titleMatch?.[1], description: descMatch?.[1] }
}

// VG-012 (session 5): four route files no longer carry a static `title:`
// literal — metadata is computed per instance by generateMetadata/metadata
// in lib/product-detail-page.tsx and lib/product-category-pages.tsx. The
// static regex scan below can't see those; this test would otherwise report
// every real product/category title as "missing" instead of checking it.
// Each is expanded here into one record per real instance (every product,
// every category, both companies) so uniqueness is checked against what
// actually renders, not weakened to skip the dynamic routes.
const COMPANIES: CompanySlug[] = ['dhruv-epc', 'precise-engineers']
const DYNAMIC_FILES = new Set([
  'dhruv-epc/products/page.tsx',
  'precise-engineers/products/page.tsx',
  'dhruv-epc/products/[category]/page.tsx',
  'precise-engineers/products/[category]/page.tsx',
  'dhruv-epc/products/[category]/[slug]/page.tsx',
  'precise-engineers/products/[category]/[slug]/page.tsx',
  // Session 8 (VG-020/021): index metadata comes from a called function
  // (industryIndexMetadata()/capabilityIndexMetadata()), not a `title:`
  // object literal — same reason the product routes above are dynamic.
  '(group)/industries/page.tsx',
  '(group)/industries/[slug]/page.tsx',
  '(group)/capabilities/page.tsx',
  '(group)/capabilities/[slug]/page.tsx',
])

function dynamicRecords(): { file: string; title: string | undefined; description: string | undefined }[] {
  const out: { file: string; title: string | undefined; description: string | undefined }[] = []
  for (const company of COMPANIES) {
    const indexImpl = productCategoryIndexPageData(company)
    out.push({
      file: `${company}/products/page.tsx`,
      title: indexImpl.metadata.title as string | undefined,
      description: indexImpl.metadata.description as string | undefined,
    })

    const listingImpl = productCategoryListingPageData(company)
    for (const { category } of listingImpl.generateStaticParams()) {
      const meta = listingImpl.generateMetadata({ params: { category } })
      out.push({
        file: `${company}/products/[category]/page.tsx:${category}`,
        title: meta.title as string | undefined,
        description: meta.description as string | undefined,
      })
    }

    const detailImpl = productDetailPageData(company)
    for (const { category, slug } of detailImpl.generateStaticParams()) {
      const meta = detailImpl.generateMetadata({ params: { category, slug } })
      out.push({
        file: `${company}/products/[category]/[slug]/page.tsx:${category}/${slug}`,
        title: meta.title as string | undefined,
        description: meta.description as string | undefined,
      })
    }
  }

  // Session 8 (VG-020/021) — group-scope, not per-company.
  const industryIndex = industryIndexMetadata()
  out.push({
    file: '(group)/industries/page.tsx',
    title: industryIndex.title as string | undefined,
    description: industryIndex.description as string | undefined,
  })
  const industryDetail = industryDetailPageData()
  for (const { slug } of industryDetail.generateStaticParams()) {
    const meta = industryDetail.generateMetadata({ params: { slug } })
    out.push({
      file: `(group)/industries/[slug]/page.tsx:${slug}`,
      title: meta.title as string | undefined,
      description: meta.description as string | undefined,
    })
  }

  const capabilityIndex = capabilityIndexMetadata()
  out.push({
    file: '(group)/capabilities/page.tsx',
    title: capabilityIndex.title as string | undefined,
    description: capabilityIndex.description as string | undefined,
  })
  const capabilityDetail = capabilityDetailPageData()
  for (const { slug } of capabilityDetail.generateStaticParams()) {
    const meta = capabilityDetail.generateMetadata({ params: { slug } })
    out.push({
      file: `(group)/capabilities/[slug]/page.tsx:${slug}`,
      title: meta.title as string | undefined,
      description: meta.description as string | undefined,
    })
  }

  return out
}

const records = [
  ...pageFiles
    .map((file) => ({ file: relative(APP_DIR, file), ...extractMetadata(file) }))
    .filter((r) => !DYNAMIC_FILES.has(r.file)),
  ...dynamicRecords(),
]

describe('metadata uniqueness (VG-062)', () => {
  it('found every page route', () => {
    expect(records.length).toBeGreaterThan(0)
  })

  it('every route defines a title', () => {
    const missing = records.filter((r) => !r.title).map((r) => r.file)
    expect(missing).toEqual([])
  })

  it('no two routes share an identical title', () => {
    const byTitle = new Map<string, string[]>()
    for (const r of records) {
      if (!r.title) continue
      byTitle.set(r.title, [...(byTitle.get(r.title) ?? []), r.file])
    }
    const dupes = [...byTitle.entries()].filter(([, files]) => files.length > 1)
    expect(dupes).toEqual([])
  })

  it('no two routes share an identical description', () => {
    const byDesc = new Map<string, string[]>()
    for (const r of records) {
      if (!r.description) continue
      byDesc.set(r.description, [...(byDesc.get(r.description) ?? []), r.file])
    }
    const dupes = [...byDesc.entries()].filter(([, files]) => files.length > 1)
    expect(dupes).toEqual([])
  })

  it(`no title exceeds ${TITLE_BUDGET} characters`, () => {
    const overBudget = records
      .filter((r) => (r.title?.length ?? 0) > TITLE_BUDGET)
      .map((r) => `${r.file}: ${r.title?.length} chars — "${r.title}"`)
    expect(overBudget).toEqual([])
  })
})
