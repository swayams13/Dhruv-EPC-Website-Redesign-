# CLAUDE.md — Vedanta Platform

You are building a lead-generation platform for two industrial manufacturers
(Dhruv EPC: pressure vessels, heat exchangers · Precise Engineers: expansion
joints, bellows). The buyers are engineers who verify claims, not consumers who
browse. Every decision optimizes for: **can a proposal engineer shortlist us
from this page, and can a crawler reconstruct the claim?**

Source of truth, in order:
1. `docs/datum-design-system.md` — the design spec. Read the section before building the component. Not optional.
2. `docs/vedanta-group-platform-plan.md` — architecture, PRD, TRD, phases.
3. This file — how to work.

If code and spec disagree, the spec wins. If two specs disagree, stop and ask.

---

## How to work

### The loop (never collapse steps)

1. **Discover** — read the relevant source files before touching anything.
   UI work → the Datum section. Data work → `packages/schemas/src/cms.ts`.
   Tokens → `packages/tokens/src/primitives.ts`. Unclear scope → state what
   you found, then ask. Never assume.
2. **Plan / Execute** — smallest change that satisfies the requirement.
   No scaffolding for future needs. No abstractions with one implementation.
   No drive-by refactors of code you weren't asked to touch.
3. **Verify** — a separate pass (see "Verify" below). **Never self-graded.**
   "It looks right" is not verification. A component that compiles but uses
   `bg-[#F0670F]` has failed.
4. **Repeat / Stop** — gap found → loop from 2. Clean → stop. No "just in
   case" polish. Done is done.

### Scope discipline

- One task per session. One concern per commit. If you notice an unrelated
  bug, write it to `docs/mistakes.md` and keep going — do not fix it inline.
- If a task needs a decision that isn't in the specs (new token, new route,
  new dependency), stop and surface it. Deciding silently is the failure mode.
- Never delete or rewrite a file to "clean it up" unless that is the task.

### Ambiguity protocol

When the spec is ambiguous, do this — in order:
1. Re-read the spec section. The answer is usually there.
2. Check how an existing component solved the same problem. Consistency > novelty.
3. If still ambiguous: implement nothing, write down the two interpretations
   and your recommendation, and stop. A named blocker beats a confident guess.

### Session discipline

- Commit after every completed subtask. Small diffs are reviewable diffs.
- Long session drifting? Commit what works, note state in the PR description,
  start fresh. A fresh session re-reading this file beats a degraded one.
- Never `git push --force` on `main`. Never commit directly to `main` —
  branch per phase (`phase-2-components`), PR, human merge.

### Commits & PRs

- Conventional commits: `feat(datum-ui): spec table per Datum §15`,
  `fix(rfq): preserve field state on upload failure`, `chore:`, `docs:`.
- Commit message states **what changed and which spec section governs it**.
- PR description: what was built, which Datum/plan sections apply, what the
  verify pass covered, any deviations (there should be none) or blockers.
- Never claim "tests pass" without having run them in this session.

---

## Everything from the datum

**No arbitrary Tailwind values. Ever.**

Every color, spacing, radius, shadow, duration, and font resolves to a named
token in `packages/tokens`. `tailwindcss/no-arbitrary-value` is `error` and
cannot be suppressed. Need a value with no token? Creating the token is a
design-review event (Datum §26) — not a component commit.

```
# Permitted
bg-steel-50      text-arc-600      p-6            shadow-raised
text-flex-500    border-steel-200  duration-fast  rounded-sm

# Banned — fails CI
bg-[#F7F8F8]     p-[24px]          text-[#F0670F]   duration-[250ms]
rounded-[2px]    shadow-[0_2px_8px_rgba(0,0,0,0.08)]
```

Company theming is a CSS-variable scope, never a raw value in a component.

## Repository map

```
apps/web/app/
├── (group)/              # /, /about, /contact, /request-a-quote
├── dhruv-epc/            # all Dhruv routes
├── precise-engineers/    # all Precise routes
├── api/rfq/route.ts      # RFQ submission — dynamic, never SSG
└── api/presign/route.ts  # R2/S3 presigned PUT — dynamic

packages/tokens/src/
├── primitives.ts         # raw named values — never imported by components
├── semantic.ts           # per-company alias maps — the ONLY layer components consume
└── tailwind.ts           # preset generated from semantic maps

packages/datum-ui/src/components/   # one file per component; barrel = index.ts only
packages/schemas/src/{cms,rfq}.ts   # Zod — shared client + server
content/redirect-map.csv            # legacy URL → new URL, 301 — tested in CI
docs/mistakes.md                    # append-only incident log (see below)
```

## Company theming

Accent is a CSS-variable scope on the **route-group layout**, never a prop.

| Layout | `data-company` | Accent |
|---|---|---|
| `(group)/layout.tsx` | `group` | steel only — no color accent |
| `dhruv-epc/layout.tsx` | `dhruv` | arc amber — `--accent: arc-500` |
| `precise-engineers/layout.tsx` | `precise` | flex blue — `--accent: flex-500` |

Components reference `var(--accent)` (the `accent` alias) — never `arc-500`
directly. This is what lets one library serve both companies without forks.

## The amber law / the blue law

The RFQ button (`variant="rfq"`) is the **only** accent-filled element on a
page. One per view. Found two? One is wrong — remove it. The conversion
hierarchy depends on this being the only saturated element on screen.

## CMS rules (enforced in code, not by trust)

- `Product.oneLineScope` must contain a digit. "Heat Exchanger" alone cannot
  publish — the Zod schema rejects it. Buyers verify numbers, not adjectives.
- `Testimonial` cannot publish without `attnCompany` + `attnRole` +
  `provenance`. There is no unattributed layout. No fallback rendering.
- `Client` without a logo renders a text-tile (name + sector). Never blank.
- Entity data (footer, contact, JSON-LD) comes only from the `EntityRecord`
  singleton. Hard-coding an address in a component is a bug.

## Accessibility (WCAG 2.2 AA — build constraints, not review items)

- Focus ring: `outline: 2px solid var(--accent-focus)`, 2px offset, on
  `:focus-visible`. Never suppressed. Never overridden.
- `prefers-reduced-motion`: collapse all animation to opacity/final-frame.
  A first-class rendering mode — QA'd like any interactive state.
- Touch targets: 44×44px primary, 24×24px absolute floor.
- Alt text: required CMS field carrying technical facts ("50 T fixed-tube-sheet
  exchanger during hydrotest"), not decoration. Decorative → `alt=""` explicit.
- Real `<table>` with `scope` on headers. Mobile definition-list reflow must
  preserve label/value association programmatically.
- One H1 per page. Heading levels never skip.

## Performance budgets (CI-enforced)

| Route type | JS (gz) | HTML |
|---|---|---|
| Marketing (SSG) | ≤ 120 KB | ≤ 40 KB |
| RFQ form | ≤ 180 KB | ≤ 40 KB |

LCP ≤ 2.5s p75 on throttled 4G · CLS < 0.1 · INP < 200ms. LCP element
preloaded. Images AVIF→WebP via `next/image`. Fonts self-hosted subset WOFF2
via `next/font`. A page over budget does not merge — cut JS, not the budget.

## Persona C is a first-class user

Test every decision against: **"can a crawler reconstruct this claim?"**

- `robots.ts` explicitly allows GPTBot, ClaudeBot, PerplexityBot,
  anthropic-ai. The 409 wall stays dead.
- FAQ blocks (4–6 Q&As per product) are simultaneously `FAQPage` JSON-LD and
  the GEO fan-out surface.
- Alt text serves a11y + SEO + GEO — one required field, three audiences.
- Breadcrumbs are the `BreadcrumbList` source — one artifact, two audiences.
- JSON-LD is built by typed builders in `packages/schemas` consuming CMS
  records. Never hand-written JSON in a page file — drift between the visible
  footer and the machine record is a bug class we've eliminated by construction.

## Verify (run in order; stop on first failure)

```bash
pnpm typecheck    # TS strict — zero errors
pnpm lint         # includes tailwindcss/no-arbitrary-value
pnpm test         # Vitest — schema validation, token maps
pnpm build        # Next build — zero errors, zero warnings
```

UI changes additionally require, in a real browser:
1. Rendered output matches the governing Datum section — check against the
   spec text, not memory of it.
2. `:focus-visible` visible on every interactive element (keyboard-tab through).
3. `prefers-reduced-motion` toggled at OS level — page still fully functional.
4. 320px viewport — no horizontal scroll except tables (which get the
   affordance shadow), spec-table reflow intact.
5. Exactly one accent-filled element on screen.

Verify is a separate pass. The agent that wrote the code does not grade it —
run verification as a fresh read of the diff against the spec, or hand it to
a reviewer subagent with **only** the diff and the spec section (not the
implementation conversation).

## mistakes.md (append-only)

Every incident — a wrong assumption, a spec misread, a CI failure that
reached a PR — gets one entry in `docs/mistakes.md`: date, what happened,
root cause, the rule that prevents recurrence. If the rule is general,
promote it into this file. This file is allowed to grow; that is the point.

## Requires human review before merge (no exceptions)

- New tokens in `primitives.ts` or `semantic.ts` — design-review event (Datum §26)
- Any change to `content/redirect-map.csv` — SEO consequence
- Any `eslint-disable` anywhere (should not exist; its presence is the review)
- Any `layout.tsx` that sets `data-company`
- Any new `app/api/` route — rate-limiting + auth review
- Any new dependency in any `package.json` — justify or remove

## Never

- Never use stock photos, AI-generated images, or renders. Real works
  photography only. A missing photo renders the layout's no-photo variant.
- Never write superlatives without a sourced number. "World-class quality" is
  banned; "100% document adherence, EIL evaluation 2024" is the house style.
- Never let Dhruv proof (certs, testimonials, clients) render on Precise
  routes or vice versa. Entity bleed is a publish-blocking bug.
- Never add a carousel. Datum bans them. The answer to "where do the other
  images go" is the gallery grid.
- Never bypass presigned upload with a server-body upload "just for now" —
  the 4.5MB Vercel limit makes this a silent production failure.
- Never mark a task complete with failing or skipped verification. Report
  the failure. An honest blocker beats a false green.
