import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'
import { withCompany } from '../story-helpers'

// Real works photography only (§2.1) — stories show the frame with an honest
// placeholder block; pages pass next/image with CMS alt text.
const photoFrame = (
  <div className="flex h-full w-full items-center justify-center bg-steel-200 font-mono text-helper text-steel-500">
    works photograph · 4:3
  </div>
)

const meta: Meta<typeof ProductCard> = {
  title: 'Datum/ProductCard',
  component: ProductCard,
}
export default meta
type Story = StoryObj<typeof ProductCard>

export const Dhruv: Story = {
  args: {
    name: 'Shell & tube heat exchangers',
    oneLineScope: 'Shell & tube, ASME U/U2, up to 250 T',
    href: '/dhruv-epc/heat-exchangers',
    photo: photoFrame,
    chips: ['≤ 250 T', 'Ø 4,000 mm', 'ASME U/U2'],
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    name: 'Metallic expansion bellows',
    oneLineScope: 'Single & multi-ply, DN 50–6,000, EJMA 10th ed.',
    href: '/precise-engineers/metallic-bellows',
    photo: photoFrame,
    chips: ['DN 50–6,000', 'EJMA 10th'],
  },
  decorators: [withCompany('precise')],
}

// onDark variants — dark ground for premium equipment grids (§T-2)
export const DhruvDark: Story = {
  args: {
    name: 'Shell & tube heat exchangers',
    oneLineScope: 'Shell & tube, ASME U/U2, up to 250 T',
    href: '/dhruv-epc/heat-exchangers',
    photo: photoFrame,
    chips: ['≤ 250 T', 'Ø 4,000 mm', 'ASME U/U2'],
    onDark: true,
  },
  decorators: [withCompany('dhruv')],
}

export const PreciseDark: Story = {
  args: {
    name: 'Metallic expansion bellows',
    oneLineScope: 'Single & multi-ply, DN 50–6,000, EJMA 10th ed.',
    href: '/precise-engineers/metallic-bellows',
    photo: photoFrame,
    chips: ['DN 50–6,000', 'EJMA 10th'],
    onDark: true,
  },
  decorators: [withCompany('precise')],
}

// No-photo variant — a missing photo never renders a stock placeholder
export const NoPhoto: Story = {
  args: {
    name: 'Pressure vessels',
    oneLineScope: 'ASME Sec. VIII Div. 1 & 2, up to 120 mm shell',
    href: '/dhruv-epc/pressure-vessels',
    chips: ['Div. 1 & 2', '≤ 120 mm'],
  },
  decorators: [withCompany('dhruv')],
}

// §16 grid: 3-up desktop / 2-up tablet / 1-up mobile, 32px gaps, equal heights
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <ProductCard
        name="Shell & tube heat exchangers"
        oneLineScope="Shell & tube, ASME U/U2, up to 250 T"
        href="#he"
        photo={photoFrame}
        chips={['≤ 250 T', 'Ø 4,000 mm', 'ASME U/U2']}
      />
      <ProductCard
        name="Pressure vessels"
        oneLineScope="ASME Sec. VIII Div. 1 & 2, up to 120 mm shell"
        href="#pv"
        photo={photoFrame}
        chips={['Div. 1 & 2', '≤ 120 mm']}
      />
      <ProductCard
        name="Process skids"
        oneLineScope="Modular skids up to 40 T shipped assembled"
        href="#skids"
        chips={['≤ 40 T']}
      />
    </div>
  ),
  decorators: [withCompany('dhruv')],
}
