import type { Meta, StoryObj } from '@storybook/react'
import { HomeHero } from './HomeHero'
import { withCompany } from '../story-helpers'

// The photo child owns its own aspect ratio/sizing (it's a plain grid-cell
// child under Hero C, not a photo-ground layer) — portrait 4:5 per Decision 2.
const photoFrame = (
  <div className="flex h-full w-full items-center justify-center bg-steel-800 font-mono text-helper text-steel-300">
    graded works photograph · 4:5 portrait
  </div>
)

const meta: Meta<typeof HomeHero> = {
  title: 'Datum/HomeHero',
  component: HomeHero,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof HomeHero>

// Group home — no breadcrumb (top-level page), 600px panel height.
export const Group: Story = {
  args: {
    variant: 'split',
    eyebrow: 'ASME U & U2 · IBR · Est. 1994',
    headline: 'Precision fabrication and flow-control engineering since 1994.',
    subhead:
      'Two specialized works in Gujarat: static equipment to ASME Sec. VIII at Vadodara, and expansion joints to EJMA at Anand — one group, one quality system.',
    rfq: { label: 'Request a quote', href: '/request-a-quote' },
    secondary: { label: 'View products', href: '#products' },
    photo: photoFrame,
    dimensionLabel: 'Ø 5,000 mm max shell',
  },
  decorators: [withCompany('group')],
}

// Dhruv EPC home — breadcrumb present, 560px panel height.
export const Dhruv: Story = {
  args: {
    variant: 'split',
    breadcrumb: [{ label: 'Home', href: '/' }, { label: 'Dhruv EPC Solutions' }],
    eyebrow: 'ASME U & U2 · IBR · Est. Vadodara',
    headline: 'Pressure vessels and heat exchangers to ASME code',
    subhead:
      'Carbon, low-alloy and stainless fabrication for fertilizer, refinery and petrochemical plants — single pieces up to 250 T.',
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=dhruv-epc' },
    secondary: { label: 'View equipment', href: '#equipment' },
    photo: photoFrame,
    dimensionLabel: 'Ø 3,600 mm',
  },
  decorators: [withCompany('dhruv')],
}

// Precise Engineers home — breadcrumb present, 560px panel height.
export const Precise: Story = {
  args: {
    variant: 'split',
    breadcrumb: [{ label: 'Home', href: '/' }, { label: 'Precise Engineers' }],
    eyebrow: 'EJMA 10th ed. · IBR · Est. Vadodara',
    headline: 'Metallic expansion joints engineered to EJMA',
    subhead:
      'Single and multi-ply bellows DN 50–6,000 in stainless, Inconel and titanium for refinery, power and steel plants.',
    rfq: { label: 'Request a quote', href: '/request-a-quote?company=precise-engineers' },
    secondary: { label: 'View products', href: '#products' },
    photo: photoFrame,
    dimensionLabel: 'DN 2,400',
  },
  decorators: [withCompany('precise')],
}

// Photograph is real or absent — never stock (§4.1); absent renders the
// §4.2 hatch placeholder, not a broken/empty panel.
export const NoPhoto: Story = {
  args: {
    ...Dhruv.args,
    photo: undefined,
  },
  decorators: [withCompany('dhruv')],
}

const { breadcrumb: _b, ...dhruvNoBreadcrumb } = Dhruv.args ?? {}
export const NoBreadcrumb: Story = {
  args: dhruvNoBreadcrumb,
  decorators: [withCompany('dhruv')],
}
