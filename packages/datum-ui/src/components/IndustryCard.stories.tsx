import type { Meta, StoryObj } from '@storybook/react'
import { IndustryCard } from './IndustryCard'

const meta: Meta<typeof IndustryCard> = {
  title: 'Datum/IndustryCard',
  component: IndustryCard,
}
export default meta
type Story = StoryObj<typeof IndustryCard>

// No company decorator anywhere in this file — IndustryCard takes no
// company accent, so `withCompany(...)` (used by CategoryCard/ProductCard
// stories) does not apply here (§03).

export const Default: Story = {
  args: {
    name: 'Oil & Gas',
    index: '01',
    href: '/industries/oil-gas',
    servedBy: ['dhruv', 'precise'],
    projectCount: 12,
  },
}

export const SingleWorks: Story = {
  args: {
    name: 'Water Infrastructure',
    index: '05',
    href: '/industries/water-infrastructure',
    servedBy: ['precise'],
    projectCount: 4,
  },
}

export const OnDark: Story = {
  args: {
    name: 'Refining & Petrochemical',
    index: '02',
    href: '/industries/refining-petrochemical',
    servedBy: ['dhruv'],
    projectCount: 7,
    onDark: true,
  },
}

// Thin state — an industry with zero linked projects yet: muted,
// non-interactive, never a dead link to an empty index (same law as
// CategoryCard's thin state).
export const Thin: Story = {
  args: {
    name: 'Fertilizer & Chemicals',
    index: '03',
    href: '/industries/fertilizer-chemicals',
    servedBy: ['dhruv', 'precise'],
    projectCount: 0,
  },
}

export const ThinOnDark: Story = {
  args: {
    name: 'Fertilizer & Chemicals',
    index: '03',
    href: '/industries/fertilizer-chemicals',
    servedBy: ['dhruv', 'precise'],
    projectCount: 0,
    onDark: true,
  },
}

// Compact — denser index+name only, for the footer sector list.
export const Compact: Story = {
  args: {
    name: 'Power',
    index: '04',
    href: '/industries/power',
    servedBy: ['dhruv', 'precise'],
    projectCount: 9,
    compact: true,
  },
}

export const CompactOnDark: Story = {
  args: {
    name: 'Power',
    index: '04',
    href: '/industries/power',
    servedBy: ['dhruv', 'precise'],
    projectCount: 9,
    compact: true,
    onDark: true,
  },
}

export const CompactThin: Story = {
  args: {
    name: 'Marine',
    index: '06',
    href: '/industries/marine',
    servedBy: ['dhruv'],
    projectCount: 0,
    compact: true,
  },
}

// §16-equivalent grid: 3-up desktop / 2-up tablet / 1-up mobile.
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <IndustryCard name="Oil & Gas" index="01" href="#oil-gas" servedBy={['dhruv', 'precise']} projectCount={12} />
      <IndustryCard
        name="Refining & Petrochemical"
        index="02"
        href="#refining-petrochemical"
        servedBy={['dhruv']}
        projectCount={7}
      />
      <IndustryCard
        name="Fertilizer & Chemicals"
        index="03"
        href="#fertilizer-chemicals"
        servedBy={['dhruv', 'precise']}
        projectCount={5}
      />
    </div>
  ),
}
