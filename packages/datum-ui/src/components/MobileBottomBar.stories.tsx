import type { Meta, StoryObj } from '@storybook/react'
import { MobileBottomBar } from './MobileBottomBar'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof MobileBottomBar> = {
  title: 'Datum/MobileBottomBar',
  component: MobileBottomBar,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
}
export default meta
type Story = StoryObj<typeof MobileBottomBar>

export const Dhruv: Story = {
  args: {
    phoneHref: 'tel:+912656000000',
    whatsappHref: 'https://wa.me/912656000000',
    rfqHref: '/request-a-quote?company=dhruv-epc',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    phoneHref: 'tel:+912656000001',
    whatsappHref: 'https://wa.me/912656000001',
    rfqHref: '/request-a-quote?company=precise-engineers',
  },
  decorators: [withCompany('precise')],
}
