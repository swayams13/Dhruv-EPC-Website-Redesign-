import type { Meta, StoryObj } from '@storybook/react'
import { ProjectCard } from './ProjectCard'
import { withCompany } from '../story-helpers'

const photoFrame = (
  <div className="flex h-full w-full items-center justify-center bg-steel-200 font-mono text-helper text-steel-500">
    project photograph · 4:3
  </div>
)

const meta: Meta<typeof ProjectCard> = {
  title: 'Datum/ProjectCard',
  component: ProjectCard,
}
export default meta
type Story = StoryObj<typeof ProjectCard>

export const Dhruv: Story = {
  args: {
    title: 'Ammonia converter basket, PSU fertilizer plant',
    sector: 'Fertilizer · PSU',
    href: '/dhruv-epc/projects/ammonia-converter',
    photo: photoFrame,
    metrics: [
      { label: 'Weight', value: '212 T' },
      { label: 'Diameter', value: 'Ø 3,600 mm' },
      { label: 'MOC', value: 'SA-516 Gr.70' },
    ],
  },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    title: 'FCC unit expansion joints, refinery revamp',
    sector: 'Refinery · EPC',
    href: '/precise-engineers/projects/fcc-expansion-joints',
    photo: photoFrame,
    metrics: [
      { label: 'Size', value: 'DN 2,400' },
      { label: 'Design temp', value: '750 °C' },
      { label: 'MOC', value: 'Inconel 625' },
    ],
  },
  decorators: [withCompany('precise')],
}

export const NoPhoto: Story = {
  args: {
    title: 'Urea reactor internals replacement',
    sector: 'Fertilizer · PSU',
    href: '#urea',
    metrics: [
      { label: 'Weight', value: '48 T' },
      { label: 'MOC', value: '25-22-2 Cr-Ni-Mo' },
    ],
  },
  decorators: [withCompany('dhruv')],
}
