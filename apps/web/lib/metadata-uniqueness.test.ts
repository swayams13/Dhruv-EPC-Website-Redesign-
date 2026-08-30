// Metadata uniqueness (VG-062). Every route's <title>/<meta description>
// is a distinct crawler/SERP-facing claim — two routes rendering the same
// one collapses their identity for both audiences. Also locks in the ~60
// char title budget (B10 dropped the double-suffix bug; this holds the length
// line so a new page can't reintroduce a 90-char title).

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

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

const records = pageFiles.map((file) => ({ file: relative(APP_DIR, file), ...extractMetadata(file) }))

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
