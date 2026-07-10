import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Select> = {
  title: 'Datum/Select',
  component: Select,
}
export default meta
type Story = StoryObj<typeof Select>

const timelineOptions = [
  { value: 'urgent', label: 'Urgent — under 4 weeks' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'planning', label: 'Budgetary / planning' },
]

export const Dhruv: Story = {
  args: {
    id: 'timeline-d',
    label: 'Timeline',
    placeholder: 'Select a timeline',
    options: timelineOptions,
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    id: 'timeline-p',
    label: 'Timeline',
    placeholder: 'Select a timeline',
    options: timelineOptions,
  },
  decorators: [withCompany('precise')],
}

export const WithError: Story = {
  args: {
    id: 'timeline-e',
    label: 'Timeline',
    placeholder: 'Select a timeline',
    options: timelineOptions,
    error: 'Select a timeline',
  },
  decorators: [withCompany('dhruv')],
}
