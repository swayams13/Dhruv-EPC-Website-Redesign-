import type { Meta, StoryObj } from '@storybook/react'
import { Testimonial } from './Testimonial'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Testimonial> = {
  title: 'Datum/Testimonial',
  component: Testimonial,
}
export default meta
type Story = StoryObj<typeof Testimonial>

export const Dhruv: Story = {
  args: {
    quote:
      '100% document adherence across three consecutive orders — drawings, mill certificates and NDT records arrived before the equipment did.',
    attnCompany: 'Engineers India Limited',
    attnRole: 'Resident Inspection Engineer',
    provenance: 'Vendor performance evaluation, 2024',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    quote:
      'Bellows delivered against a 6-week shutdown window with full EJMA calculation reports on day one.',
    attnCompany: 'Reliance Industries',
    attnRole: 'Lead Piping Engineer',
    provenance: 'Shutdown closure report, 2023',
  },
  decorators: [withCompany('precise')],
}
