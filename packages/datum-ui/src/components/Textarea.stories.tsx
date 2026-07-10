import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Textarea> = {
  title: 'Datum/Textarea',
  component: Textarea,
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Dhruv: Story = {
  args: {
    id: 'req-d',
    label: 'Requirement',
    helper: 'Design code, size, MOC, quantity — anything from the datasheet helps',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    id: 'req-p',
    label: 'Requirement',
    helper: 'Design code, size, MOC, quantity — anything from the datasheet helps',
  },
  decorators: [withCompany('precise')],
}

export const WithError: Story = {
  args: { id: 'req-e', label: 'Requirement', error: 'Describe your requirement' },
  decorators: [withCompany('dhruv')],
}
