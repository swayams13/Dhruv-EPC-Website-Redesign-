import type { Meta, StoryObj } from '@storybook/react'
import type { Client } from '@vedanta/schemas'
import { ClientWall } from './ClientWall'
import { withCompany } from '../story-helpers'

// 1×1 neutral SVG stands in for approved monochrome marks in stories
const demoLogo =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="32"%3E%3Crect width="96" height="32" fill="%233F4950"/%3E%3C/svg%3E'

const clients: Client[] = [
  {
    companySlugs: ['dhruv-epc'],
    name: 'GSFC',
    sector: 'Fertilizer',
    logoUrl: demoLogo,
    permission: 'logo-approved',
  },
  {
    companySlugs: ['dhruv-epc'],
    name: 'IOCL',
    sector: 'Refinery',
    logoUrl: demoLogo,
    permission: 'logo-approved',
  },
  // name-only permission → text tile, never blank (§20 / addendum §5-5)
  {
    companySlugs: ['dhruv-epc'],
    name: 'Deepak Nitrite',
    sector: 'Chemicals',
    permission: 'name-only',
  },
  {
    companySlugs: ['dhruv-epc'],
    name: 'Aarti Industries',
    sector: 'Chemicals',
    permission: 'name-only',
  },
]

const meta: Meta<typeof ClientWall> = {
  title: 'Datum/ClientWall',
  component: ClientWall,
}
export default meta
type Story = StoryObj<typeof ClientWall>

export const Dhruv: Story = {
  args: { clients },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    clients: clients.map((c) => ({ ...c, companySlugs: ['precise-engineers' as const] })),
  },
  decorators: [withCompany('precise')],
}
