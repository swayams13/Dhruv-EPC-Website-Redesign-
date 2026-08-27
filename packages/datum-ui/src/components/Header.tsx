'use client'
// Header — Datum §17.
// Phase 1.1: dark nav — always fixed, solid steel-950 chrome. Scroll threshold
// 40px (was innerHeight): compresses header to 60px after minimal scroll.
// Gradient-over-hero effect deferred to Phase 2 (requires hero co-ordination).
// phoneHref / whatsappHref are now optional — GroupChrome omits them.

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { useRfqAnchorInView } from './useRfqAnchorInView'
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
  /** Logo lockup */
  logo: React.ReactNode
  homeHref: string
  /** Mega-menu trigger label — "Equipment" (Dhruv) / "Products" (Precise) */
  menuLabel: string
  menuGroups: MegaMenuGroup[]
  /** Right rail: deep-link to Capability Matrix */
  capabilityRail: HeaderNavLink
  links: HeaderNavLink[]
  /** tel: link — optional; GroupChrome omits it */
  phoneHref?: string
  whatsappHref?: string
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
  const contentRfqInView = useRfqAnchorInView()
  const headerRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
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
    ? 'fixed h-header-scrolled bg-steel-950 shadow-raised border-b border-steel-50/10'
    : 'fixed h-header bg-steel-950 border-b border-steel-50/10'

  return (
    <div className="relative h-header">
      <header
        ref={headerRef}
        // data-chrome='dark': rebinds --accent-focus to the -dark accent step so
        // focus rings clear 3:1 on the steel-950 bar (globals.css §25, v1.2).
        data-chrome="dark"
        className={`${chrome} inset-x-0 top-0 z-40`}
      >
        <div className="mx-auto flex h-full max-w-wide items-center justify-between gap-6 px-6">
          <a href={homeHref} className="flex items-center text-steel-50">
            {logo}
          </a>

          <nav aria-label="Primary" className="hidden h-full items-center gap-8 md:flex">
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="datum-mega-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-full items-center gap-1 text-data font-medium text-steel-200"
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
                className="flex h-full items-center text-data font-medium text-steel-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {whatsappHref && (
              <a
                href={whatsappHref}
                aria-label="Chat on WhatsApp"
                className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-300 transition-colors duration-instant hover:bg-steel-800 hover:text-steel-50"
              >
                <WhatsApp size={20} />
              </a>
            )}
            {phoneHref && (
              <a
                href={phoneHref}
                aria-label="Call us"
                className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-300 transition-colors duration-instant hover:bg-steel-800 hover:text-steel-50"
              >
                <Phone size={20} />
              </a>
            )}
            <span className={contentRfqInView ? 'invisible' : undefined}>
              <Button variant="rfq" size="compact" href={rfqHref}>
                Request a quote
              </Button>
            </span>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuOpen}
            className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-50 md:hidden"
          >
            <Menu />
          </button>
        </div>

        {/* Mega-menu — dark Raised panel */}
        <div
          id="datum-mega-menu"
          hidden={!menuOpen}
          className="absolute inset-x-0 top-full border-b border-steel-50/10 bg-steel-950 shadow-overlay"
        >
          <div className="mx-auto grid max-w-wide grid-cols-4 gap-8 px-6 py-8">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="font-mono text-xs font-medium uppercase tracking-caption text-accent">
                  {group.label}
                </p>
                <ul className="mt-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="-mx-2 block rounded-sm px-2 py-2 transition-colors duration-instant hover:bg-steel-800"
                      >
                        <span className="block text-data font-medium text-steel-100">
                          {item.name}
                        </span>
                        <span className="block text-helper text-steel-500">{item.scope}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* capability rail — "can you build mine?" is the question behind every menu open */}
            <div className="border-l border-steel-700/50 pl-8">
              <a
                href={capabilityRail.href}
                className="group flex items-center gap-2 text-data font-medium text-accent-dark transition-colors duration-instant hover:text-accent"
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
