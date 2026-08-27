// Precise Engineers — Proof hub (Datum §20). Certifications, approvals, quality record.
import type { Metadata } from 'next'
import { ApprovalsMatrix, CertificationCard, MobileBottomBar, PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  preciseApprovals,
  preciseCertifications,
  precisePhoneHref,
  preciseWhatsappHref,
} from '../../../lib/content/precise-engineers'
import { BASE } from '../../../lib/site'

export const metadata: Metadata = {
  title: 'Proof — Certifications & Approvals | Precise Engineers',
  description:
    'Precise Engineers holds ISO 9001:2015 certification and is an EIL approved vendor for expansion joints and bellows. All credentials independently verifiable for vendor registration.',
  alternates: { canonical: '/precise-engineers/proof/' },
}

// ponytail: same stamp map as precise home — one constant, not a shared util (only two callers)
const STAMP_BY_NAME: Record<string, 'ISO-9001' | 'IBR' | 'U' | 'U2' | 'ISO-14001' | 'ISO-45001' | undefined> = {
  'ISO 9001:2015': 'ISO-9001',
  'EIL Approved Vendor': undefined,
}

const breadcrumbs = [
  { label: 'Precise Engineers', href: '/precise-engineers' },
  { label: 'Proof' },
]

const jsonLd = buildBreadcrumbList([
  { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
  { name: 'Proof', url: `${BASE}/precise-engineers/proof` },
])

export default function PreciseProof() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Due diligence"
        title="Certifications, approvals, and our quality record."
        lead="Precise Engineers is ISO 9001:2015 certified and an EIL-approved unit since 1994 — every credential listed here is independently verifiable with the issuing authority for vendor registration."
      />

      {/* Certifications — §20 */}
      <section aria-labelledby="certs-heading" className="mx-auto max-w-wide px-6 py-16">
        <h2 id="certs-heading" className="font-display text-h1 font-medium text-steel-950">
          Certifications
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preciseCertifications.map((cert) => (
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

      {/* Approvals — §20 */}
      <section aria-labelledby="approvals-heading" className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="approvals-heading" className="font-display text-h1 font-medium text-steel-950">
            Approvals
          </h2>
          <div className="mt-8">
            <ApprovalsMatrix approvals={preciseApprovals} caption="EPC & statutory approvals" />
          </div>
        </div>
      </section>

      {/* Demo data notice */}
      <section aria-label="Data notice" className="border-t border-steel-200">
        <div className="mx-auto max-w-wide px-6 py-8">
          <p className="text-sm text-steel-500">
            Certification validity dates are DEMO-PLACEHOLDER pending document scans. All credentials independently verifiable with the issuing authority.
          </p>
        </div>
      </section>

      <RFQBand company="precise" whatsappHref={preciseWhatsappHref} />

      <MobileBottomBar
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
      />
    </main>
  )
}
