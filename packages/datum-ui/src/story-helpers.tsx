// Story helpers — company-scope decorator (not exported from the barrel).
// Every component must render correctly in BOTH themes (BUILD-PLAYBOOK §4).

import type { Decorator } from '@storybook/react'

export const withCompany = (company: 'dhruv' | 'precise' | 'group'): Decorator =>
  function CompanyScope(Story) {
    return (
      <div data-company={company} className="bg-steel-50 p-8">
        <Story />
      </div>
    )
  }
