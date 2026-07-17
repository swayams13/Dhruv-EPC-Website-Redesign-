# UI/UX Review — Vedanta Group Platform
**Reviewer stance:** senior UI/UX designer, industrial/B2B manufacturing websites
**Date:** 2026-07-16 · **Scope:** full read of `docs/progress.md` (Sessions 1–15), `docs/datum-design-system.md`, `docs/design.md`, the three home pages, hero/nav/footer/card components, tokens, and the new exploded-view work on branch `phase-4-exploded-hero-sequence`
**Format:** verdict → what's genuinely strong → defects found and fixed in this pass → items flagged for human QA → strategic recommendations (not implemented)

---

## 1. Verdict

This is one of the more disciplined industrial-web codebases I've reviewed. The Datum system makes the two decisions most industrial-manufacturer sites get wrong: it treats **numbers as the copy** (mono type reserved for verified figures, stats in the first viewport, spec chips that anchor into spec tables) and it treats **restraint as the luxury signal** (one accent per company, capped at one filled element per view; one corner radius; motion as annotation). Those two principles are exactly right for an audience of proposal engineers who verify rather than browse. The site's conversion architecture — RFQ button in the header everywhere, RFQ band closing every page, WhatsApp as a first-class channel for the Indian B2B context, drawing-upload treated as a designed component with a confidentiality reassurance line — is textbook for this sector.

The weaknesses are concentrated in three places: (a) the brand-new exploded-view hero had four implementation defects that would have shipped visible bugs (all fixed in this pass, detailed in §3); (b) the site is still **imageless everywhere** — until the works shoot happens, a visually superb system is dressing empty frames, and the exploded renders must not become a reason to deprioritize real photography; (c) a handful of structural conversion questions (group-home door depth, empty testimonial/client-proof slots) are known but worth restating with urgency because they're what a buyer actually notices.

---

## 2. What's genuinely strong — keep, don't dilute

**The three-voice typography rule.** Display for statements, sans for prose, mono for *verified fact only*. This is the single most distinctive credibility device in the system — a buyer subconsciously learns that anything in mono is checkable. Most competitors set their capability figures in whatever weight the theme shipped with. Guard this rule during content entry: the moment marketing copy appears in mono, the device is dead.

**The amber/blue law.** One conversion action, one color, no other element may use it. Every screen self-explains. The Session-2 contrast fix (rfqFg on flex-500) shows the team actually QAs this rather than assuming it.

**The title-block footer.** Rendering the entity record as an engineering drawing's title block is the best brand-native footer concept I've seen in this sector, and it doubles as the JSON-LD twin. It solves entity-coherence (the audit's messiest failure) as a *brand ritual* rather than a compliance chore.

**Validation-as-law content pipeline.** Zod-parsed content that fails the build rather than the reader, `oneLineScope` required to contain a digit, DEMO-PLACEHOLDER discipline with a swap-list. This is engineering rigor most agencies never apply to content.

**Performance culture.** 93.8 kB first-load JS against a 120 kB budget, on a marketing site, with a component library and mega-menu. The budget headroom is what made the exploded-view feature shippable without a framework dependency.

---

## 3. Defects found in the exploded-view work — fixed in this pass

I reviewed my own Session-15 implementation as adversarially as anything else. Four real defects, all fixed in `ExplodedSequence.tsx` v1.1 + `globals.css`:

**3.1 — Sticky band pinned underneath the fixed header (visual bug, every desktop user).** The header is `fixed` at 72px, compressing to 60px after 40px of scroll (`Header.tsx`). The v1 sequence used `sticky top-0`, so the pinned image band would sit 60px under the header chrome for the entire scrub. **Fix:** the sticky offset now lives in `globals.css` as `top: 60px` (the scrolled header height — by the time the band pins, the user has always scrolled past the 40px compression threshold), plus `max-height: calc(100vh - 60px)` so short laptop viewports (e.g. 1440×800, where a full-width 16:9 band is 810px tall) don't have the band's bottom cropped out of view for the whole sequence.

**3.2 — Hydration flash and layout shift (CLS + wrong-frame flash).** v1 rendered a static fully-exploded frame on the server, then swapped to a JS-measured branch after hydration: the image visibly jumped from exploded → assembled, and the wrapper's height changed from one viewport-band to 220vh *after first paint* — a genuine CLS hit on the page whose LCP gate (launch gate 3) is already client-blocked. **Fix:** the responsive/reduced-motion branching moved from JS state to CSS (`.exploded-track/-static/-scrub` in `globals.css`). Server HTML now has its final height on every device class before any JS runs: zero hydration reflow, zero wrong-frame flash. The scrub stack initializes at frame 0 (assembled), which is exactly what scroll-position 0 displays — SSR markup and hydrated markup are identical.

**3.3 — Mobile was dead scroll (UX bug, every phone user).** A 220vh scroll track behind a ~211px-tall sticky band on a 375px portrait phone means the user scrolls through more than two viewports of near-empty steel-900 with a small animating strip pinned at top. That is the "scroll-jacking feel" Datum §11 exists to prevent, arriving through the back door. `design.md` §5 flagged mobile as an open question; this review resolves it: **below 768px the sequence renders as the static fully-exploded frame with no scroll track at all** — same treatment as reduced motion. The scrub is a wide-viewport, motion-permitted enhancement. Implemented CSS-first (same media query gates the scroll listener), logged in `docs/decisions.md`.

**3.4 — LCP priority on the wrong element + inconsistent image pipeline.** v1 put `priority` on the *last* frame while post-hydration desktop displayed frame 0, and used a raw `<picture>` element in one branch versus `next/image` in the other — bypassing the optimizer inconsistently. **Fix:** `next/image` everywhere (the config's `formats: ['image/avif','image/webp']` already negotiates formats); `priority` sits on the static exploded shot — which is the same file as the scrub's final frame, so the preload is never wasted on either device class — and frame 0 loads eagerly for the desktop scrub start.

**3.5 — Photo-slot clipping would have broken the scrub entirely on Dhruv and Precise (functional bug, discovered during this pass's edits).** `HomeHero`'s photo band wrapped its child in `aspect-video overflow-hidden`. Two consequences for the sequence living in that slot: the 220vh scroll track was clipped to a single 16:9 band, and — worse — `position: sticky` silently stops working inside any `overflow: hidden` ancestor, so the scrub would have shown nothing but a static clipped frame while still costing the full JS. **Fix:** the wrapper no longer forces a ratio or clips (`HomeHero.tsx`, one-line structural change, logged as an amendment to decisions.md's template-lock entry); the photo child now owns its own aspect ratio, and the Storybook placeholder was updated to carry `aspect-video` itself. No page passed a plain photo before this branch, so nothing regresses. The group page's bespoke wrapper had the same clipping problem and got the same fix.

**3.6 — Group home: the doors were pushed too deep.** The group page's own comment says the two-doors section is "the page's reason to exist." v1 inserted a 220vh sequence between the hero copy and the doors — on a laptop, a visitor now scrolls ~3 viewports before reaching the primary navigation decision. **Fix (partial):** the group page passes `trackVh={160}`, cutting the delay by roughly a viewport while keeping enough travel for a legible five-frame scrub. The fuller structural option (doors before the sequence) is a §5 recommendation, below.

*(Numbering note: §3.5 and §3.6 were both found in this pass; 3.5 was caught while applying 3.1–3.4 — which is itself the argument for review passes.)*

---

## 4. Flagged for human QA — cannot be verified from a sandbox

1. **The scrub feel with real images.** Five keyframes cross-faded at 180ms is a design bet, not a certainty. If the transition reads as mushy once real renders exist, drop the transition to `duration-instant`, or generate the 3 in-between frames per keyframe pair (the guide's interpolation note). Judge on a real trackpad *and* a mouse wheel — wheel scrolling is chunkier and shows frame jumps more.
2. **Image weight vs. the LCP gate.** Five frames × ~1600px webp could be 0.5–1 MB per homepage. The static/priority frame is the LCP element and must stay lean (target ≤ 120 kB for the 1600w webp; AVIF will come in lower). Measure on the staging Lighthouse run that gate 3 is already waiting on — same run, no extra process.
3. **Sticky offset drift.** The 60px offset in `globals.css` mirrors `h-header-scrolled`. If the header heights ever change in the Tailwind preset, this value must move with them — I left a comment pinning them together, but it's a manual coupling.
4. **Launch-checklist gate 10** ("zero stock imagery") still reads PASS against a rule this branch deliberately excepts. Reword the gate to name the exploded-view carve-out (tracked in `docs/decisions.md` follow-ups). Do it in the same commit that merges this branch, so the checklist never lies even briefly.
5. **`pnpm test` and `pnpm build`** still need a local run (sandbox has no network and an arch-mismatched rollup binary). `tsc` and `eslint` are re-verified clean after this pass.

---

## 5. Strategic recommendations — not implemented, ranked

**P1 — The works shoot is still the highest-leverage visual investment on this site.** Everything in the system (grading spec, datum-line framing, 4:3 card frames) is built for real photography that doesn't exist yet. The exploded renders are a strong *centerpiece*, but a buyer evaluating a fabricator wants evidence: weld beds, bay cranes, NDT in progress, people in PPE. One day with a competent industrial photographer at each works fills the product cards, project cards, capability pages, and the §20 fabrication/QA strips. Until then the site argues from typography alone.

**P1 — Empty proof slots read as absent proof.** Testimonials (gate 6) and the client wall are seeded-empty by honest policy — correct policy, visible gap. A buyer notices a "Certifications" section with four cards and no named clients anywhere. If verified quotes are slow to arrive, a *sectors served* strip (already sourced: "oil & gas to atomic energy, 12 sectors") or named-project metric cards are lower-friction proof the client can approve faster than testimonial quotes.

**P2 — Group home structure: consider doors-first.** Even at 160vh, the sequence delays the two-doors decision. The stronger industrial pattern for a holding page: compressed hero (eyebrow + H1 + subhead) → doors → *then* the exploded sequence as the shared-capability statement → stats → certifications. This keeps the group page's "reason to exist" inside the first scroll and makes the heat exchanger a reward rather than a toll. It reorders §6.1, so it needs a deliberate design decision, not a drive-by edit — hence recommended, not done.

**P2 — Product-card grid without imagery reads as a directory listing.** Seventeen product cards, no photos, no icons. Datum §12 already specifies a custom domain icon set drawn as section views (exchanger, vessel, bellows…). Commissioning those 12 icons and putting them in the card's photo slot as an interim state would lift the equipment grids from "list" to "catalog" for a few days of design work, without violating the photography law (icons are drawings, not imagery).

**P3 — Post-launch: exploded-view v2.** The deferred multi-callout label pass (3–5 mono dimension labels fading in against components at full explosion) is where this feature stops being decoration and starts being a datasheet. Wire the labels to the same spec-table records — never hand-typed — per the crawler-reconstructable-claim principle. Also worth testing then: `ProductHero` reuse on the two flagship product pages.

**P3 — RFQ funnel instrumentation.** The site's whole thesis is RFQ conversion, and gate-level analytics aren't specced beyond "measure & tune" (Phase 6). Define the funnel events now (hero CTA click → form start → upload start → upload success → submit) so day-one data exists — retrofitting loses the launch-week baseline.

---

## 6. Changes made in this pass (files touched)

| File | Change |
|---|---|
| `apps/web/components/ExplodedSequence.tsx` | v1.1 rewrite: CSS-first responsive/PRM branching, frame-0 scrub start (no hydration flash), corrected LCP priority, `next/image`-only pipeline, media-query-gated scroll listener |
| `apps/web/app/globals.css` | New `.exploded-track/-static/-scrub` block: 768px+ motion-permitted scrub activation, 60px sticky offset under the fixed header, `max-height` guard for short viewports, CLS-free SSR heights |
| `apps/web/app/(group)/page.tsx` | `trackVh={160}` (§3.6); un-clipped photo wrapper (§3.5) |
| `packages/datum-ui/src/components/HomeHero.tsx` | Photo band no longer forces `aspect-video overflow-hidden` — child owns its ratio (§3.5) |
| `packages/datum-ui/src/components/HomeHero.stories.tsx` | Story placeholder carries its own `aspect-video` |
| `docs/datum-design-system.md` | §11 addendum extended: sub-768px static rule alongside reduced-motion |
| `docs/decisions.md` | Follow-ups updated: mobile behavior resolved; gate-10 rewording still open |
| `docs/progress.md` | Session 15 review-pass subsection appended |
| `docs/ui-ux-review.md` | This report |

Verification after changes: `tsc --noEmit` clean on `apps/web` and `packages/datum-ui`; `eslint` clean on all touched files. `pnpm test` / `pnpm build` remain a local action (see §4.5).
