'use client'
// MobileDrawer — Datum §17.
// Full-height drawer from the right (motion-deliberate, ease-enter), Overlay
// elevation (§8): shadow-2 + steel-950 @ 40% scrim. Groups as accordions,
// RFQ button pinned at the drawer bottom, 48px row targets, focus trapped,
// ESC / scrim click closes.
// Accordion disclosure is instant — height animation triggers layout, banned
// by §11's compositor law; only the chevron rotates. Exit is an immediate
// unmount (the reduced-motion rendering); entry honors motion-deliberate.

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { ChevronDown, Close } from './glyphs'

export interface DrawerNavLink {
  label: string
  href: string
}

export interface DrawerGroup {
  label: string
  items: DrawerNavLink[]
}

export interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  /** IA groups rendered as accordions */
  groups: DrawerGroup[]
  /** Flat links: Capabilities · Projects · Company */
  links: DrawerNavLink[]
  rfqHref: string
  /** Pass next/link (or any router Link) for client-side navigation. Defaults to <a>. */
  linkComponent?: React.ElementType
  className?: never
}

const row = 'flex h-12 w-full items-center text-data font-medium text-steel-100'

export function MobileDrawer({
  open,
  onClose,
  groups,
  links,
  rfqHref,
  linkComponent: Link = 'a',
}: MobileDrawerProps): React.ReactElement | null {
  const [shown, setShown] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // slide-in: mount at translate-x-full, then transition to 0 on the next frame
  useEffect(() => {
    if (!open) {
      setShown(false)
      return
    }
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  // focus trap + ESC + scroll lock; focus restored to the opener on close
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('button, a[href]')?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel) return
      const focusable = panel.querySelectorAll<HTMLElement>('button, a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* scrim — §8 Overlay: steel-950 @ 40% */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-steel-950/40 transition-opacity duration-deliberate ease-enter motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        // steel-950 panel — rebind focus ring to the -dark accent step (globals.css §25)
        data-chrome="dark"
        className={`absolute inset-y-0 right-0 flex w-4/5 flex-col bg-steel-950 shadow-overlay transition-transform duration-deliberate ease-enter motion-reduce:transition-none ${shown ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-3">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-sm text-steel-50"
          >
            <Close />
          </button>
        </div>

        <nav aria-label="Site navigation" className="flex-1 overflow-y-auto px-6 pb-6">
          {groups.map((group) => {
            const isOpen = expanded === group.label
            return (
              <div key={group.label} className="border-b border-steel-800">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : group.label)}
                  className={`${row} justify-between`}
                >
                  {group.label}
                  <span
                    className={`text-steel-500 transition-transform duration-standard ease-standard ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <ChevronDown size={20} />
                  </span>
                </button>
                {isOpen && (
                  <ul className="pb-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex h-12 items-center pl-4 text-data text-steel-300"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`${row} border-b border-steel-800`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* RFQ pinned at drawer bottom (§17) */}
        <div className="flex flex-col border-t border-steel-800 p-6">
          <Button variant="rfq" href={rfqHref}>
            Request a quote
          </Button>
        </div>
      </div>
    </div>
  )
}
