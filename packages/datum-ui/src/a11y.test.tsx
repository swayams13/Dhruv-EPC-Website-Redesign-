// Axe pass per story (BUILD-PLAYBOOK Session 4 gate).
// Every story from every component renders through its decorators (company
// scope included) and must produce zero WCAG A/AA violations.
// color-contrast is excluded here: jsdom has no paint layer — contrast is
// asserted numerically in packages/tokens/src/tokens.test.ts (§4.5 covenant).

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import axe from 'axe-core'

import * as StampStories from './components/Stamp.stories'
import * as DatumRuleStories from './components/DatumRule.stories'
import * as ButtonStories from './components/Button.stories'
import * as InputStories from './components/Input.stories'
import * as SelectStories from './components/Select.stories'
import * as TextareaStories from './components/Textarea.stories'
import * as ChoiceCardStories from './components/ChoiceCard.stories'
import * as UploadDropzoneStories from './components/UploadDropzone.stories'
import * as SpecTableStories from './components/SpecTable.stories'
import * as ProductCardStories from './components/ProductCard.stories'
import * as ProjectCardStories from './components/ProjectCard.stories'

const allStories = {
  Stamp: StampStories,
  DatumRule: DatumRuleStories,
  Button: ButtonStories,
  Input: InputStories,
  Select: SelectStories,
  Textarea: TextareaStories,
  ChoiceCard: ChoiceCardStories,
  UploadDropzone: UploadDropzoneStories,
  SpecTable: SpecTableStories,
  ProductCard: ProductCardStories,
  ProjectCard: ProjectCardStories,
}

for (const [componentName, mod] of Object.entries(allStories)) {
  const stories = composeStories(mod as Parameters<typeof composeStories>[0])
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
