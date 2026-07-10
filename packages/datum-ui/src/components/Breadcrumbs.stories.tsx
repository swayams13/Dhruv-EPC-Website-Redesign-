import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumbs } from './Breadcrumbs'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Datum/Breadcrumbs',
  component: Breadcrumbs,
}
export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Dhruv: Story = {
  args: {
    items: [
      { label: 'Home', href: '/dhruv-epc' },
      { label: 'Equipment', href: '/dhruv-epc/equipment' },
      { label: 'Heat exchangers' },
    ],
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    items: [
      { label: 'Home', href: '/precise-engineers' },
      { label: 'Products', href: '/precise-engineers/products' },
      { label: 'Metallic bellows' },
    ],
  },
  decorators: [withCompany('precise')],
}
