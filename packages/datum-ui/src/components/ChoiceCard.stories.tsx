import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChoiceCard } from './ChoiceCard'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof ChoiceCard> = {
  title: 'Datum/ChoiceCard',
  component: ChoiceCard,
}
export default meta
type Story = StoryObj<typeof ChoiceCard>

// §12 domain icon — simplified section view (pressure vessel)
const vesselIcon = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9h10M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
)

function EquipmentGroup({ name }: { name: string }) {
  const [picked, setPicked] = useState('vessel')
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="pb-2 text-sm font-medium text-steel-950">Equipment type</legend>
      <ChoiceCard
        name={name}
        value="vessel"
        label="Pressure vessel"
        icon={vesselIcon}
        checked={picked === 'vessel'}
        onChange={setPicked}
      />
      <ChoiceCard
        name={name}
        value="exchanger"
        label="Heat exchanger"
        icon={vesselIcon}
        checked={picked === 'exchanger'}
        onChange={setPicked}
      />
      <ChoiceCard
        name={name}
        value="skid"
        label="Skid / package"
        checked={picked === 'skid'}
        onChange={setPicked}
      />
    </fieldset>
  )
}

export const Dhruv: Story = {
  render: () => <EquipmentGroup name="equip-d" />,
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  render: () => <EquipmentGroup name="equip-p" />,
  decorators: [withCompany('precise')],
}
