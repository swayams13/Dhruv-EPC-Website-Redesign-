// Enforces VEDANTA_DESIGN_DECISIONS.md Decision 1 (D-11)'s hard constraints
// on `logoRed` (#CD0101): consumed by Logo.tsx and nowhere else, never
// exposed through semantic.ts, never through any accent.* token or
// tailwind.ts colors, never used for buttons/links/focus rings/decorative
// UI. `brand` (#AA3833) is the UI accent and stays completely separate — the
// two reds look deliberately different side by side, not interchangeable.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { walk } from './routes'

const REPO_ROOT = resolve(__dirname, '../../..')

// Files allowed to reference the identifier/literal: the primitive's own
// definition, the package barrel re-export, its sole consumer, and this test.
const ALLOWED = new Set([
  'packages/tokens/src/primitives.ts',
  'packages/tokens/src/index.ts',
  'apps/web/components/Logo.tsx',
  'apps/web/lib/logo-consumer-boundary.test.ts',
])

// Walk each package root individually, not the repo root — the repo also
// contains .git and .claude/worktrees (full repo copies mid-review), which a
// root-level walk would needlessly traverse.
const SCAN_ROOTS = ['packages/tokens/src', 'packages/datum-ui/src', 'packages/schemas/src', 'apps/web'].map((p) =>
  resolve(REPO_ROOT, p)
)
const sourceFiles = SCAN_ROOTS.flatMap((root) => walk(root, (name) => /\.(ts|tsx)$/.test(name)))

function findMatches(pattern: RegExp): string[] {
  const hits: string[] = []
  for (const file of sourceFiles) {
    const rel = relative(REPO_ROOT, file)
    if (ALLOWED.has(rel)) continue
    const src = readFileSync(file, 'utf8')
    if (pattern.test(src)) hits.push(rel)
  }
  return hits
}

describe('logo consumer boundary (Decision 1 / D-11)', () => {
  it('`logoRed` is referenced only by Logo.tsx and its own definition/export', () => {
    expect(findMatches(/\blogoRed\b/)).toEqual([])
  })

  it('the literal `#CD0101` appears only in Logo.tsx and its own definition/export', () => {
    expect(findMatches(/#CD0101/i)).toEqual([])
  })

  it('logoRed is not exported from semantic.ts', () => {
    const src = readFileSync(resolve(REPO_ROOT, 'packages/tokens/src/semantic.ts'), 'utf8')
    expect(src).not.toMatch(/\blogoRed\b/)
  })

  it('logoRed is not registered as a tailwind.ts color', () => {
    const src = readFileSync(resolve(REPO_ROOT, 'packages/tokens/src/tailwind.ts'), 'utf8')
    expect(src).not.toMatch(/\blogoRed\b/)
    expect(src).not.toMatch(/#CD0101/i)
  })
})
