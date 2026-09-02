// Footer — "The Title Block", Datum §18.
// Every engineering drawing ends in a title block: who drew it, who approved
// it, to what standard, at what revision. Zone 1 (graphite, mono-heavy) is the
// canonical entity record — the visible twin of the Organization JSON-LD; it
// consumes the EntityRecord singleton, never hard-coded strings (CLAUDE.md:
// hard-coding an address in a component is a bug). Zone 2: credentials strip
// of Stamps in one scribed row, each linking to Certifications. Zone 3:
// sitemap columns, Privacy, Terms, LinkedIn as a labeled link — no vendor
// credit, no social-icon confetti.
// Zone 3 (Phase 7, Decision 4): dark now too, reusing Zone 1's exact
// bg-steel-900/text-steel-50 chrome rather than a new dark value — darkLabel/
// darkLink below are shared by both zones for that reason. Carries
// data-chrome="dark" (new requirement this revision) so Privacy/Terms/
// LinkedIn's focus rings clear 3:1 on the dark surface. Zone 2 stays on the
// page surface (steel-50) — §18 names only Zone 1 as the graphite band, and
// Decision 4 only calls out Zone 3, so Zone 2 is untouched by this phase.

import type { EntityRecord } from '@vedanta/schemas'
import { Stamp, type StampProps } from './Stamp'
import { ArrowRight } from './glyphs'

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
  /** WhatsApp direct link — renders alongside LinkedIn */
  whatsappHref?: string
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

const darkLabel = 'text-xs font-medium uppercase tracking-caption text-steel-400'
const darkLink = 'transition-colors duration-instant hover:text-white'

export function Footer({
  entity,
  columns,
  certificationsHref,
  privacyHref,
  termsHref,
  linkedinHref,
  whatsappHref,
  linkComponent: Link = 'a',
}: FooterProps): React.ReactElement {
  const stamps = entity.stampsHeld.filter(isStampCode)

  return (
    <footer className="relative overflow-hidden">
      {/* Bracket linework (§2.6, ref `1l`) — accent corner fragments echoing
          the client's own footer device; decorative only, aria-hidden,
          capped at three (§2.6's own "never more than three"). Positioned
          relative to the same max-w-wide content box every zone uses below,
          bleeding past its edge by design — `overflow-hidden` on <footer>
          (which spans the full viewport) clips that bleed safely at the
          viewport edge instead of ever creating horizontal scroll, since
          the notes' literal px offsets alone would overflow on any
          viewport narrower than max-w-wide + 2×46px. Border color is
          `color-mix(var(--accent) NN%, transparent)`, not a hardcoded
          rgba(170,56,51,...) literal despite "red" in the name — so this
          device follows each route's own --accent (blue on Precise), same
          as every other component. It has to be inline `style`, not a
          Tailwind class: `border-accent/50` compiles to nothing (silently
          dropped, verified against the build output) because Tailwind's
          opacity-modifier engine can't decompose a bare `var(--accent)`
          reference into channels the way it can a literal hex token like
          `steel-50`. The notes' rgba value is Group/Dhruv's accent read
          directly off that canvas instance, not a scoped brand-red like
          Logo.tsx's logoRed. Exact width/height and the "concentric"
          nesting gap for the left pair aren't in the notes — only
          position/color/radius/opacity are — sized here at a plausible
          corner-bracket scale; flagged in docs/progress.md. Hidden below
          md (§3's responsive table: costs horizontal room, reads as
          clutter below that); the right one additionally hidden below lg
          per the same table's "left pair only" tablet row. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-wide -translate-x-1/2 md:block"
      >
        <span
          className="absolute rounded-r-lg border border-l-0"
          style={{ left: -46, top: 56, width: 56, height: 56, borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent)' }}
        />
        <span
          className="absolute rounded-r-lg border border-l-0"
          style={{ left: -46, top: 106, width: 80, height: 80, borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}
        />
        <span
          className="absolute hidden rounded-l-lg border border-r-0 lg:block"
          style={{ right: -46, bottom: 96, width: 64, height: 64, borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)' }}
        />
      </div>

      {/* Zone 1 — title block proper: graphite band, mono-heavy */}
      {/* data-chrome='dark': focus rings on this band use the -dark accent step */}
      <div data-chrome="dark" className="bg-steel-900 text-steel-50">
        <div className="mx-auto grid max-w-wide gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-h4 font-semibold">{entity.legalName}</p>
            {entity.companySlug !== 'group' && (
              <p className="mt-1 text-xs font-medium text-steel-400">
                A Vedanta Group company
              </p>
            )}
            {(entity.cin ?? entity.gst) && (
              <dl className="mt-6 space-y-2">
                {entity.cin && (
                  <div>
                    <dt className={`inline ${darkLabel}`}>CIN </dt>
                    <dd className="inline font-mono text-helper">{entity.cin}</dd>
                  </div>
                )}
                {entity.gst && (
                  <div>
                    <dt className={`inline ${darkLabel}`}>GST </dt>
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
                <p className={darkLabel}>{works.label}</p>
                <p className="mt-1 font-mono text-helper leading-relaxed">{works.address}</p>
              </div>
            ))}
            <div>
              <p className={darkLabel}>Registered office</p>
              <p className="mt-1 font-mono text-helper leading-relaxed">
                {entity.registeredOffice}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className={darkLabel}>Phone</p>
              {entity.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                  className={`mt-1 block py-1 font-mono text-helper ${darkLink}`}
                >
                  {phone}
                </a>
              ))}
            </div>
            <div>
              <p className={darkLabel}>Email</p>
              {entity.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className={`mt-1 block py-1 font-mono text-helper ${darkLink}`}
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
      {/* data-chrome='dark': focus rings on Privacy/Terms/LinkedIn/back-to-top
          use the -dark accent step, same reason as Zone 1 above */}
      <div data-chrome="dark" className="bg-steel-900 text-steel-50">
        <div className="mx-auto grid max-w-wide gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-medium text-steel-400">
                {col.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm text-steel-50 hover:underline ${darkLink}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-wide flex-wrap items-center gap-6 border-t border-steel-800 px-6 py-6 pb-20 text-sm text-steel-400 md:pb-6">
          <a href={privacyHref} className={`hover:underline ${darkLink}`}>
            Privacy
          </a>
          <a href={termsHref} className={`hover:underline ${darkLink}`}>
            Terms
          </a>
          {linkedinHref && (
            <a href={linkedinHref} className={`hover:underline ${darkLink}`}>
              LinkedIn
            </a>
          )}
          {whatsappHref && (
            <a href={whatsappHref} className={`hover:underline ${darkLink}`}>
              WhatsApp
            </a>
          )}
          <a
            href="#"
            aria-label="Back to top"
            className={`ml-auto flex h-row w-row shrink-0 items-center justify-center rounded-full border border-steel-600 text-steel-50 hover:border-steel-400 ${darkLink}`}
          >
            <span className="-rotate-90">
              <ArrowRight size={20} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
