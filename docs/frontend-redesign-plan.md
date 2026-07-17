# Frontend Redesign — Implementation Plan
**Date:** 2026-07-16 · **Branch:** `phase-4-exploded-hero-sequence`
**Governing rule:** frontend/UI-UX only. Backend surfaces — `apps/web/app/api/**`, `apps/web/lib/presign.ts`, `packages/schemas/src/**` — are NOT touched by any phase of this plan unless a change is explicitly approved by Swayam first and logged in `docs/decisions.md`. Content files (`apps/web/lib/content/*`) may only be changed additively (new exports), never by altering existing sourced records.

Inputs: `docs/ui-ux-review.md` (design critique), `docs/frontend-audit.md` (25-finding punch list from the page-level audit), `docs/design.md` (exploded-view spec), `docs/decisions.md` (override log).

---

## Phase A — this session (DONE, uncommitted on the branch)

**A1. Ship-blocking bugs from the audit (P0):**
- Double footer on every `(group)` route — `/`, `/about`, `/contact` each rendered their own `<Footer>` while `(group)/layout.tsx` also renders one. Per-page footers removed; the layout owns chrome; `certificationsHref="/#proof"` carried over to the layout's footer so stamps stay linked.
- RFQ step-1 dead-click — with no company picked, validation failed invisibly (the schema treats `company` as optional for `?company=` prefill, so the failure landed on `equipmentType`, whose error node lives in a fieldset that only mounts after a company is chosen). Fixed with an explicit, rendered, friendly company guard in `continueToContact()`.
- NOT fixed here, needs Swayam: audit P0-3 — DEMO engineering figures asserted as fact in `capabilities/page.tsx` metadata + hero while the spec table publishes "DEMO figure" notes. This is a content/claims decision (which figures are real?), not a code decision.

**A2. §12 domain icon set, as code:** new `DomainIcon` component in `@vedanta/datum-ui` — 18 section-view icons (exchanger, vessel, reactor, column, skid, pipeSpool, tank, crane, weldTorch, ndtProbe, stamp, drawing, bellows, telescopic, valve, damper, flange, machining) drawn to the §12 spec (24×24, 1.5px stroke, squared caps/joins, section views, currentColor). Stories + a11y-map entry added per the package's NEW COMPONENT CHECKLIST. `ProductCard` gains an optional `icon` slot (ignored when a photo is passed — photography stays the end state), and both home-page grids now pass mapped icons. **Human review point:** eyeball the `AllIcons` story in Storybook — the icon subagent flagged `weldTorch`, `crane`, `machining`, and `flange` as the geometries most worth checking at 16px.

**A3. Doors-first group home:** hero compressed to copy-only; the two-doors section (the page's stated reason to exist) now sits in the first scroll; the exploded-view heat exchanger moved below the doors as the shared-capability statement. Logged in `docs/decisions.md` — revert is a single-section move if it doesn't feel right in the browser.

**A4. Audit report** committed at `docs/frontend-audit.md` (25 ranked findings, 4 clean-bill files).

---

## Phase B — content & assets (Swayam / client; blocks launch, not code)

1. Generate + drop in the exploded-view frames (`docs/exploded-view-image-generation-guide.md`) → `apps/web/public/exploded/<product>/frame-01..05.{avif,webp}`.
2. Decide audit P0-3: swap DEMO figures for engineering data, or gate the capabilities page.
3. Works photography shoot (both sites) — the #1 visual asset; feeds product cards (replacing the interim icons), project cards, §20 strips.
4. Testimonials / named-client permissions (launch gate 6), env credentials (gate 8), staging LCP run (gate 3).
5. Reword launch-checklist gate 10 to name the exploded-view imagery exception.

## Phase C — next code session (P1 punch list from `docs/frontend-audit.md`; frontend-only)

In priority order — each is small, none touches backend:
1. MobileBottomBar overlap: bottom padding + `env(safe-area-inset-bottom)` on consuming pages (findings #4).
2. Dead/404 links: Dhruv footer `certificationsHref` → `/dhruv-epc/proof`; remove or stub `/projects` and `/company` nav links until routes exist (#5, #6); add Proof to Dhruv header nav (#24).
3. Group mega-menu: include Dhruv's fabrication-machining group (#7).
4. RFQ focus management: focus first invalid field on error, focus step heading on step change (#8); step-2 requirement recap (#22).
5. UploadDropzone: surface the 5-file-cap discard (#9); validate dropped file types (#17); derive hint text from props (#16).
6. Thank-you page: company/product links + phone/email fallback (#12).
7. MobileDrawer reduced-motion variants (#11) + aria-label dedupe (#19).
8. Proof page: drop DEMO validity-date disclaimer, omit dates until sourced (#10) — pairs with Phase B-2.

## Phase D — post-launch

P2 polish from the audit (#13–#25 remainder: accent dedupe in group header, tel: helper, phone-input cursor fix, FAQ chevron glyph, next/link adoption in datum-ui via a link-component prop, mobile anchor rail, SpecTable sticky-hover, figures-first rail label), exploded-view v2 (multi-callout dimension labels wired to spec-table records), RFQ funnel events, and the works-photo rollout replacing card icons.

---

## Standing verification protocol (every phase)

`pnpm typecheck && pnpm lint && pnpm test && pnpm build` locally (the Cowork sandbox can run typecheck/lint but not vitest/build), then the Datum UI checklist: focus-visible on dark and light, reduced-motion at OS level, 320px, one accent-filled element per view. Any rule override → `docs/decisions.md` first, code second.
