import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { semanticByCompany, type Company } from '@vedanta/tokens'

// app/globals.css hand-duplicates the --accent* custom properties that
// semantic.ts already computes from primitives. Nothing enforced parity
// between the two, so this test fails loudly the moment they drift (see
// docs/mistakes.md B7). It does not eliminate the duplication — that's a
// larger refactor.

const GLOBALS_CSS_PATH = resolve(__dirname, '../app/globals.css')

const PROPERTY_TO_SEMANTIC: Record<string, (c: Company) => string> = {
  '--accent': c => semanticByCompany[c].color.accent.default,
  '--accent-dark': c => semanticByCompany[c].color.accent.onDark,
  '--accent-text': c => semanticByCompany[c].color.accent.text,
  '--accent-text-hover': c => semanticByCompany[c].color.accent.textHover,
  '--accent-focus': c => semanticByCompany[c].color.focus.ring,
  '--accent-hover': c => semanticByCompany[c].color.action.rfqHover,
  '--accent-pressed': c => semanticByCompany[c].color.action.rfqPressed,
  '--accent-fg': c => semanticByCompany[c].color.action.rfqFg,
}

function extractBlock(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`selector not found in globals.css: ${selector}`)
  const bodyStart = css.indexOf('{', start)
  const bodyEnd = css.indexOf('}', bodyStart)
  const body = css.slice(bodyStart, bodyEnd)
  const props: Record<string, string> = {}
  for (const match of body.matchAll(/(--[\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
    props[match[1] as string] = match[2] as string
  }
  return props
}

describe('globals.css custom properties match semantic.ts (B7)', () => {
  const css = readFileSync(GLOBALS_CSS_PATH, 'utf8')

  const cases: Array<{ label: string; selector: string; company: Company }> = [
    { label: "[data-company='dhruv']", selector: "[data-company='dhruv']", company: 'dhruv' },
    { label: "[data-company='precise']", selector: "[data-company='precise']", company: 'precise' },
  ]

  for (const { label, selector, company } of cases) {
    const props = extractBlock(css, selector)

    it(`${label} declares every expected --accent* property`, () => {
      expect(Object.keys(props).sort()).toEqual(Object.keys(PROPERTY_TO_SEMANTIC).sort())
    })

    for (const [prop, resolveValue] of Object.entries(PROPERTY_TO_SEMANTIC)) {
      it(`${label} ${prop} matches semanticByCompany.${company}`, () => {
        expect(props[prop]).toBe(resolveValue(company))
      })
    }
  }
})
