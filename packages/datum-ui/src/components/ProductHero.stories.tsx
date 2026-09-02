import type { Meta, StoryObj } from '@storybook/react'
import { ProductHero } from './ProductHero'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof ProductHero> = {
  title: 'Datum/ProductHero',
  component: ProductHero,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof ProductHero>

export const Dhruv: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', href: '/dhruv-epc' },
      { label: 'Equipment', href: '/dhruv-epc/equipment' },
      { label: 'Heat exchangers' },
    ],
    title: 'Shell & tube heat exchangers — ASME U-Stamp',
    valueStatement:
      'ASME Sec. VIII Div. 1 & 2 and TEMA-class exchangers in CS, LAS, SS and duplex — fixed, floating-head and U-tube, up to 250 T.',
    chips: ['≤ 250 T', 'Ø 4,000 mm', 'CS · LAS · SS · duplex', 'ASME U/U2 · TEMA'],
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=dhruv-epc' },
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', href: '/precise-engineers' },
      { label: 'Products', href: '/precise-engineers/products' },
      { label: 'Metallic bellows' },
    ],
    title: 'Metallic expansion bellows — EJMA 10th edition',
    valueStatement:
      'Single and multi-ply bellows DN 50–6,000 in SS 304/316/321, Inconel 625 and titanium, design temperatures to 750 °C.',
    chips: ['DN 50–6,000', '≤ 750 °C', 'SS · Inconel · Ti', 'EJMA 10th'],
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=precise-engineers' },
  },
  decorators: [withCompany('precise')],
}
