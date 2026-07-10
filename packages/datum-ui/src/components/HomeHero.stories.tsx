import type { Meta, StoryObj } from '@storybook/react'
import { HomeHero } from './HomeHero'
import { withCompany } from '../story-helpers'

const photoFrame = (
  <div className="flex h-full w-full items-center justify-center bg-steel-800 font-mono text-helper text-steel-500">
    graded works photograph · full-bleed
  </div>
)

const meta: Meta<typeof HomeHero> = {
  title: 'Datum/HomeHero',
  component: HomeHero,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof HomeHero>

export const Dhruv: Story = {
  args: {
    eyebrow: 'ASME U & U2 · IBR · Est. Vadodara',
    headline: 'Pressure vessels and heat exchangers to ASME code',
    subhead:
      'Carbon, low-alloy and stainless fabrication for fertilizer, refinery and petrochemical plants — single pieces up to 250 T.',
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=dhruv-epc' },
    secondary: { label: 'View equipment', href: '#equipment' },
    photo: photoFrame,
    dimensionLabel: 'Ø 3,600 mm',
    stats: [
      { value: '38 yrs', label: 'In fabrication', source: 'Incorporated 1988' },
      { value: '250 T', label: 'Max single piece', source: 'Crane capacity record' },
      { value: 'Ø 4,000 mm', label: 'Max diameter', source: 'Shop envelope' },
      { value: '6', label: 'Sectors served', source: 'Client register, 2026' },
    ],
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    eyebrow: 'EJMA 10th ed. · IBR · Est. Vadodara',
    headline: 'Metallic expansion joints engineered to EJMA',
    subhead:
      'Single and multi-ply bellows DN 50–6,000 in stainless, Inconel and titanium for refinery, power and steel plants.',
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=precise-engineers' },
    secondary: { label: 'View products', href: '#products' },
    photo: photoFrame,
    dimensionLabel: 'DN 2,400',
    stats: [
      { value: '25 yrs', label: 'In expansion joints', source: 'Incorporated 2001' },
      { value: 'DN 6,000', label: 'Max bellows size', source: 'Forming envelope' },
      { value: '750 °C', label: 'Max design temp', source: 'EJMA 10th ed. designs' },
      { value: '4', label: 'Sectors served', source: 'Client register, 2026' },
    ],
  },
  decorators: [withCompany('precise')],
}

// Photograph is real or absent — never stock (§19)
const { photo: _p, dimensionLabel: _d, ...dhruvNoPhoto } = Dhruv.args ?? {}
export const NoPhoto: Story = {
  args: dhruvNoPhoto,
  decorators: [withCompany('dhruv')],
}
