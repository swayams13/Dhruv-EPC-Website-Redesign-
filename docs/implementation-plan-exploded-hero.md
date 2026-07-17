# Implementation Plan — Exploded-View Hero Rollout
Companion to `docs/design.md`. This is the concrete file-by-file plan for wiring the three finished exploded-view image sets into the live site. Written after reading the actual current files (`HomeHero.tsx`, `ProductHero.tsx`, `DatumRule.tsx`, `DimensionLabel.tsx`, the three homepage `page.tsx` files, and both token files) so every step below is grounded in what exists today, not assumed.

**Key finding that simplifies this a lot:** `HomeHero.tsx` already has a `photo?: React.ReactNode` slot, already wrapped in the correct `aspect-video` band, already preceded by the exact `DatumRule` + `DimensionLabel` "signature moment" markup design.md wanted to reuse. Dhruv's and Precise's homepages already render `<HomeHero>` — they just don't pass a `photo` prop yet. **That means Dhruv and Precise need zero changes to any locked component** — only an additive prop on an existing call. Only the **group homepage** needs real surgery, because it doesn't use `HomeHero` at all (it has its own bespoke, photo-less hero markup with a comment saying so explicitly).

---

## Step 0 — Confirm before touching anything

- [ ] The three sign-offs from `design.md` §0 are actually done (photo-law override logged, template-lock reopening approved, motion-budget addendum accepted). If any of these are "we'll figure it out later," stop here — CLAUDE.md's own rules treat this as a blocker, not a detail.
- [ ] You have the frame files locally, following the naming from the image-generation guide (`apps/web/public/exploded/{heat-exchanger,pressure-vessel,expansion-joint}/frame-NN.{avif,webp}` + mobile variants). Confirm exact frame counts for each of the three sets — the component below is written to accept any array length, but note the actual count so the PR description is accurate.

---

## Step 1 — Place the image assets (no code yet)

`apps/web/public/` doesn't exist yet in this repo — every hero ships photo-less today. Create:

```
apps/web/public/exploded/heat-exchanger/frame-01.avif  frame-01.webp  frame-01-mobile.avif  frame-01-mobile.webp  ...
apps/web/public/exploded/pressure-vessel/...
apps/web/public/exploded/expansion-joint/...
```

No `next.config.mjs` change needed — `remotePatterns` only governs remote hosts; these are local files under `public/`, which `next/image` serves automatically.

---

## Step 2 — New component: `ExplodedSequence`

New file: `packages/datum-ui/src/components/ExplodedSequence.tsx` (a new component file — does not touch any locked file). Paired story file `ExplodedSequence.stories.tsx` following the repo's existing one-file-per-component + stories convention.

**Design decisions, stated explicitly rather than left implicit:**

- **No new npm dependency.** Write the scroll-binding as plain `IntersectionObserver` + a `requestAnimationFrame`-throttled scroll listener, vanilla React state. Pulling in GSAP or Framer Motion would trigger CLAUDE.md's "any new dependency in any package.json — justify or remove" human-review gate for something a ~60-line hook can do. Keep it out of that gate.
- **No new design token.** The scroll-track height (how much vertical scroll distance the sequence plays over) is a behavioral/physics constant, not a visual design decision — it's not a color, spacing step, radius, shadow, duration, or font. Treat it as a component prop with a sensible default (`trackVh = 220`), set via inline `style`, not a Tailwind class — this sidesteps `tailwindcss/no-arbitrary-value` (which governs *classNames*, not inline styles) without needing a Datum §26 governance event for something that isn't really a design token. Mention this reasoning one line in the PR description so a reviewer isn't left guessing why there's an inline style in an otherwise token-only codebase.
- **Frames cross-fade via opacity, position via CSS `position: sticky`.** Both are already-sanctioned techniques (`sticky` is layout, not animation; opacity crossfade is exactly what the "only transform/opacity may animate" performance law permits).
- **v1 scope: reuse the existing single `DimensionLabel` count-up, don't add in-image label overlays yet.** Design.md's "3–5 in-image callouts fading in near components" is a real upgrade but a materially bigger scope (positioning labels correctly per-frame, per-product). Recommend shipping v1 with the existing `dimensionLabel` prop on `HomeHero` (already wired, zero new code) and treating multi-callout overlays as a v2 follow-up — smallest change that satisfies the brief, not scaffolding for a future need. Flag this choice in the PR description so it's a visible decision, not a silent scope cut.
- **`aria-hidden="true"` on the whole visual.** The real claims (headline, subhead, dimension label, stats band) already carry the equivalent information in accessible DOM per Datum's crawler-reconstructable-claim principle — the image sequence is illustrative, not load-bearing.
- **`prefers-reduced-motion: reduce` → skip the scroll track entirely.** Don't just freeze on frame 0 inside a still-tall wrapper (that would leave a large dead-scroll zone for reduced-motion users, which is its own UX bug). Collapse the wrapper to a single `aspect-video` band showing the fully-exploded frame (the "hero" shot), same as a normal static photo would render. Same `matchMedia` check pattern already used in `DimensionLabel.tsx` — reuse it, don't reinvent it.

```tsx
// packages/datum-ui/src/components/ExplodedSequence.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface ExplodedFrame {
  avif: string
  webp: string
  avifMobile?: string
  webpMobile?: string
}

export interface ExplodedSequenceProps {
  /** Ordered assembled → fully exploded */
  frames: ExplodedFrame[]
  /** Scroll distance the sequence plays over, in vh. Behavioral constant, not a design token. */
  trackVh?: number
}

export function ExplodedSequence({ frames, trackVh = 220 }: ExplodedSequenceProps): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(frames.length - 1) // default: fully exploded (matches static-photo fallback)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = wrapperRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1)
        setIndex(Math.round(progress * (frames.length - 1)))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced, frames.length])

  if (reduced) {
    const last = frames[frames.length - 1]
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-steel-100" aria-hidden="true">
        <Image src={last.avif} alt="" fill sizes="100vw" className="object-cover" />
      </div>
    )
  }

  return (
    <div ref={wrapperRef} style={{ height: `${trackVh}vh` }} className="relative" aria-hidden="true">
      <div className="sticky top-0 aspect-video w-full overflow-hidden bg-steel-100">
        {frames.map((frame, i) => (
          <Image
            key={frame.avif}
            src={frame.avif}
            alt=""
            fill
            sizes="100vw"
            priority={i === frames.length - 1}
            className="object-cover transition-opacity duration-fast"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
```

*(Adjust for `webp`/mobile source selection via `<picture>` if `next/image`'s automatic format negotiation via `formats: ['image/avif','image/webp']` in `next.config.mjs` isn't sufficient — it likely already is, since that's exactly what that config option is for.)*

Add the export to `packages/datum-ui/src/index.ts`, following the existing barrel pattern (same line style as the other component exports).

---

## Step 3 — Content data: where the frame arrays live

Following the existing convention (`dhruvStats`, `dhruvCertifications`, etc. already live in `apps/web/lib/content/dhruv-epc.ts`), add the frame arrays there rather than inlining long path lists in `page.tsx`:

- `apps/web/lib/content/dhruv-epc.ts` → export `dhruvExplodedFrames: ExplodedFrame[]` (pressure vessel)
- `apps/web/lib/content/precise-engineers.ts` → export `preciseExplodedFrames: ExplodedFrame[]` (expansion joint)
- `apps/web/lib/content/group.ts` → export `groupExplodedFrames: ExplodedFrame[]` (heat exchanger)

---

## Step 4 — Wire into the three homepages

**`apps/web/app/dhruv-epc/page.tsx`** — additive only, no locked-component edit:
```tsx
import { CertificationCard, ExplodedSequence, HomeHero, ProductCard, type StampProps } from '@vedanta/datum-ui'
import { dhruvExplodedFrames, /* ...existing imports */ } from '../../lib/content/dhruv-epc'
...
<HomeHero
  eyebrow="ASME U & U2 · IBR · Manjusar GIDC, Vadodara"
  headline="Static equipment to ASME Sec. VIII, built in Vadodara."
  subhead="..."
  rfq={{ ... }}
  secondary={{ ... }}
  stats={dhruvStats}
  photo={<ExplodedSequence frames={dhruvExplodedFrames} />}
  dimensionLabel="Ø 3,600 mm"  {/* true figure — pull from the actual flagship pressure-vessel spec table, don't invent */}
/>
```

**`apps/web/app/precise-engineers/page.tsx`** — same pattern:
```tsx
photo={<ExplodedSequence frames={preciseExplodedFrames} />}
dimensionLabel="± 50 mm axial"  {/* true figure from the flagship metallic-bellows-expansion-joint spec table */}
```

**`apps/web/app/(group)/page.tsx`** — the one real edit. This page doesn't use `HomeHero`; it has its own hero markup with:
```tsx
{/* §6.1.1 — typographic graphite hero; group photograph pending the
    works shoot (§P-5): photo band absent, never stock */}
<section className="bg-steel-900">
  <div className="mx-auto max-w-wide px-6 py-24">
    ...
  </div>
</section>
```
Change to add a photo band, mirroring `HomeHero`'s internal pattern exactly (same DatumRule + DimensionLabel + full-bleed div, same classes) so it stays visually and structurally consistent with the pattern already sanctioned elsewhere:
```tsx
{/* §6.1.1 — typographic graphite hero + exploded-view heat exchanger.
    Overrides the prior "photo band absent, never stock" note — see
    docs/decisions.md [date] for the logged photo-law exception. */}
<section className="bg-steel-900">
  <div className="mx-auto max-w-wide px-6 py-24">
    ... existing eyebrow/h1/subhead unchanged ...
  </div>
  <div className="mx-auto max-w-wide px-6">
    <div className="pb-2">
      <DimensionLabel label="Ø 3,600 mm" animate />
    </div>
    <DatumRule animate />
  </div>
  <div className="mt-2 aspect-video w-full overflow-hidden bg-steel-800">
    <ExplodedSequence frames={groupExplodedFrames} />
  </div>
</section>
```
Import `DatumRule`, `DimensionLabel`, `ExplodedSequence` from `@vedanta/datum-ui` at the top of the file alongside the existing imports.

Do **not** refactor the group page onto the `HomeHero` component itself — `HomeHero` requires `rfq`/`secondary` CTA props, and the group hero deliberately has no CTA in the hero (CTAs live in the door cards below, per the "two-doors pattern" comment already in the file). Forcing it onto `HomeHero` would be an unrequested structural change and a drive-by refactor CLAUDE.md explicitly warns against — the bespoke markup already exists and just needs the photo band appended.

---

## Step 5 — Verify pass (exactly what CLAUDE.md specifies, run in order, stop on first failure)

```bash
pnpm typecheck
pnpm lint       # confirms no arbitrary Tailwind values crept in
pnpm test       # add a small test for ExplodedSequence's reduced-motion branch, mirroring a11y.test.tsx's existing pattern
pnpm build      # confirms marketing-route JS budget still ≤120 KB gz (currently 93.8 KB — ~26 KB headroom)
```

Then, manually in a real browser, per the existing UI-change checklist:
- [ ] `:focus-visible` still visible on every interactive element (the sequence itself takes no focus — confirm nothing regressed on the RFQ button/links around it)
- [ ] `prefers-reduced-motion` toggled at OS level — hero still fully functional, shows the static exploded shot, no dead-scroll zone
- [ ] 320px viewport — no horizontal scroll, sequence still reads correctly at mobile width
- [ ] Exactly one accent-filled element per view still holds (`ExplodedSequence` introduces no accent color itself — the amber/blue specular highlight baked into the renders is a subtle material property, not a UI fill, so this should still pass, but check it visually)
- [ ] Scroll up reverses the sequence smoothly (not just scroll down)

---

## Step 6 — Documentation, in this order

1. **Log the decision** — new `docs/decisions.md` entry (or dated section), stating: photo-law override for the exploded-view feature, template-lock reopened for `HomeHero`'s photo-band pattern (note: `HomeHero.tsx` itself is *unchanged* — only consumers now pass a `photo` prop that was already part of its API — so this is a lighter reopening than modifying the component itself), and the motion-budget addendum for the scroll-bound sequence.
2. **Merge the accepted spec into `docs/datum-design-system.md`** — add a subsection under §11 (Motion) describing the scroll-bound exploded-view pattern as a second sanctioned motion mechanic (distinct from the signature moment, which is unchanged and still fires above it), and a note under §19 (Hero patterns) that home heroes may now carry a scroll-bound photo sequence in the existing photo slot. This keeps `datum-design-system.md` the single source of truth per its own §26 governance rule, rather than leaving `design.md` as a permanent fork.
3. **Update `docs/progress.md`** with a new phase entry, following the existing session-log format.

---

## Step 7 — Commit structure (one concern per commit, per CLAUDE.md)

```
git checkout -b phase-4-exploded-hero-sequence

1. chore(assets): add exploded-view frame sequences (heat exchanger, pressure vessel, expansion joint)
2. feat(datum-ui): add ExplodedSequence component — scroll-bound frame sequence per Datum §11 addendum
3. feat(dhruv-epc): wire pressure-vessel exploded view into home hero
4. feat(precise-engineers): wire expansion-joint exploded view into home hero
5. feat(group): wire heat-exchanger exploded view into group home hero (Datum §6.1.1 override — see decisions.md)
6. docs: log photo-law/motion-budget override in decisions.md; merge exploded-view pattern into datum-design-system.md §11/§19; progress.md entry
```

Then a PR, per CLAUDE.md — never merge to `main` directly, and this one especially warrants a real human review given the rule overrides it carries.
