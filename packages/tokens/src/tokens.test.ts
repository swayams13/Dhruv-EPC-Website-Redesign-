import { describe, it, expect } from 'vitest'
import { steel, brand, flex, signal } from './primitives'
import { semanticBase, semanticDhruv, semanticPrecise, semanticGroup } from './semantic'

// WCAG 2.1 relative luminance + contrast ratio
function lum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function cr(fg: string, bg: string): number {
  const a = lum(fg)
  const b = lum(bg)
  const lighter = a > b ? a : b
  const darker = a > b ? b : a
  return (lighter + 0.05) / (darker + 0.05)
}

// ─── Semantic alias resolution (§26) ─────────────────────────────────────────
// Guards that semantic tokens point to real primitives.
// If a primitive hex changes without updating semantic, these fail.

describe('semantic alias resolution', () => {
  it('base text.primary → steel-950', () => {
    expect(semanticBase.color.text.primary).toBe(steel[950])
  })
  it('base text.secondary → steel-600', () => {
    expect(semanticBase.color.text.secondary).toBe(steel[600])
  })
  it('base surface.page → steel-50', () => {
    expect(semanticBase.color.surface.page).toBe(steel[50])
  })
  it('base border.scribed → steel-200', () => {
    expect(semanticBase.color.border.scribed).toBe(steel[200])
  })
  it('base signal.success → signal primitive', () => {
    expect(semanticBase.color.signal.success).toBe(signal.success)
  })
  it('base signal.error → signal primitive', () => {
    expect(semanticBase.color.signal.error).toBe(signal.error)
  })
  it('dhruv action.rfq → brand-500 (§13, v1.2: brand red replaces arc amber)', () => {
    expect(semanticDhruv.color.action.rfq).toBe(brand[500])
  })
  it('dhruv action.rfqHover → brand-600', () => {
    expect(semanticDhruv.color.action.rfqHover).toBe(brand[600])
  })
  it('dhruv focus.ring → brand-500 (§25)', () => {
    expect(semanticDhruv.color.focus.ring).toBe(brand[500])
  })
  it('dhruv focus.ringOnDark → brand-300 (§25, dark chrome)', () => {
    expect(semanticDhruv.color.focus.ringOnDark).toBe(brand[300])
  })
  it('precise action.rfq → flex-500 (blue law §13)', () => {
    expect(semanticPrecise.color.action.rfq).toBe(flex[500])
  })
  it('precise action.rfqHover → flex-600', () => {
    expect(semanticPrecise.color.action.rfqHover).toBe(flex[600])
  })
  it('precise focus.ring → flex-500 (§25)', () => {
    expect(semanticPrecise.color.focus.ring).toBe(flex[500])
  })
  it('precise focus.ringOnDark → flex-300 (§25, dark chrome)', () => {
    expect(semanticPrecise.color.focus.ringOnDark).toBe(flex[300])
  })
  // v1.2: §5's "group has no accent" rule is retired. Red is the VEDANTA mark's
  // colour, not Dhruv's — the group scope is where it is unambiguously correct.
  it('group accent → brand-500 (v1.2, supersedes "steel only" §5)', () => {
    expect(semanticGroup.color.accent.default).toBe(brand[500])
  })
  it('group action.rfq → brand-500', () => {
    expect(semanticGroup.color.action.rfq).toBe(brand[500])
  })
  // Precise is the one scope that must NOT inherit the group red.
  it('precise accent stays flex blue — the group red does not leak into it', () => {
    expect(semanticPrecise.color.accent.default).toBe(flex[500])
    expect(semanticPrecise.color.accent.default).not.toBe(brand[500])
  })
})

// ─── Contrast covenant (§4.5) ─────────────────────────────────────────────────
// 4.5:1 minimum for normal text; 3:1 for UI components / large text.
// Every pair listed here is a sanctioned combination in the spec.

describe('contrast covenant §4.5', () => {
  it('steel-950 on steel-50 ≥ 7:1 (primary text, ink on mill-white)', () => {
    expect(cr(steel[950], steel[50])).toBeGreaterThanOrEqual(7)
  })

  it('steel-600 on steel-50 ≥ 4.5:1 (secondary text, spec states 7.0:1)', () => {
    expect(cr(steel[600], steel[50])).toBeGreaterThanOrEqual(4.5)
  })

  it('steel-50 on steel-900 ≥ 4.5:1 (onDark text)', () => {
    expect(cr(steel[50], steel[900])).toBeGreaterThanOrEqual(4.5)
  })

  it('brand-300 on steel-900 ≥ 4.5:1 (accent on Footer dark band)', () => {
    expect(cr(brand[300], steel[900])).toBeGreaterThanOrEqual(4.5)
  })

  it('brand-300 on steel-950 ≥ 4.5:1 (accent on Header / MobileDrawer chrome)', () => {
    expect(cr(brand[300], steel[950])).toBeGreaterThanOrEqual(4.5)
  })

  it('brand-600 on steel-50 ≥ 4.5:1 (accent text on light — text uses brand-600+, not brand-500)', () => {
    expect(cr(brand[600], steel[50])).toBeGreaterThanOrEqual(4.5)
  })

  // ── The three assertions the v1.2 red swap exists to hold ────────────────────
  // A straight hex swap of the accent breaks all three. They are regression locks.

  it('steel-50 on brand-500 ≥ 4.5:1 (RFQ button label MUST be light on the red fill)', () => {
    expect(cr(steel[50], brand[500])).toBeGreaterThanOrEqual(4.5)
  })

  it('steel-950 on brand-500 is BELOW 4.5:1 — dark labels on the red fill are forbidden', () => {
    // Locks in why rfqFg flipped to steel-50. arc-500 (amber) passed this at 5.79:1;
    // brand-500 does not. If someone reverts rfqFg to steel-950, this fails loudly.
    expect(cr(steel[950], brand[500])).toBeLessThan(4.5)
  })

  it('brand-300 on steel-950 ≥ 3:1 (focus ring on dark chrome, WCAG 1.4.11)', () => {
    // brand-500 itself is 2.85:1 here — under the floor. This is why globals.css
    // rebinds --accent-focus inside [data-chrome='dark'].
    expect(cr(brand[300], steel[950])).toBeGreaterThanOrEqual(3)
    expect(cr(brand[500], steel[950])).toBeLessThan(3)
  })

  it('flex-500 on white ≥ 4.5:1 (Precise accent, 5.70:1 approved 2026-07-09)', () => {
    expect(cr(flex[500], '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
  })

  it('flex-600 on steel-50 ≥ 4.5:1 (Precise accent text on light)', () => {
    expect(cr(flex[600], steel[50])).toBeGreaterThanOrEqual(4.5)
  })

  it('rfqFg (precise) on flex-500 ≥ 4.5:1 (Precise RFQ button label — white text on dark blue)', () => {
    // steel-950 on flex-500 is only 3.2:1; precise rfqFg uses steel-50 (~7.1:1)
    expect(cr(semanticPrecise.color.action.rfqFg, flex[500])).toBeGreaterThanOrEqual(4.5)
  })

  it('rfqFg (group) on group rfq fill ≥ 4.5:1 (was 1:1 — steel-950 on steel-950, fixed 2026-07-10)', () => {
    expect(cr(semanticGroup.color.action.rfqFg, semanticGroup.color.action.rfq)).toBeGreaterThanOrEqual(4.5)
  })

  it('signal-success on white ≥ 4.5:1', () => {
    expect(cr(signal.success, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
  })

  it('signal-error on white ≥ 4.5:1 (must read as distinct from arc — not orange)', () => {
    expect(cr(signal.error, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
  })

  it('signal-warn on white ≥ 4.5:1', () => {
    expect(cr(signal.warn, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
  })
})
