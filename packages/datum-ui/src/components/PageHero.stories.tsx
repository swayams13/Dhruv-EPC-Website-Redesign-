import type { Meta, StoryObj } from '@storybook/react'
import { PageHero } from './PageHero'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof PageHero> = {
  title: 'Datum/PageHero',
  component: PageHero,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof PageHero>

export const Dhruv: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', href: '/dhruv-epc' }, { label: 'Certifications' }],
    eyebrow: 'Proof',
    title: 'Certifications & authorizations',
    lead: 'Every credential on this page carries its scope, issuer and validity — and links to the certificate artifact.',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', href: '/precise-engineers' }, { label: 'Company' }],
    eyebrow: 'Company',
    title: 'Built on measured claims',
    lead: 'Expansion joints and bellows engineered, formed and tested in Vadodara since 2001.',
  },
  decorators: [withCompany('precise')],
}
