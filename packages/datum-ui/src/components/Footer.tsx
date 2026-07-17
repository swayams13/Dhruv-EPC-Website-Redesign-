// Footer — "The Title Block", Datum §18.
// Every engineering drawing ends in a title block: who drew it, who approved
// it, to what standard, at what revision. Zone 1 (graphite, mono-heavy) is the
// canonical entity record — the visible twin of the Organization JSON-LD; it
// consumes the EntityRecord singleton, never hard-coded strings (CLAUDE.md:
// hard-coding an address in a component is a bug). Zone 2: credentials strip
// of Stamps in one scribed row, each linking to Certifications. Zone 3:
// sitemap columns, Privacy, Terms, LinkedIn as a labeled link — no vendor
// credit, no social-icon confetti.
// Zones 2–3 render on the page surface (steel-50) with scribed separators —
// §18 names only Zone 1 as the graphite band (interpretation noted).

import type { EntityRecord } from '@vedanta/schemas'
import { Stamp, type StampProps } from './Stamp'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface FooterProps {
  entity: EntityRecord
  /** Sitemap columns: Equipment / Capabilities / Company / Resources */
  columns: FooterColumn[]
  certificationsHref?: string
  privacyHref: string
  termsHref: string
  /** LinkedIn only, as a labeled link (§18 Zone 3) */
  linkedinHref?: string
  /** Pass next/link (or any router Link) for client-side navigation in the sitemap. Defaults to <a>. */
  linkComponent?: React.ElementType
  className?: never
}

const STAMP_CODES: readonly StampProps['code'][] = [
  'U',
  'U2',
  'IBR',
  'ISO-9001',
  'ISO-14001',
  'ISO-45001',
]

function isStampCode(s: string): s is StampProps['code'] {
  return (STAMP_CODES as readonly string[]).includes(s)
}

// "Content revised: Jul 2026" — the revision line's date format
function revisionDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(d)
}

const zone1Label = 'text-xs font-medium uppercase tracking-caption text-steel-400'
const zone1Link = 'transition-colors duration-instant hover:text-white'

export function Footer({
  entity,
  columns,
  certificationsHref,
  privacyHref,
  termsHref,
  linkedinHref,
  linkComponent: Link = 'a',
}: FooterProps): React.ReactElement {
  const stamps = entity.stampsHeld.filter(isStampCode)

  return (
    <footer>
      {/* Zone 1 — title block proper: graphite band, mono-heavy */}
      <div className="bg-steel-900 text-steel-50">
        <div className="mx-auto grid max-w-wide gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-h4 font-semibold">{entity.legalName}</p>
            {entity.companySlug !== 'group' && (
              <p className="mt-1 text-xs font-medium uppercase tracking-caption text-steel-400">
                A Vedanta Group company
              </p>
            )}
            {(entity.cin ?? entity.gst) && (
              <dl className="mt-6 space-y-2">
                {entity.cin && (
                  <div>
                    <dt className={`inline ${zone1Label}`}>CIN </dt>
                    <dd className="inline font-mono text-helper">{entity.cin}</dd>
                  </div>
                )}
                {entity.gst && (
                  <div>
                    <dt className={`inline ${zone1Label}`}>GST </dt>
                    <dd className="inline font-mono text-helper">{entity.gst}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* each address labeled by role — the entity-coherence fix as brand */}
          <div className="space-y-6">
            {entity.worksAddresses.map((works) => (
              <div key={works.address}>
                <p className={zone1Label}>{works.label}</p>
                <p className="mt-1 font-mono text-helper leading-relaxed">{works.address}</p>
              </div>
            ))}
            <div>
              <p className={zone1Label}>Registered office</p>
              <p className="mt-1 font-mono text-helper leading-relaxed">
                {entity.registeredOffice}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className={zone1Label}>Phone</p>
              {entity.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                  className={`mt-1 block py-1 font-mono text-helper ${zone1Link}`}
                >
                  {phone}
                </a>
              ))}
            </div>
            <div>
              <p className={zone1Label}>Email</p>
              {entity.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className={`mt-1 block py-1 font-mono text-helper ${zone1Link}`}
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-wide px-6 pb-6">
          <p className="border-t border-steel-800 pt-4 font-mono text-helper text-steel-400">
            Content revised: {revisionDate(entity.contentRevisedDate)}
          </p>
        </div>
      </div>

      {/* Zone 2 — credentials strip: one scribed row of stamps */}
      {stamps.length > 0 && (
        <div className="border-b border-steel-200 bg-steel-50">
          <div className="mx-auto flex max-w-wide flex-wrap items-center gap-3 px-6 py-6">
            {stamps.map((code) => (
              <Stamp key={code} code={code} {...(certificationsHref ? { href: certificationsHref } : {})} />
            ))}
          </div>
        </div>
      )}

      {/* Zone 3 — navigation & legal, and nothing else */}
      <div className="bg-steel-50">
        <div className="mx-auto grid max-w-wide gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-medium uppercase tracking-caption text-steel-600">
                {col.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-steel-700 transition-colors duration-instant hover:text-steel-950 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-wide flex-wrap items-center gap-6 border-t border-steel-200 px-6 py-6 pb-20 text-sm text-steel-600 md:pb-6">
          <a href={privacyHref} className="hover:text-steel-950 hover:underline">
            Privacy
          </a>
          <a href={termsHref} className="hover:text-steel-950 hover:underline">
            Terms
          </a>
          {linkedinHref && (
            <a href={linkedinHref} className="hover:text-steel-950 hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
