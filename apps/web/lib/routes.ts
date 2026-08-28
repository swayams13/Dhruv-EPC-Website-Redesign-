// Single source of truth for "what are the real routes" — shared by
// link-integrity.test.ts (vitest) and e2e/a11y.spec.ts (Playwright), so a
// route added to one and not the other can't happen by construction.

import { readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { BASE } from './site'

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

export const ROUTES: ReadonlySet<string> = new Set(pageFiles.map(routeFromPageFile))

// path/query/hash -> canonical trailing-slash form comparable to ROUTES.
// trailingSlash: true (next.config) means '/foo' and '/foo/' both resolve,
// but the canonical form everything should point at has the slash.
export function normalize(path: string): string {
  const withoutBase = path.startsWith(BASE) ? path.slice(BASE.length) : path
  const bare = withoutBase.split('#')[0]?.split('?')[0] ?? ''
  if (bare === '') return '/'
  return bare.endsWith('/') ? bare : `${bare}/`
}
