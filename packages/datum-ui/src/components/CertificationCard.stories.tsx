import type { Meta, StoryObj } from '@storybook/react'
import { CertificationCard } from './CertificationCard'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof CertificationCard> = {
  title: 'Datum/CertificationCard',
  component: CertificationCard,
}
export default meta
type Story = StoryObj<typeof CertificationCard>

export const Dhruv: Story = {
  args: {
    stampCode: 'U2',
    name: 'ASME U2 Certificate of Authorization',
    scopeStatement: 'Authorized to fabricate ASME Sec. VIII Div. 2 pressure vessels',
    issuer: 'ASME, New York',
    validFrom: '2024-03-01',
    validTo: '2027-03-01',
    artifactUrl: 'https://example.com/certificates/u2.pdf',
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    stampCode: 'ISO-9001',
    name: 'ISO 9001:2015 Quality Management',
    scopeStatement:
      'Design and manufacture of metallic expansion joints and bellows for process industries',
    issuer: 'TÜV SÜD South Asia',
    validFrom: '2023-11-15',
    validTo: '2026-11-14',
    artifactUrl: 'https://example.com/certificates/iso9001.pdf',
  },
  decorators: [withCompany('precise')],
}

// No stamp mark, no artifact yet — scope + issuer + validity still mandatory
export const NoStampNoArtifact: Story = {
  args: {
    name: 'IBR Well-Known Workshop',
    scopeStatement: 'Recognized workshop for boiler pressure parts under the Indian Boiler Regulations',
    issuer: 'Central Boilers Board, Gujarat',
    validFrom: '2025-01-01',
  },
  decorators: [withCompany('dhruv')],
}
