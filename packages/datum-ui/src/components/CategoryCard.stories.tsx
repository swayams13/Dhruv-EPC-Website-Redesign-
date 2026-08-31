import type { Meta, StoryObj } from '@storybook/react'
import { CategoryCard } from './CategoryCard'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof CategoryCard> = {
  title: 'Datum/CategoryCard',
  component: CategoryCard,
}
export default meta
type Story = StoryObj<typeof CategoryCard>

export const Dhruv: Story = {
  args: {
    name: 'Static Equipment',
    oneLineScope: 'Pressure vessels, heat exchangers and storage tanks to ASME Sec. VIII Div. 1 & 2, up to 400 T',
    href: '/dhruv-epc/products/static-equipment',
    productCount: 3,
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    name: 'Expansion Joints',
    oneLineScope: 'Metallic, rubber and fabric expansion joints, 25 – 9,000 mm NB',
    href: '/precise-engineers/products/expansion-joints',
    productCount: 6,
  },
  decorators: [withCompany('precise')],
}

export const DhruvDark: Story = {
  args: {
    name: 'Fabrication & Machining',
    oneLineScope: 'Heavy fabrication, machining and plate flanges up to 200 T per unit',
    href: '/dhruv-epc/products/fabrication-machining',
    productCount: 3,
    onDark: true,
  },
  decorators: [withCompany('dhruv')],
}

export const PreciseDark: Story = {
  args: {
    name: 'Flow Control',
    oneLineScope: 'Zero velocity valves, check valves and dampers, 50 – 1,200 mm NB',
    href: '/precise-engineers/products/flow-control',
    productCount: 3,
    onDark: true,
  },
  decorators: [withCompany('precise')],
}

// Thin state — a category with no published products yet (§16 launch-gate
// precedent): renders muted, non-interactive, never a dead link to an empty index.
export const Thin: Story = {
  args: {
    name: 'Resources',
    oneLineScope: 'Brochures, datasheets and technical notes',
    href: '/dhruv-epc/products/resources',
    productCount: 0,
  },
  decorators: [withCompany('dhruv')],
}

export const ThinDark: Story = {
  args: {
    name: 'Resources',
    oneLineScope: 'Brochures, datasheets and technical notes',
    href: '/precise-engineers/products/resources',
    productCount: 0,
    onDark: true,
  },
  decorators: [withCompany('precise')],
}

// §16 grid: 3-up desktop / 2-up tablet / 1-up mobile, 32px gaps, equal heights
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <CategoryCard
        name="Static Equipment"
        oneLineScope="Pressure vessels, heat exchangers and storage tanks to ASME Sec. VIII Div. 1 & 2, up to 400 T"
        href="#static-equipment"
        productCount={3}
      />
      <CategoryCard
        name="Skids & Packages"
        oneLineScope="Skid-mounted process packages and pipe spools to ASME B31.3, NPS ½ to NPS 48"
        href="#skids-packages"
        productCount={2}
      />
      <CategoryCard
        name="Fabrication & Machining"
        oneLineScope="Heavy fabrication, machining and plate flanges up to 200 T per unit"
        href="#fabrication-machining"
        productCount={3}
      />
    </div>
  ),
  decorators: [withCompany('dhruv')],
}
