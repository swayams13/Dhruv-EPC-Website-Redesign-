// CertificationCard — Datum §20/§22.
// Stamp mark + full credential name + scope statement in plain words
// ("Authorized to fabricate ASME Sec. VIII Div. 2 pressure vessels") +
// issuer + validity + "View certificate" opening the artifact.
// A credential without scope and provenance is decoration (Principle 5);
// the scope line is what turns a logo into an answer. The CMS schema
// (Certification) enforces the scope statement at publish time.

import { Stamp, type StampProps } from './Stamp'

export interface CertificationCardProps {
  /** Credential stamp mark (§12) — omitted for credentials without a stamp */
  stampCode?: StampProps['code'] | undefined
  /** Full credential name: "ASME U2 Certificate of Authorization" */
  name: string
  /** Plain-words scope — what this credential authorizes */
  scopeStatement: string
  issuer: string
  /** ISO dates; rendered as years */
  validFrom: string
  validTo?: string | undefined
  /** The certificate artifact (PDF/scan) */
  artifactUrl?: string | undefined
  className?: never
}

function year(iso: string): string {
  const y = new Date(iso).getFullYear()
  return Number.isNaN(y) ? iso : String(y)
}

export function CertificationCard({
  stampCode,
  name,
  scopeStatement,
  issuer,
  validFrom,
  validTo,
  artifactUrl,
}: CertificationCardProps): React.ReactElement {
  return (
    <div className="flex h-full flex-col rounded-sm border border-steel-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-h4 font-semibold text-steel-950">{name}</h3>
        {stampCode && <Stamp code={stampCode} />}
      </div>
      {/* prose voice, not the mono-reserved data step (§5.2) */}
      <p className="mt-3 text-sm text-steel-700">{scopeStatement}</p>
      <dl className="mt-4 space-y-1">
        <div>
          <dt className="inline text-xs font-medium uppercase tracking-caption text-steel-600">
            Issuer{' '}
          </dt>
          <dd className="inline text-sm text-steel-700">{issuer}</dd>
        </div>
        <div>
          <dt className="inline text-xs font-medium uppercase tracking-caption text-steel-600">
            Validity{' '}
          </dt>
          <dd className="inline font-mono text-helper text-steel-700">
            {validTo ? `${year(validFrom)} – ${year(validTo)}` : `Issued ${year(validFrom)}`}
          </dd>
        </div>
      </dl>
      {artifactUrl && (
        <p className="mt-4 pt-1">
          <a
            href={artifactUrl}
            className="text-data font-medium text-accent-text transition-colors duration-instant hover:text-accent-text-hover hover:underline"
          >
            View certificate
          </a>
        </p>
      )}
    </div>
  )
}
