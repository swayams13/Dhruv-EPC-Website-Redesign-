import type { Meta, StoryObj } from '@storybook/react'
import type { Approval } from '@vedanta/schemas'
import { ApprovalsMatrix } from './ApprovalsMatrix'
import { withCompany } from '../story-helpers'

const approvals: Approval[] = [
  {
    companySlug: 'dhruv-epc',
    approvingOrg: 'Engineers India Limited (EIL)',
    entityClass: 'TPIA',
    category: 'Pressure vessels & heat exchangers',
    year: 2023,
  },
  {
    companySlug: 'dhruv-epc',
    approvingOrg: 'BHEL',
    entityClass: 'PSU',
    category: 'Heavy fabrication',
    year: 2021,
  },
  {
    companySlug: 'dhruv-epc',
    approvingOrg: 'IOCL',
    entityClass: 'PSU',
    year: 2022,
  },
  {
    companySlug: 'dhruv-epc',
    approvingOrg: 'Technip Energies',
    entityClass: 'EPC',
    category: 'Static equipment',
    year: 2024,
  },
  {
    companySlug: 'dhruv-epc',
    approvingOrg: 'Lloyd’s Register',
    entityClass: 'TPIA',
    category: 'Shop inspection',
    year: 2020,
  },
]

const meta: Meta<typeof ApprovalsMatrix> = {
  title: 'Datum/ApprovalsMatrix',
  component: ApprovalsMatrix,
}
export default meta
type Story = StoryObj<typeof ApprovalsMatrix>

export const Dhruv: Story = {
  args: { approvals, caption: 'Vendor approvals — grouped by approving entity class' },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    approvals: approvals.map((a) => ({ ...a, companySlug: 'precise-engineers' as const })),
  },
  decorators: [withCompany('precise')],
}
