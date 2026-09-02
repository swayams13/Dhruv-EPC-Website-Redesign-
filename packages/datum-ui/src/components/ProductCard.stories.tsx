import type { Meta, StoryObj } from '@storybook/react'
import { DomainIcon } from './DomainIcon'
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

// Icon variant — §12 domain icon as the interim visual until the works shoot
// (2026-07-16, ui-ux-review §5). Icon ignored once a photo is passed.
export const WithIcon: Story = {
  args: {
    name: 'Metallic bellows expansion joints',
    oneLineScope: 'EJMA/ASME B31.3, 80 – 8,000 mm NB circular',
    href: '/precise-engineers/products/metallic-bellows-expansion-joint',
    icon: <DomainIcon name="bellows" size={32} />,
    chips: ['80 – 8,000 mm NB', 'EJMA'],
  },
  decorators: [withCompany('precise')],
}

export const WithIconDark: Story = {
  args: {
    name: 'Pressure vessels',
    oneLineScope: 'Reactors, columns and drums to ASME Sec. VIII Div. 1 & 2',
    href: '/dhruv-epc/equipment/pressure-vessels',
    icon: <DomainIcon name="vessel" size={32} />,
    chips: ['Div. 1 & 2', 'U/U2'],
    onDark: true,
  },
  decorators: [withCompany('dhruv')],
}

// layout="spec" (ref `1j`) — the no-photo device for lines the shoot doesn't
// cover: 3px accent top border, a 3-row spec <dl>, mono position index. Not
// wired to a live consumer yet (that's a later phase's page work).
export const SpecLayout: Story = {
  args: {
    name: 'Process skids',
    oneLineScope: 'Modular skids up to 40 T shipped assembled',
    href: '/dhruv-epc/process-skids',
    layout: 'spec',
    specRows: [
      { label: 'Max weight', value: '40 T' },
      { label: 'Code', value: 'ASME B31.3' },
      { label: 'Materials', value: 'CS · SS · duplex' },
    ],
    index: '03 / 12',
  },
  decorators: [withCompany('dhruv')],
}

export const SpecLayoutDark: Story = {
  args: {
    ...SpecLayout.args,
    onDark: true,
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
