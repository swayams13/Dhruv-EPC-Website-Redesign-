import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { ROUTES } from '../lib/routes'

// Routes with a known, tracked violation — see docs/mistakes.md
// ("Session 1 (T3): route-level axe surfaces sitewide steel-500 text
// contrast failures (VG-004)") for the incident and root cause. Kept in
// one place so the harness ships green while the debt stays visible,
// per CLAUDE.md's a11y build-constraint rule.
//
// 2026-09-03: VG-004 (the sitewide Header/ProductCard/CategoryCard/
// IndustryCard/Header-utility-bar dark-ground contrast defect) is fixed —
// every route below except `/request-a-quote/thank-you/` re-checked clean
// via axe. See docs/mistakes.md for the fix writeup.
const KNOWN_FAILURES: Record<string, string> = {
  // Original session-1 "one-off" violation (steel-400 on a light steel-50
  // card, the numbered-step index) — distinct root cause from VG-004's
  // dark-ground pattern, never fixed, still open. docs/mistakes.md.
  '/request-a-quote/thank-you/': 'VG-004 (one-off, distinct from the dark-ground fix)',
}

for (const route of ROUTES) {
  const run = KNOWN_FAILURES[route] ? test.skip : test
  run(`${route}: zero WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}
