import type { Meta, StoryObj } from '@storybook/react'
import { SpecRailDesktop, SpecRailMobile } from './SpecRail'
import { withCompany } from '../story-helpers'
import type { SpecTableRow } from './SpecTable'

const rows: SpecTableRow[] = [
  { param: 'Vessel types', value: 'Separators, reactors, columns, drums', provenance: 'sourced' },
  {
    param: 'Shell diameter',
    value: '300 – 5,000',
    unit: 'mm',
    note: 'DEMO figure — engineering data pending',
    provenance: 'unverified',
  },
  { param: 'Inspection', value: 'LRS · BV · DNV · IBR', provenance: 'sourced' },
]

const primaryCta = { label: 'Request a quote', href: '/request-a-quote?equipment=pressure-vessels' }
const secondaryCta = { label: 'Download datasheet', href: '#' }

const meta: Meta<typeof SpecRailDesktop> = {
  title: 'Datum/SpecRail',
  component: SpecRailDesktop,
}
export default meta
type Story = StoryObj<typeof SpecRailDesktop>

export const Desktop: Story = {
  args: { rows, primaryCta, secondaryCta, dimensionLabel: 'Ø 3,600 mm' },
  decorators: [withCompany('dhruv')],
}

export const DesktopNoSecondaryCta: Story = {
  args: { rows, primaryCta },
  decorators: [withCompany('dhruv')],
}

export const DesktopPrecise: Story = {
  args: { rows, primaryCta, secondaryCta },
  decorators: [withCompany('precise')],
}

export const DesktopAllSourced: Story = {
  args: {
    rows: rows.map((r) => ({ ...r, provenance: 'sourced' as const, note: undefined })),
    primaryCta,
    secondaryCta,
  },
  decorators: [withCompany('dhruv')],
}

export const Mobile: StoryObj<typeof SpecRailMobile> = {
  render: (args) => <SpecRailMobile {...args} />,
  args: { rows },
  decorators: [withCompany('dhruv')],
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
}
