'use client'
// Header — Datum §17.
// 72px, steel-50, bottom scribed line: logo left · Equipment (mega-menu) +
// section links center · WhatsApp + click-to-call + the RFQ button right —
// the RFQ button is present in the header on every page (PRD 5.3).
// Sticky (§17/§10/§8): the header sits absolute in its 72px slot, scrolls away
// with the page, and after one viewport reattaches fixed — compressed to 60px,
// Raised (shadow-1), surface steel-50 @ 88% + 12px backdrop blur (the one
// sanctioned glass effect). Height is not animated: height transitions trigger
// layout, banned by §11's compositor law.
// Mega-menu: click-to-open Raised panel (hover-only disclosure is banned) —
// IA groups as name + one-line scope, right rail deep-linking the Capability
// Matrix. ESC closes and refocuses the trigger; outside pointer closes.

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { ArrowRight, ChevronDown, Menu, Phone, WhatsApp } from './glyphs'

export interface MegaMenuItem {
  name: string
  /** One-line scope, figures included — §16's rule applies in the menu too */
  scope: string
  href: string
}

export interface MegaMenuGroup {
  label: string
  items: MegaMenuItem[]
}

export interface HeaderNavLink {
  label: string
  href: string
}

export interface HeaderProps {
  /** Logo lockup (monochrome per §2.2) */
  logo: React.ReactNode
  homeHref: string
  /** Mega-menu trigger label — "Equipment" (Dhruv) / "Products" (Precise) */
  menuLabel: string
  menuGroups: MegaMenuGroup[]
  /** Right rail: deep-link to the Capability Matrix ("Max sizes, materials & codes") */
  capabilityRail: HeaderNavLink
  /** Capabilities · Projects · Company */
  links: HeaderNavLink[]
  /** tel: link — click-to-call is first-class (PRD 5.3) */
  phoneHref: string
  whatsappHref: string
  rfqHref: string
  /** Opens the MobileDrawer (hamburger, <768px) */
  onMenuOpen?: () => void
  className?: never
}

export function Header({
  logo,
  homeHref,
  menuLabel,
  menuGroups,
  capabilityRail,
  links,
  phoneHref,
  whatsappHref,
  rfqHref,
  onMenuOpen,
}: HeaderProps): React.ReactElement {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menuOpen])

  const chrome = scrolled
    ? 'fixed h-header-scrolled bg-steel-50/88 shadow-raised backdrop-blur-md'
    : 'absolute h-header bg-steel-50'

  return (
    <div className="relative h-header">
      <header
        ref={headerRef}
        // data-glass: §10 degradation hook — global CSS renders solid steel-50
        // where backdrop-filter is unsupported or prefers-reduced-transparency
        data-glass={scrolled || undefined}
        className={`${chrome} inset-x-0 top-0 z-40 border-b border-steel-200`}
      >
        <div className="mx-auto flex h-full max-w-wide items-center justify-between gap-6 px-6">
          <a href={homeHref} className="flex items-center text-steel-950">
            {logo}
          </a>

          <nav aria-label="Primary" className="hidden h-full items-center gap-8 md:flex">
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="datum-mega-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-full items-center gap-1 text-data font-medium text-steel-950"
            >
              {menuLabel}
              <span
                className={`text-steel-500 transition-transform duration-instant ease-standard ${menuOpen ? 'rotate-180' : ''}`}
              >
                <ChevronDown size={16} />
              </span>
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex h-full items-center text-data font-medium text-steel-950"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {/* §17 order: WhatsApp + click-to-call, then the RFQ button */}
            <a
              href={whatsappHref}
              aria-label="Chat on WhatsApp"
              className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-700 transition-colors duration-instant hover:bg-steel-100 hover:text-steel-950"
            >
              <WhatsApp size={20} />
            </a>
            <a
              href={phoneHref}
              aria-label="Call us"
              className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-700 transition-colors duration-instant hover:bg-steel-100 hover:text-steel-950"
            >
              <Phone size={20} />
            </a>
            <Button variant="rfq" size="compact" href={rfqHref}>
              Request a quote
            </Button>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuOpen}
            className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-950 md:hidden"
          >
            <Menu />
          </button>
        </div>

        {/* Mega-menu — Raised panel (§8): hairline border + shadow-1 */}
        <div
          id="datum-mega-menu"
          hidden={!menuOpen}
          className="absolute inset-x-0 top-full border-b border-steel-200 bg-white shadow-raised"
        >
          <div className="mx-auto grid max-w-wide grid-cols-4 gap-8 px-6 py-8">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-medium uppercase tracking-caption text-steel-500">
                  {group.label}
                </p>
                <ul className="mt-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="-mx-2 block rounded-sm px-2 py-2 transition-colors duration-instant hover:bg-steel-100"
                      >
                        <span className="block text-data font-medium text-steel-950">
                          {item.name}
                        </span>
                        <span className="block text-helper text-steel-600">{item.scope}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* the rail: "can you build mine?" is the question behind every menu open */}
            <div className="border-l border-steel-200 pl-8">
              <a
                href={capabilityRail.href}
                className="group flex items-center gap-2 text-data font-medium text-accent-text transition-colors duration-instant hover:text-accent-text-hover"
              >
                {capabilityRail.label}
                <span className="transition-transform duration-instant ease-standard motion-safe:group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
