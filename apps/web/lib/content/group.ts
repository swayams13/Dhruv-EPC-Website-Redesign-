// Seeded CMS content — Vedanta Group (Session 8, group home §6.1).
// Zod-parsed at module load (validation-as-law, TRD §T-3).
//
// SOURCING (CLAUDE.md: no invented claims):
// - [source: vedantagroup.net] fetched 2026-07-10 (Dhruv pages) and
//   2026-07-11 (group home, precise-engineers pages).
// - DEMO-PLACEHOLDER figures per Swayam's prototype approval (2026-07-10).

import { EntityRecord } from '@vedanta/schemas'
import type { ExplodedFrame } from '../../components/ExplodedSequence'

export const groupEntity = EntityRecord.parse({
  companySlug: 'group',
  legalName: 'Vedanta Group of Companies', // [source: vedantagroup.net]
  worksAddresses: [
    // [source: vedantagroup.net about-us.php + precise-engineers/about-us.php]
    { label: 'Dhruv EPC Works', address: 'Manjusar GIDC, Savli, Vadodara, Gujarat' },
    { label: 'Precise Engineers Works', address: '705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat' },
  ],
  registeredOffice:
    '705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat, India', // [source: vedantagroup.net]
  phones: ['+918905917700', '+919377773186'], // [source: vedantagroup.net — Dhruv + Precise primaries]
  emails: ['vedant@vedantagroup.net', 'rajesh@vedantagroup.net'], // [source: vedantagroup.net]
  // Union of stamps held across the group, canonical §12 codes — all sourced
  stampsHeld: ['U', 'U2', 'IBR', 'ISO-9001', 'ISO-14001', 'ISO-45001'],
  contentRevisedDate: '2026-07-11',
})

// Exploded-view heat-exchanger frame sequence — group home hero photo band.
// docs/design.md + docs/decisions.md [2026-07-16]: photorealistic AI-render
// override, approved for this feature only. Frames go under
// apps/web/public/exploded/heat-exchanger/ — see
// docs/exploded-view-image-generation-guide.md for exact filenames/specs.
// ═══ PLACEHOLDER PATHS — swap in real generated frames before launch ═══
export const groupExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/heat-exchanger/frame-01.avif', webp: '/exploded/heat-exchanger/frame-01.webp' },
  { avif: '/exploded/heat-exchanger/frame-02.avif', webp: '/exploded/heat-exchanger/frame-02.webp' },
  { avif: '/exploded/heat-exchanger/frame-03.avif', webp: '/exploded/heat-exchanger/frame-03.webp' },
  { avif: '/exploded/heat-exchanger/frame-04.avif', webp: '/exploded/heat-exchanger/frame-04.webp' },
]

// §6.1 group stats band — combined mono figures, each sourced.
export const groupStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' }, // [source: vedantagroup.net]
  { value: '2 works', label: 'Vadodara · Anand', source: 'Manjusar GIDC · V.U.Nagar GIDC' }, // [source: vedantagroup.net]
  { value: 'U · U2 · IBR', label: 'Stamps held' }, // [source: vedantagroup.net]
  { value: '12 sectors', label: 'Oil & gas to atomic energy' }, // [source: vedantagroup.net sector lists]
]
