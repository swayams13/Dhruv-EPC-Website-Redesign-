'use client'
// ExplodedSequence — scroll-bound exploded-view photo sequence (v1.1).
// Spec: docs/design.md; override log: docs/decisions.md [2026-07-16];
// v1.1 revisions per docs/ui-ux-review.md [2026-07-16]:
//   - CSS-first responsive/PRM branching (.exploded-* in globals.css): the
//     server-rendered height is final on every device class, so there is no
//     hydration reflow (CLS) and no wrong-frame flash on hydrate.
//   - Scrub starts at frame 0 (assembled) — exactly what scroll position 0
//     displays, so SSR markup === hydrated markup on desktop.
//   - Below 768px and under prefers-reduced-motion, the sequence renders as
//     the static fully-exploded frame with NO scroll track — a multi-viewport
//     track behind a small sticky band on a portrait phone is dead scroll,
//     not motion design. The scrub is a wide-viewport enhancement.
//   - Sticky offset + short-viewport max-height live in globals.css (the
//     header is fixed at 60px once scrolled — v1's top-0 pinned the band
//     underneath it).
//   - next/image only (no raw <picture>): next.config's
//     formats: ['image/avif','image/webp'] negotiates the served format.
//
// Datum notes unchanged from v1: no new npm dependency (rAF-throttled scroll
// math, no animation library), no new design token (track height is a
// behavioral constant, passed as a CSS custom property consumed by
// globals.css), aria-hidden throughout (the hero's real claims live in
// accessible DOM per the crawler-reconstructable-claim principle), and
// opacity-only frame transitions (§11 performance law).

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export interface ExplodedFrame {
  /** Public path under apps/web/public/exploded/<product>/ */
  avif: string
  /** Canonical next/image src — the optimizer negotiates AVIF/WebP from it */
  webp: string
}

export interface ExplodedSequenceProps {
  /** Ordered assembled → fully exploded. */
  frames: ExplodedFrame[]
  /**
   * Scroll distance the scrub plays over, in vh (applies on md+ with motion
   * permitted — see .exploded-track in globals.css). A runtime behavioral
   * constant, not a visual design token.
   */
  trackVh?: number
}

/** Must match the activation media query on .exploded-scrub in globals.css. */
const SCRUB_MQ = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

export function ExplodedSequence({ frames, trackVh = 220 }: ExplodedSequenceProps): React.ReactElement | null {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const lastIndex = frames.length - 1
  const heroFrame = frames[lastIndex]

  useEffect(() => {
    if (frames.length < 2 || typeof window.matchMedia !== 'function') return
    const active = window.matchMedia(SCRUB_MQ)
    let raf = 0
    const onScroll = () => {
      if (raf || !active.matches) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = wrapperRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const span = rect.height - window.innerHeight
        const progress = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0
        setIndex(Math.round(progress * lastIndex))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    active.addEventListener('change', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      active.removeEventListener('change', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [frames.length, lastIndex])

  if (!heroFrame) return null

  return (
    <div
      ref={wrapperRef}
      className="exploded-track"
      style={{ '--exploded-track': `${trackVh}vh` } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* <768px / reduced motion / no-JS: the fully exploded hero shot,
          static, same footprint as a normal hero photo. Shares its file with
          the scrub's final frame, so the priority preload is never wasted
          on either device class. */}
      <div className="exploded-static relative aspect-video w-full overflow-hidden bg-steel-100">
        <Image src={heroFrame.webp} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      {/* md+ with motion permitted: the scrubbed stack, sticky inside the
          track (offset + max-height in globals.css). */}
      <div className="exploded-scrub aspect-video w-full overflow-hidden bg-steel-100">
        {frames.map((frame, i) => (
          <Image
            key={frame.webp}
            src={frame.webp}
            alt=""
            fill
            sizes="100vw"
            loading={i === 0 ? 'eager' : undefined}
            className="object-cover transition-opacity duration-fast ease-standard"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
