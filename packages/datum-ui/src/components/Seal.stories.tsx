import type { Meta, StoryObj } from '@storybook/react'
import { Seal } from './Seal'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Seal> = {
  title: 'Datum/Seal',
  component: Seal,
}
export default meta
type Story = StoryObj<typeof Seal>

export const CertificationCardSize: Story = {
  args: { code: 'U2', size: 72 },
  decorators: [withCompany('dhruv')],
}

export const Floor: Story = {
  args: { code: 'ISO-9001', size: 44 },
  decorators: [withCompany('precise')],
}

// 120px is the only rung where the code line takes text-accent and an
// issuer line is shown (§2.5) — not wired to a live consumer yet.
export const FullWithIssuer: Story = {
  args: { code: 'IBR', issuer: 'Central Boilers Board', size: 120 },
  decorators: [withCompany('dhruv')],
}

export const SizeLadder: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <Seal code="U2" issuer="ASME, New York" size={120} />
      <Seal code="U2" size={72} />
      <Seal code="U2" size={44} />
    </div>
  ),
  decorators: [withCompany('dhruv')],
}
