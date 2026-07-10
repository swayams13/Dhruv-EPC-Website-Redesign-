import type { Meta, StoryObj } from '@storybook/react'
import { StatBand } from './StatBand'
import { withCompany } from '../story-helpers'

const stats = [
  { value: '38 yrs', label: 'In fabrication', source: 'Incorporated 1988' },
  { value: '250 T', label: 'Max single piece', source: 'Crane capacity record' },
  { value: 'Ø 4,000 mm', label: 'Max diameter', source: 'Shop envelope' },
  { value: '6', label: 'Sectors served', source: 'Client register, 2026' },
]

const meta: Meta<typeof StatBand> = {
  title: 'Datum/StatBand',
  component: StatBand,
}
export default meta
type Story = StoryObj<typeof StatBand>

export const Dhruv: Story = {
  args: { stats },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    stats: [
      { value: '25 yrs', label: 'In expansion joints', source: 'Incorporated 2001' },
      { value: 'DN 6,000', label: 'Max bellows size', source: 'Forming envelope' },
      { value: '750 °C', label: 'Max design temp', source: 'EJMA 10th ed. designs' },
      { value: '4', label: 'Sectors served', source: 'Client register, 2026' },
    ],
  },
  decorators: [withCompany('precise')],
}

export const OnGraphite: Story = {
  render: () => (
    <div className="bg-steel-900 p-8">
      <StatBand stats={stats} onDark />
    </div>
  ),
  decorators: [withCompany('dhruv')],
}
