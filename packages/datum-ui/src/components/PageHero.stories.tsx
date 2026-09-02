import type { Meta, StoryObj } from '@storybook/react'
import { PageHero } from './PageHero'
import { withCompany } from '../story-helpers'

// The photo child owns its own sizing (h-full w-full object-cover) — same
// convention as HomeHero/ProductHero's photo slots.
const photoFrame = (
  <div className="flex h-full w-full items-center justify-center bg-steel-800 font-mono text-helper text-steel-300">
    graded works photograph · full-bleed
  </div>
)

const meta: Meta<typeof PageHero> = {
  title: 'Datum/PageHero',
  component: PageHero,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof PageHero>

// Real copy, pulled directly from each live route this hero governs
// (Phase 11's fixture set — no production route touched, but every fixture
// below matches its real consumer's actual props exactly).

export const GroupAbout: Story = {
  args: {
    breadcrumbs: [{ label: 'Vedanta Group', href: '/' }, { label: 'About' }],
    eyebrow: 'The group',
    title: 'Two works, one record — since 1994.',
    lead: "Precise Engineers was established in 1994 at Vitthal Udyognagar GIDC, Anand, building metallic, rubber and fabric expansion joints to EJMA. The group's second works, Dhruv EPC Solutions at Manjusar GIDC, Savli, Vadodara, fabricates static equipment to ASME Sec. VIII Div. 1 & 2 under U, U2 and IBR authorizations.",
    photo: photoFrame,
  },
  decorators: [withCompany('group')],
}

export const GroupContact: Story = {
  args: {
    breadcrumbs: [{ label: 'Vedanta Group', href: '/' }, { label: 'Contact' }],
    eyebrow: 'Contact',
    title: 'Two works. Direct lines.',
    lead: 'Requirement with a drawing? The RFQ form routes it to the right engineering team. Everything else — phones, emails and works addresses for both companies are below.',
  },
  decorators: [withCompany('group')],
}

export const GroupCapabilitiesIndex: Story = {
  args: {
    breadcrumbs: [{ label: 'Vedanta Group', href: '/' }, { label: 'Capabilities' }],
    eyebrow: 'Process capability',
    title: 'Capabilities.',
    lead: 'What each works can actually build — the envelope figures behind every product claim. Bay dimensions, crane capacity, size ranges, WPS/PQR count and NDT scope, one page per process.',
    photo: photoFrame,
  },
  decorators: [withCompany('group')],
}

export const GroupProjects: Story = {
  args: {
    breadcrumbs: [{ label: 'Vedanta Group', href: '/' }, { label: 'Projects' }],
    eyebrow: 'Selected work',
    title: 'Projects.',
    lead: 'Real, attributable project records — scope, challenge, evidence — are in progress. In the meantime, send us your drawing and an engineer will point you to relevant past work directly.',
  },
  decorators: [withCompany('group')],
}

// Short breadcrumb (2 items), no photo — the legal pages' actual live state.
export const GroupPrivacy: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Privacy' }],
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lead: 'How we handle the personal data and technical documents you send us through this site.',
  },
  decorators: [withCompany('group')],
}

export const GroupTerms: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Terms' }],
    eyebrow: 'Legal',
    title: 'Terms of Use',
    lead: 'The basis on which the technical information published here is provided.',
  },
  decorators: [withCompany('group')],
}

export const DhruvCompany: Story = {
  args: {
    breadcrumbs: [{ label: 'Dhruv EPC', href: '/dhruv-epc' }, { label: 'Company' }],
    eyebrow: 'Company',
    title: 'A static-equipment works built on verifiable authorizations.',
    lead: 'Dhruv EPC Solutions Pvt. Ltd. fabricates pressure vessels, heat exchangers, process skids and heavy fabrication to ASME Sec. VIII Div. 1 & 2 at Manjusar GIDC, Savli, Vadodara — under ASME U and U2 Certificates of Authorization, IBR approval and an ISO 9001:2015 quality system.',
    photo: photoFrame,
  },
  decorators: [withCompany('dhruv')],
}

export const PreciseCompany: Story = {
  args: {
    breadcrumbs: [
      { label: 'Precise Engineers', href: '/precise-engineers' },
      { label: 'Company' },
    ],
    eyebrow: 'Company',
    title: 'Expansion joints from Anand since 1994.',
    lead: 'Precise Engineers was established at Vitthal Udyognagar GIDC, Anand, Gujarat, in 1994. The works designs and manufactures metallic, rubber and fabric expansion joints to EJMA — circular 80 to 8,000 mm NB — as an EIL approved unit with an ISO 9001:2015 quality system, serving twelve sectors from oil & gas to the Department of Atomic Energy.',
    photo: photoFrame,
  },
  decorators: [withCompany('precise')],
}

// Product-category page — real consumer via lib/product-category-pages.tsx
// (shared template, both companies), long 3-item breadcrumb.
export const ProductCategory: Story = {
  args: {
    breadcrumbs: [
      { label: 'Dhruv EPC', href: '/dhruv-epc' },
      { label: 'Products', href: '/dhruv-epc/products' },
      { label: 'Static Equipment' },
    ],
    eyebrow: 'Products',
    title: 'Static Equipment',
    lead: 'Pressure vessels, heat exchangers and columns to ASME Sec. VIII Div. 1 & 2, up to 400 T.',
    photo: photoFrame,
  },
  decorators: [withCompany('dhruv')],
}

// No-photo fallback — not a theoretical case: every one of this component's
// current live consumers hits this path today (verified by reading them).
export const NoPhoto: Story = {
  args: {
    ...DhruvCompany.args,
    photo: undefined,
  },
  decorators: [withCompany('dhruv')],
}

const { breadcrumbs: _b, ...dhruvNoBreadcrumb } = DhruvCompany.args ?? {}
export const NoBreadcrumb: Story = {
  args: dhruvNoBreadcrumb,
  decorators: [withCompany('dhruv')],
}

// Long breadcrumb + long eyebrow/title — real longest strings this
// component's actual consumers use, not lorem ipsum (§per this project's
// own convention). Wrapping/320px behavior is a Phase 22 cross-cutting
// re-check, but this fixture exists here for isolated validation now.
export const LongBreadcrumbAndTitle: Story = {
  args: {
    breadcrumbs: [
      { label: 'Vedanta Group', href: '/' },
      { label: 'Capabilities', href: '/capabilities' },
      { label: 'Bellows Forming & Circumferential Welding' },
    ],
    eyebrow: 'Process capability · Metallic bellows forming bay',
    title: 'Hydraulic bellows forming and circumferential welding to EJMA 10th edition tolerances',
    lead: 'Single and multi-ply forming up to DN 6,000, TIG/plasma circumferential welds inspected to 100% RT/UT per the design code.',
    photo: photoFrame,
  },
  decorators: [withCompany('precise')],
}
