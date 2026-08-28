// Axe pass per story (BUILD-PLAYBOOK Session 4 gate).
// Every story from every component renders through its decorators (company
// scope included) and must produce zero WCAG A/AA violations.
// color-contrast is excluded here: jsdom has no paint layer — contrast is
// asserted numerically in packages/tokens/src/tokens.test.ts (§4.5 covenant).

import { afterEach, describe, it, expect } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import axe from 'axe-core'

// Without this, un-cleaned DOM from one story (e.g. a HomeHero's
// [data-rfq-anchor] CTA) leaks into the next story's render — MobileBottomBar
// then finds a stale anchor and tries to construct an IntersectionObserver,
// which jsdom doesn't provide. Order-dependent before the auto-glob (T5)
// happened to dodge it; explicit cleanup makes it order-independent.
afterEach(cleanup)

// Auto-glob (session 1, T5): every *.stories.tsx file is picked up without
// editing this file — the old hand-maintained map silently skipped any
// component whose story file existed but wasn't added to the map by hand.
const storyModules = import.meta.glob('./components/*.stories.tsx', { eager: true }) as Record<
  string,
  Parameters<typeof composeStories>[0]
>

for (const [path, mod] of Object.entries(storyModules)) {
  const componentName = path.replace('./components/', '').replace('.stories.tsx', '')
  const stories = composeStories(mod)
  describe(`${componentName} — axe`, () => {
    for (const [storyName, Story] of Object.entries(stories)) {
      // composeStories loses the component signature over a heterogeneous module map
      const Composed = Story as unknown as React.ComponentType
      it(`${storyName}: zero WCAG A/AA violations`, async () => {
        const { container } = render(<Composed />)
        const results = await axe.run(container, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        })
        expect(results.violations).toEqual([])
      })
    }
  })
}
