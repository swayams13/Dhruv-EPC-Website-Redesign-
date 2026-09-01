import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { MegaPanel } from './MegaPanel'
import { withCompany } from '../story-helpers'

const COLUMNS = [
  {
    companyLabel: 'Dhruv EPC Solutions',
    categories: [
      {
        name: 'Static Equipment',
        href: '/dhruv-epc/products/static-equipment',
        products: [
          { name: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels' },
          { name: 'Heat Exchangers', href: '/dhruv-epc/products/static-equipment/heat-exchangers' },
        ],
      },
      {
        name: 'Skids & Packages',
        href: '/dhruv-epc/products/skids-packages',
        products: [{ name: 'Process Skids', href: '/dhruv-epc/products/skids-packages/process-skids' }],
      },
    ],
    allProductsHref: '/dhruv-epc/products',
    allProductsLabel: 'All Dhruv EPC products →',
  },
  {
    companyLabel: 'Precise Engineers',
    categories: [
      {
        name: 'Expansion Joints',
        href: '/precise-engineers/products/expansion-joints',
        products: [
          { name: 'Metallic Bellows', href: '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint' },
        ],
      },
    ],
    allProductsHref: '/precise-engineers/products',
    allProductsLabel: 'All Precise Engineers products →',
  },
]

const meta: Meta<typeof MegaPanel> = {
  title: 'Datum/MegaPanel',
  component: MegaPanel,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof MegaPanel>

// Static open state — used by the axe pass.
export const Open: Story = {
  render: function OpenStory() {
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div className="relative bg-steel-950 p-4">
        <button ref={triggerRef} type="button" className="text-steel-50">
          Products
        </button>
        <MegaPanel id="story-mega-panel" open onClose={() => undefined} triggerRef={triggerRef} columns={COLUMNS} />
      </div>
    )
  },
  decorators: [withCompany('group')],
}

// Interactive: trigger toggles open/close, exercises the real focus trap.
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div className="relative bg-steel-950 p-4">
        <button ref={triggerRef} type="button" onClick={() => setOpen((v) => !v)} className="text-steel-50">
          Products
        </button>
        <MegaPanel id="story-mega-panel-interactive" open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} columns={COLUMNS} />
      </div>
    )
  },
  decorators: [withCompany('group')],
}
