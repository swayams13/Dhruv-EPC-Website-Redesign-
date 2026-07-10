import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Input> = {
  title: 'Datum/Input',
  component: Input,
}
export default meta
type Story = StoryObj<typeof Input>

export const Dhruv: Story = {
  args: { id: 'name-d', label: 'Name', placeholder: 'K. Sharma' },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: { id: 'name-p', label: 'Name', placeholder: 'K. Sharma' },
  decorators: [withCompany('precise')],
}

export const WithHelper: Story = {
  args: {
    id: 'phone-h',
    label: 'Phone',
    type: 'tel',
    helper: 'Include country code, e.g. +91',
  },
  decorators: [withCompany('dhruv')],
}

export const WithError: Story = {
  args: {
    id: 'phone-e',
    label: 'Phone',
    type: 'tel',
    error: 'Enter a valid phone number with country code',
  },
  decorators: [withCompany('dhruv')],
}

export const Optional: Story = {
  args: { id: 'gst', label: 'GST number', optional: true },
  decorators: [withCompany('dhruv')],
}
