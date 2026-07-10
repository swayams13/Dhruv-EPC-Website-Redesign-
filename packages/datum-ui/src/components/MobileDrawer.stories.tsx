import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from './Button'
import { MobileDrawer } from './MobileDrawer'
import { withCompany } from '../story-helpers'

const groups = [
  {
    label: 'Static equipment',
    items: [
      { label: 'Shell & tube heat exchangers', href: '#heat-exchangers' },
      { label: 'Pressure vessels', href: '#pressure-vessels' },
      { label: 'Columns & reactors', href: '#columns' },
    ],
  },
  {
    label: 'Skids & packages',
    items: [
      { label: 'Process skids', href: '#skids' },
      { label: 'Storage tanks', href: '#tanks' },
    ],
  },
]

const links = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Projects', href: '#projects' },
  { label: 'Company', href: '#company' },
]

const meta: Meta<typeof MobileDrawer> = {
  title: 'Datum/MobileDrawer',
  component: MobileDrawer,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof MobileDrawer>

export const Dhruv: Story = {
  args: {
    open: true,
    onClose: () => undefined,
    groups,
    links,
    rfqHref: '/request-a-quote?company=dhruv-epc',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: { ...Dhruv.args, rfqHref: '/request-a-quote?company=precise-engineers' },
  decorators: [withCompany('precise')],
}

// Interactive open → trap → ESC/scrim close
export const OpenClose: Story = {
  render: function OpenCloseStory() {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-8">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open menu
        </Button>
        <MobileDrawer
          open={open}
          onClose={() => setOpen(false)}
          groups={groups}
          links={links}
          rfqHref="/request-a-quote"
        />
      </div>
    )
  },
  decorators: [withCompany('dhruv')],
}
