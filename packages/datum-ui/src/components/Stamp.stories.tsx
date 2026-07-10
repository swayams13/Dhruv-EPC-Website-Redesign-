import type { Meta, StoryObj } from '@storybook/react'
import { Stamp } from './Stamp'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Stamp> = {
  title: 'Datum/Stamp',
  component: Stamp,
}
export default meta
type Story = StoryObj<typeof Stamp>

export const Dhruv: Story = {
  args: { code: 'U', href: '/dhruv-epc/certifications' },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: { code: 'ISO-9001', href: '/precise-engineers/certifications' },
  decorators: [withCompany('precise')],
}

export const CredentialsStrip: Story = {
  render: () => (
    <div className="flex gap-3">
      <Stamp code="U" href="#u" />
      <Stamp code="U2" href="#u2" />
      <Stamp code="IBR" href="#ibr" />
      <Stamp code="ISO-9001" href="#iso" />
      <Stamp code="ISO-14001" />
      <Stamp code="ISO-45001" />
    </div>
  ),
  decorators: [withCompany('dhruv')],
}
