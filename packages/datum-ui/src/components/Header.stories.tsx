import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'
import { withCompany } from '../story-helpers'

// §2.2: monochrome text lockup — the real mark lands with brand assets
const dhruvLogo = <span className="font-display text-h4 font-semibold">Dhruv EPC</span>
const preciseLogo = <span className="font-display text-h4 font-semibold">Precise Engineers</span>

const dhruvGroups = [
  {
    label: 'Static equipment',
    items: [
      {
        name: 'Shell & tube heat exchangers',
        scope: 'ASME U/U2, up to 250 T',
        href: '#heat-exchangers',
      },
      { name: 'Pressure vessels', scope: 'Sec. VIII Div. 1 & 2', href: '#pressure-vessels' },
      { name: 'Columns & reactors', scope: 'Up to Ø 4,000 mm', href: '#columns' },
    ],
  },
  {
    label: 'Skids & packages',
    items: [
      { name: 'Process skids', scope: 'Modular, up to 40 T assembled', href: '#skids' },
      { name: 'Storage tanks', scope: 'API 650, site & shop built', href: '#tanks' },
    ],
  },
  {
    label: 'Fabrication & machining',
    items: [
      { name: 'Heavy fabrication', scope: 'Single piece up to 250 T', href: '#fabrication' },
      { name: 'CNC machining', scope: 'Table up to 4,000 mm', href: '#machining' },
    ],
  },
]

const preciseGroups = [
  {
    label: 'Expansion joints',
    items: [
      { name: 'Metallic bellows', scope: 'DN 50–6,000, EJMA 10th ed.', href: '#bellows' },
      { name: 'Fabric expansion joints', scope: 'Up to 1,000 °C flue gas', href: '#fabric' },
    ],
  },
  {
    label: 'Flow control',
    items: [{ name: 'Dampers & diverters', scope: 'Up to DN 4,000', href: '#dampers' }],
  },
]

const meta: Meta<typeof Header> = {
  title: 'Datum/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Header>

export const Dhruv: Story = {
  args: {
    logo: dhruvLogo,
    homeHref: '/dhruv-epc',
    menuLabel: 'Equipment',
    menuGroups: dhruvGroups,
    capabilityRail: { label: 'Max sizes, materials & codes', href: '#capability-matrix' },
    links: [
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Projects', href: '#projects' },
      { label: 'Company', href: '#company' },
    ],
    phoneHref: 'tel:+912656000000',
    whatsappHref: 'https://wa.me/912656000000',
    rfqHref: '/request-a-quote?company=dhruv-epc',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    ...Dhruv.args,
    logo: preciseLogo,
    homeHref: '/precise-engineers',
    menuLabel: 'Products',
    menuGroups: preciseGroups,
    rfqHref: '/request-a-quote?company=precise-engineers',
  },
  decorators: [withCompany('precise')],
}

const groupMegaPanel = [
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

export const Group: Story = {
  args: {
    logo: <span className="font-display text-h4 font-extrabold">VEDANTA</span>,
    homeHref: '/',
    menuLabel: 'Products',
    megaPanel: groupMegaPanel,
    links: [
      { label: 'Industries', href: '#industries' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Projects', href: '#projects' },
      { label: 'Company', href: '#company' },
    ],
    utilityBar: [
      { label: 'Dhruv EPC Solutions', href: '#dhruv-epc' },
      { label: 'Precise Engineers', href: '#precise-engineers' },
    ],
    rfqHref: '/request-a-quote',
  },
  decorators: [withCompany('group')],
}
