// The check that would have caught the drift (blueprint §17.2).
//
// The old middleware carried 3 redirects under a comment claiming it was compiled
// from a 57-row CSV. Nothing asserted the two agreed, so nothing noticed. These
// tests are that assertion. If someone hand-edits middleware.ts, adds a CSV row
// without rebuilding, or points a redirect at another redirect, this fails.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEGACY_REDIRECTS, LEGACY_REDIRECT_COUNT } from './redirects.generated'

const CSV = resolve(__dirname, '../../../content/redirect-map.csv')

function csvRows(): { from: string; to: string; status: number }[] {
  return readFileSync(CSV, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('legacy_path'))
    .map((l) => {
      const parts = l.split(',').map((p) => p.trim())
      return { from: parts[0] ?? '', to: parts[1] ?? '', status: Number(parts[2]) }
    })
    // self-referencing rows are dropped by the compiler — an edge rule that
    // redirects a path to itself is an infinite loop
    .filter((r) => r.from !== r.to)
}

describe('legacy redirect map — CSV ↔ compiled parity', () => {
  it('compiled count equals CSV row count', () => {
    expect(LEGACY_REDIRECT_COUNT).toBe(csvRows().length)
  })

  it('compiled count equals the number of compiled keys', () => {
    expect(Object.keys(LEGACY_REDIRECTS)).toHaveLength(LEGACY_REDIRECT_COUNT)
  })

  it('every CSV row is present in the compiled map with the same destination', () => {
    const missing = csvRows().filter(
      (r) => LEGACY_REDIRECTS[r.from]?.to !== r.to || LEGACY_REDIRECTS[r.from]?.status !== r.status
    )
    expect(missing.map((m) => m.from)).toEqual([])
  })

  it('regression lock: more than the 3 hand-typed redirects survive', () => {
    // The bug state. If this drops back near 3, the map has been reverted.
    expect(LEGACY_REDIRECT_COUNT).toBeGreaterThan(50)
  })
})

describe('legacy redirect map — correctness', () => {
  it('no redirect chains — every destination is a final URL', () => {
    const sources = new Set(Object.keys(LEGACY_REDIRECTS))
    const chained = Object.entries(LEGACY_REDIRECTS)
      .filter(([, v]) => sources.has(v.to))
      .map(([k, v]) => `${k} → ${v.to}`)
    expect(chained).toEqual([])
  })

  it('no self-referencing rules', () => {
    const loops = Object.entries(LEGACY_REDIRECTS)
      .filter(([k, v]) => k === v.to)
      .map(([k]) => k)
    expect(loops).toEqual([])
  })

  it('all sources and destinations are root-relative paths', () => {
    for (const [from, { to }] of Object.entries(LEGACY_REDIRECTS)) {
      expect(from.startsWith('/')).toBe(true)
      expect(to.startsWith('/')).toBe(true)
    }
  })

  it('all rules are permanent (301/308) — 302s leak equity', () => {
    const temporary = Object.entries(LEGACY_REDIRECTS)
      .filter(([, v]) => v.status !== 301 && v.status !== 308)
      .map(([k]) => k)
    expect(temporary).toEqual([])
  })
})
