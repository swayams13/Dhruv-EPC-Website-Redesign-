// /request-a-quote — Datum §23 RFQ flow, FR-3 shared engine.
// 8+4 layout: two-step form left, reassurance rail right.
import type { Metadata } from 'next'
import { RFQForm } from './RFQForm'

export const metadata: Metadata = {
  title: 'Request a Quote — Vedanta Group',
  description:
    'Send your requirement — equipment type, design code, drawings — and an engineer responds with a technical quotation.',
}

// §23 right rail: "the moment of form-filling is the moment of maximum doubt"
function ReassuranceRail({
  fallbackEmail,
  fallbackPhone,
}: {
  fallbackEmail?: string | undefined
  fallbackPhone?: string | undefined
}) {
  return (
    <aside aria-label="What happens next" className="flex flex-col gap-6 lg:col-span-4">
      <div className="rounded-sm border border-steel-200 bg-white p-6">
        <h2 className="text-h4 font-medium text-steel-950">What happens next</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {[
            'An engineer reviews your requirement',
            'We respond within one business day', // SLA figure pending client commitment (§23 placeholder, flagged)
            'You receive a technical quotation',
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-steel-700">
              <span className="font-mono text-helper text-steel-500">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <p className="text-helper text-steel-600">
        Your drawings and requirement details are confidential and reviewed only by our engineering team.
      </p>
      {/* §23 certification strip omitted — awaits verified CMS certification
          records (no invented claims per CLAUDE.md). */}
      {(fallbackEmail || fallbackPhone) && (
        <div className="text-sm text-steel-700">
          <h2 className="text-h4 font-medium text-steel-950">Prefer to talk?</h2>
          <p className="mt-2 flex flex-col gap-1">
            {/* §25 touch: 44px comfortable target for the call/email escape hatch */}
            {fallbackPhone && (
              <a
                href={`tel:${fallbackPhone}`}
                className="inline-flex min-h-row items-center font-mono text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {fallbackPhone}
              </a>
            )}
            {fallbackEmail && (
              <a
                href={`mailto:${fallbackEmail}`}
                className="inline-flex min-h-row items-center text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {fallbackEmail}
              </a>
            )}
          </p>
        </div>
      )}
    </aside>
  )
}

export default function RequestAQuotePage({ searchParams }: { searchParams: { company?: string } }) {
  const company =
    searchParams.company === 'dhruv' || searchParams.company === 'precise' ? searchParams.company : undefined

  // Contact fallback from env until the EntityRecord singleton lands in CMS —
  // never hard-coded in a component (CLAUDE.md)
  const fallbackEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const fallbackPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE

  return (
    <main className="mx-auto max-w-content px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 text-steel-950">Request a quote</h1>
      <p className="mt-2 max-w-content text-body-lg text-steel-700">
        Describe your requirement and attach drawings. An engineer — not a sales queue — reviews every submission.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* Playbook §6: JS disabled renders the static fallback instruction block */}
          <noscript>
            <div className="mb-6 rounded-sm border border-steel-200 bg-steel-50 p-6 text-sm text-steel-700">
              <p className="font-medium text-steel-950">This form needs JavaScript to attach drawings.</p>
              <p className="mt-2">
                Enable JavaScript, or send your requirement — equipment type, design code, material, quantity,
                drawings — directly{' '}
                {fallbackEmail ? (
                  <>
                    by email to{' '}
                    <a href={`mailto:${fallbackEmail}`} className="font-medium text-accent-text underline">
                      {fallbackEmail}
                    </a>
                  </>
                ) : (
                  'by email'
                )}
                {fallbackPhone && (
                  <>
                    {' '}
                    or call{' '}
                    <a href={`tel:${fallbackPhone}`} className="font-mono font-medium text-accent-text underline">
                      {fallbackPhone}
                    </a>
                  </>
                )}
                . An engineer reviews every requirement.
              </p>
            </div>
          </noscript>
          <RFQForm initialCompany={company} fallbackEmail={fallbackEmail} fallbackPhone={fallbackPhone} />
        </div>
        <ReassuranceRail fallbackEmail={fallbackEmail} fallbackPhone={fallbackPhone} />
      </div>
    </main>
  )
}
