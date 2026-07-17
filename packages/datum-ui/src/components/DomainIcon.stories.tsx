import type { Meta, StoryObj } from '@storybook/react'
import { DomainIcon } from './DomainIcon'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof DomainIcon> = {
  title: 'Datum/DomainIcon',
  component: DomainIcon,
}
export default meta

type Story = StoryObj<typeof DomainIcon>

const NAMES = [
  'exchanger',
  'vessel',
  'reactor',
  'column',
  'skid',
  'pipeSpool',
  'tank',
  'crane',
  'weldTorch',
  'ndtProbe',
  'stamp',
  'drawing',
  'bellows',
  'telescopic',
  'valve',
  'damper',
  'flange',
  'machining',
] as const

export const AllIcons: Story = {
  decorators: [withCompany('dhruv')],
  render: () => (
    <div className="flex flex-wrap gap-6">
      {NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <DomainIcon name={name} size={24} />
          <span className="font-mono text-helper text-steel-600">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const FeatureSize: Story = {
  decorators: [withCompany('dhruv')],
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col items-center gap-2">
        <DomainIcon name="bellows" size={32} />
        <span className="font-mono text-helper text-steel-600">bellows</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DomainIcon name="vessel" size={32} />
        <span className="font-mono text-helper text-steel-600">vessel</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DomainIcon name="exchanger" size={32} />
        <span className="font-mono text-helper text-steel-600">exchanger</span>
      </div>
    </div>
  ),
}
