import type { Meta, StoryObj } from '@storybook/react'
import { CapabilityEnvelopeTable } from './CapabilityEnvelopeTable'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof CapabilityEnvelopeTable> = {
  title: 'Datum/CapabilityEnvelopeTable',
  component: CapabilityEnvelopeTable,
}
export default meta
type Story = StoryObj<typeof CapabilityEnvelopeTable>

export const HeavyFabrication: Story = {
  args: {
    caption: 'Heavy fabrication — process envelope',
    rows: [
      { param: 'Bay dimensions', value: '90 × 30 × 13', unit: 'm' },
      { param: 'Crane capacity', value: '80', unit: 'T' },
      { param: 'Plate thickness range', value: '3 – 150', unit: 'mm' },
    ],
  },
  decorators: [withCompany('dhruv')],
}

export const Placeholder: Story = {
  args: {
    caption: 'Bellows forming — process envelope',
    rows: [
      { param: 'Size / capacity range', value: 'CONTENT REQUIRED', note: 'Sourced envelope figure needed from Vedanta engineering' },
    ],
  },
  decorators: [withCompany('precise')],
}
