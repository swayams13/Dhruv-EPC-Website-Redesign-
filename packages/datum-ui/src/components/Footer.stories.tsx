import type { Meta, StoryObj } from '@storybook/react'
import type { EntityRecord } from '@vedanta/schemas'
import { Footer } from './Footer'
import { withCompany } from '../story-helpers'

// Demo EntityRecord — pages load the real singleton from the CMS
const dhruvEntity: EntityRecord = {
  companySlug: 'dhruv-epc',
  legalName: 'Dhruv EPC Private Limited',
  cin: 'U28110GJ2001PTC000000',
  gst: '24AAACD0000A1Z0',
  worksAddresses: [
    {
      label: 'Works',
      address: 'Plot 512, Manjusar GIDC, Savli, Vadodara 391775, Gujarat, India',
    },
  ],
  registeredOffice: '2nd Floor, Alkapuri Arcade, R.C. Dutt Road, Vadodara 390007',
  phones: ['+91 265 600 0000'],
  emails: ['sales@dhruvepc.com'],
  stampsHeld: ['U', 'U2', 'IBR', 'ISO-9001', 'ISO-14001', 'ISO-45001'],
  whatsapp: '+91 98250 00000',
  contentRevisedDate: '2026-07-01',
}

const preciseEntity: EntityRecord = {
  companySlug: 'precise-engineers',
  legalName: 'Precise Engineers',
  worksAddresses: [
    {
      label: 'Works',
      address: 'Plot 218, Manjusar GIDC, Savli, Vadodara 391775, Gujarat, India',
    },
  ],
  registeredOffice: 'Plot 218, Manjusar GIDC, Savli, Vadodara 391775',
  phones: ['+91 265 600 0001'],
  emails: ['sales@preciseengineers.in'],
  stampsHeld: ['IBR', 'ISO-9001'],
  contentRevisedDate: '2026-06-15',
}

const columns = [
  {
    heading: 'Equipment',
    links: [
      { label: 'Heat exchangers', href: '#he' },
      { label: 'Pressure vessels', href: '#pv' },
      { label: 'Process skids', href: '#skids' },
    ],
  },
  {
    heading: 'Capabilities',
    links: [
      { label: 'Capability matrix', href: '#matrix' },
      { label: 'Quality & NDT', href: '#qa' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Certifications', href: '#certs' },
      { label: 'Clients', href: '#clients' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

const meta: Meta<typeof Footer> = {
  title: 'Datum/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Footer>

export const Dhruv: Story = {
  args: {
    entity: dhruvEntity,
    columns,
    certificationsHref: '/dhruv-epc/certifications',
    privacyHref: '/privacy',
    termsHref: '/terms',
    linkedinHref: 'https://www.linkedin.com/company/dhruv-epc',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    entity: preciseEntity,
    columns,
    certificationsHref: '/precise-engineers/certifications',
    privacyHref: '/privacy',
    termsHref: '/terms',
  },
  decorators: [withCompany('precise')],
}
