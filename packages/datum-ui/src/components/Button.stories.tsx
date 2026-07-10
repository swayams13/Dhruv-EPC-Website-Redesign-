import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof Button> = {
  title: 'Datum/Button',
  component: Button,
}
export default meta
type Story = StoryObj<typeof Button>

// The Amber Law / Blue Law: one accent-filled element per view (§13)
export const RfqDhruv: Story = {
  args: { variant: 'rfq', children: 'Request a quote' },
  decorators: [withCompany('dhruv')],
}

export const RfqPrecise: Story = {
  args: { variant: 'rfq', children: 'Request a quote' },
  decorators: [withCompany('precise')],
}

export const HierarchyDhruv: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary">View equipment</Button>
      <Button variant="secondary">Download PDF</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="link">Capability matrix</Button>
    </div>
  ),
  decorators: [withCompany('dhruv')],
}

export const HierarchyPrecise: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary">View products</Button>
      <Button variant="secondary">Download PDF</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="link">Capability matrix</Button>
    </div>
  ),
  decorators: [withCompany('precise')],
}

// §13: on graphite, Primary inverts; RFQ stays accent-filled — the one constant
export const OnGraphite: Story = {
  render: () => (
    <div className="flex items-center gap-4 bg-steel-900 p-8">
      <Button variant="rfq" href="/request-a-quote">
        Request a quote
      </Button>
      <Button variant="primary" onDark>
        View equipment
      </Button>
      <Button variant="secondary" onDark href="#capability-matrix">
        Capability matrix
      </Button>
    </div>
  ),
  decorators: [withCompany('dhruv')],
}

export const AsLink: Story = {
  args: { variant: 'rfq', href: '/request-a-quote', children: 'Request a quote' },
  decorators: [withCompany('precise')],
}

export const Compact: Story = {
  args: { variant: 'secondary', size: 'compact', children: 'Download PDF' },
  decorators: [withCompany('dhruv')],
}

export const Loading: Story = {
  args: { variant: 'rfq', loading: true, children: 'Request a quote' },
  decorators: [withCompany('dhruv')],
}

export const Disabled: Story = {
  args: { variant: 'rfq', disabled: true, children: 'Request a quote' },
  decorators: [withCompany('dhruv')],
}
