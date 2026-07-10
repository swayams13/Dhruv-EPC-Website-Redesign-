import type { Meta, StoryObj } from '@storybook/react'
import { DatumRule } from './DatumRule'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof DatumRule> = {
  title: 'Datum/DatumRule',
  component: DatumRule,
}
export default meta
type Story = StoryObj<typeof DatumRule>

export const Dhruv: Story = {
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  decorators: [withCompany('precise')],
}

export const SignatureDraw: Story = {
  args: { animate: true },
  decorators: [withCompany('dhruv')],
}
