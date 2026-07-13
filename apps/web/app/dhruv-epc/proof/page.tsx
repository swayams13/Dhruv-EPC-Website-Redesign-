// Dhruv EPC Proof hub — Datum §20 (certifications, approvals, TPI agencies).
// Content from lib/content/dhruv-epc (Zod-parsed). No ClientWall or Testimonials
// — no Client/Testimonial records exist for Dhruv (CLAUDE.md: no fabricated data).
import type { Metadata } from 'next'
import { ApprovalsMatrix, CertificationCard, MobileBottomBar, PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  dhruvApprovals,
  dhruvCertifications,
  dhruvPhoneHref,
  dhruvWhatsappHref,
} from '../../../lib/content/dhruv-epc'

export const metadata: Metadata = {
  title: 'Proof — Certifications & Approvals | Dhruv EPC',
  description:
    'ASME U and U2 Certificates of Authorization, IBR approval, ISO 9001:2015 quality system, and third-party inspection under LRS, BV, and DNV — all credentials independently verifiable with the issuing authority.',
}

// ponytail: mirrors the STAMP_BY_NAME pattern from dhruv-epc/page.tsx
const STAMP_BY_NAME: Record<string, 'U' | 'U2' | 'IBR' | 'ISO-9001' | undefined> = {
  'ASME U Certificate of Authorization': 'U',
  'ASME U2 Certificate of Authorization': 'U2',
  'IBR Approval': 'IBR',
  'ISO 9001:2015 · 14001:2015 · 45001:2018': 'ISO-9001',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Dhruv EPC', url: 'https://vedantagroup.net/dhruv-epc' },
  { name: 'Proof', url: 'https://vedantagroup.net/dhruv-epc/proof' },
])

export default function DhruvProofPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <PageHero
        breadcrumbs={[{ label: 'Dhruv EPC', href: '/dhruv-epc' }, { label: 'Proof' }]}
        eyebrow="Due diligence"
        title="Certifications, approvals, and third-party agencies."
        lead="Every credential listed here is on record and reconstructable by a vendor-registration reviewer — stamps, issuers, and inspection bodies are independently verifiable with the issuing authority."
      />

      {/* Certifications — §20 grid: 1 → sm:2 → lg:4 */}
      <section aria-labelledby="certs-heading" className="mx-auto max-w-wide px-6 py-16">
        <h2 id="certs-heading" className="font-display text-h1 font-medium text-steel-950">
          Certifications
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dhruvCertifications.map((cert) => (
            <CertificationCard
              key={cert.name}
              stampCode={STAMP_BY_NAME[cert.name]}
              name={cert.name}
              scopeStatement={cert.scopeStatement}
              issuer={cert.issuer}
              validFrom={cert.validFrom}
              validTo={cert.validTo}
              artifactUrl={cert.artifactUrl}
            />
          ))}
        </div>
      </section>

      {/* Approvals & TPI — §20 ApprovalsMatrix */}
      <section
        aria-labelledby="approvals-heading"
        className="border-t border-steel-200 bg-steel-50"
      >
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="approvals-heading" className="font-display text-h1 font-medium text-steel-950">
            Approvals &amp; TPI agencies
          </h2>
          <div className="mt-8 overflow-x-auto">
            <ApprovalsMatrix
              approvals={dhruvApprovals}
              caption="Third-party &amp; inspection approvals"
            />
          </div>
        </div>
      </section>

      {/* DEMO notice */}
      <div className="mx-auto max-w-wide px-6 py-8">
        <p className="text-helper text-steel-600">
          Certification validity dates are DEMO-PLACEHOLDER pending document scans. All credentials
          are independently verifiable with the issuing authority.
        </p>
      </div>

      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />

      <MobileBottomBar
        phoneHref={dhruvPhoneHref}
        whatsappHref={dhruvWhatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
      />
    </main>
  )
}
