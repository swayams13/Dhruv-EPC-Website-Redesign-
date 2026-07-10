// MobileBottomBar — Datum §17.
// On product pages (mobile) a bottom action bar persists — thumb-reachable
// conversion for the scroll-deep spec reader: click-to-call, WhatsApp, and
// the RFQ button. 48px targets. The page owns the amber law: when this bar
// is on screen it carries the view's one accent-filled element.

import { Button } from './Button'
import { Phone, WhatsApp } from './glyphs'

export interface MobileBottomBarProps {
  /** tel: link */
  phoneHref: string
  whatsappHref: string
  rfqHref: string
  className?: never
}

const iconLink =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-steel-300 text-steel-700 transition-colors duration-instant hover:border-steel-400 hover:text-steel-950'

export function MobileBottomBar({
  phoneHref,
  whatsappHref,
  rfqHref,
}: MobileBottomBarProps): React.ReactElement {
  return (
    <nav
      aria-label="Contact actions"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-steel-200 bg-white p-2 md:hidden"
    >
      <a href={phoneHref} aria-label="Call us" className={iconLink}>
        <Phone />
      </a>
      <a href={whatsappHref} aria-label="Chat on WhatsApp" className={iconLink}>
        <WhatsApp />
      </a>
      <div className="flex flex-1 flex-col">
        <Button variant="rfq" href={rfqHref}>
          Request a quote
        </Button>
      </div>
    </nav>
  )
}
