# mistakes.md — append-only incident log

One entry per incident: date · what happened · root cause · rule that prevents recurrence.
If the rule is general, promote it into CLAUDE.md.

---
<!-- entries go below this line -->

## 2026-07-16 — AI-generated images used as exploded-view frames (rule override)

**What happened:** Gemini-generated renders (not real works photography) placed in `apps/web/public/exploded/` for all three products (heat-exchanger, pressure-vessel, expansion-joint). CLAUDE.md §Never explicitly bans AI-generated images from the site.

**Root cause:** No real works photography exists yet for the exploded-view sequence feature. AI renders were generated as the only available source while real photography is pending.

**Decision:** User explicitly approved the override ("Rule override — use as-is") for the phase-4 prototype. The `// ═══ PLACEHOLDER PATHS — swap in real generated frames before launch ═══` comment in all three content files marks the replacement obligation.

**Rule that prevents silent recurrence:** Any PR touching `apps/web/public/` image files must state in the PR description whether the images are real works photography or AI renders. AI renders require explicit human sign-off in the PR. Never silently treat renders as photography in commit messages.

## 2026-07-09 — primitives.ts flex scale written without human review

**What happened:** Session 0 scaffold wrote hex values for the `flex` company colour scale (`flex-50` through `flex-900`) into `packages/tokens/src/primitives.ts` without first getting the exact palette approved by Swayam. BUILD-PLAYBOOK.md Session 2 is explicit that new hex values require human approval before being committed.

**Root cause:** The agent inferred placeholder colours to make `semantic.ts` satisfy `Record<Company, typeof semanticBase>` rather than blocking and requesting the real values.

**Rule:** Never write hex primitives for a company colour scale without explicit human sign-off. If real values are unknown, write `// TODO: get hex from client` comments and leave the build broken until they arrive. Do not invent plausible colours to make types pass.

**Resolution (2026-07-09):** Swayam reviewed two options — blue (Datum §5 spec) vs maroon (existing brand CSS). Approved Option A: blue. Rationale: group home two-doors pattern requires amber vs blue to read as distinct companies; amber vs maroon is visually muddled (2.02:1 contrast between the two). Existing site maroon also shared with Vedanta wordmark — entity bleed risk on Precise routes. Approved values: `flex-300: #5BA8D4`, `flex-500: #0E6BA8`, `flex-600: #0A5589`, `flex-700: #083F6A`. WCAG at flex-500 vs white: 5.70:1 (AA ✓). No code change required — these values were already in primitives.ts. Gap closed.

---

## 2026-07-09 — Precise RFQ button label has no contrast on flex-500

**What happened:** Session 2 contrast tests found that `steel-950` text on `flex-500` fill yields only 3.19:1 — below the 4.5:1 WCAG AA minimum for normal text. The Datum spec (§13) defines RFQ button as "arc-500 fill, steel-950 text" for Dhruv (amber background, dark text = 5.79:1 ✓), but doesn't specify the label color for Precise's blue variant.

**Root cause:** Spec §13 was written with Dhruv/arc in mind. The Precise company color map (`semanticPrecise`) inherited `rfq: flex[500]` fill from the extension pattern, but the label text stayed `steel[950]` — unexamined against flex-500's luminance.

**Rule:** When adding a company color variant to the semantic layer, verify all contrast pairs for that company's RFQ button (fill × label) explicitly. Don't assume the base company's text color works on the new fill.

**Fix applied (2026-07-09):** Added `rfqFg` to the semantic action map. Dhruv keeps `steel[950]`; Precise overrides to `steel[50]` (~7.1:1 on flex-500 ✓). This token is a design-review event per CLAUDE.md §26 — **needs Swayam sign-off before this PR merges.**

**Open question for Swayam:** The Precise RFQ button will render as dark-blue fill + near-white label text. Is that the intended look, or should flex-500 be lightened to work with dark text? (Lightening would change the approved hex values — another review event.)

---

## 2026-07-10 — semanticGroup.rfqFg inherited 1:1 contrast (invisible label)

**What happened:** Session 4 discovered while wiring `--accent-fg` CSS variables that `semanticGroup` overrides `rfq: steel[950]` but not `rfqFg`, which therefore inherited `steel[950]` from `semanticBase` — black label on black fill, 1:1 contrast, on any group-page RFQ button.

**Root cause:** Same class as the 2026-07-09 Precise incident: the spread-extension pattern (`...semanticBase.color.action`) silently carries the base `rfqFg` into a company map whose `rfq` fill changed. The Session 2 fix added the Precise override but did not audit group.

**Rule (extends 2026-07-09 rule):** When ANY company map overrides `rfq`, it must also explicitly set `rfqFg` — the pair travels together. A contrast test asserting `rfqFg × rfq` per company now exists in tokens.test.ts for all three companies, so recurrence fails CI.

**Fix applied (2026-07-10):** `semanticGroup.color.action.rfqFg = steel[50]` (17.4:1 on steel-950 ✓) + covenant test added.

---

## 2026-07-10 — steel-500 used for small text in four components (WCAG fail, caught by Session 7 axe pass)

**What happened:** The Session 7 page-level axe run found 17 serious color-contrast
violations across SpecTable (notes column), StatBand (source captions),
CertificationCard (dt labels), Footer (column headings) and page-level captions —
all `text-steel-500` at 12–13px. steel-500 (#7B858D) is 3.53:1 on steel-50 and
3.76:1 on white — below the 4.5:1 normal-text floor. Sessions 4–5's per-story axe
passes did not catch it because axe's color-contrast rule was evaluated against
composed stories where several of these nodes didn't render with the failing
surface pairings.

**Root cause:** §15 itself specifies "units/notes (mono 13px steel-500)" — the
spec text conflicts with §25.1's WCAG-AA-as-floor covenant. Components followed
§15 literally.

**Rule:** steel-500 is a large-text/non-text color only — never below 18px. Where
a Datum section names steel-500 for small text, §25.1 wins and steel-600 (light
surfaces) / steel-400 (graphite) is used, with a comment citing this entry.

**Fix applied:** steel-600/steel-400 substituted in all five locations; full-page
axe now zero critical/serious on both Session 7 routes.

---

## 2026-07-10 — EntityRecord.stampsHeld didn't use canonical Stamp codes (5 of 6 stamps silently dropped)

**What happened:** Seeded `stampsHeld: ['ASME U', 'ASME U2', 'ISO 9001:2015', …]`;
Footer filters through `isStampCode` against the §12 codes ('U','U2','IBR',
'ISO-9001',…) — only 'IBR' survived, and the stamps strip rendered one tile.
Caught in the Session 7 vision loop (screenshot vs §18), not by any automated gate.

**Root cause:** `EntityRecord.stampsHeld` is `z.array(z.string())` — the schema
doesn't constrain to the Stamp code vocabulary, so the mismatch validated fine
and failed silently at render.

**Rule:** stampsHeld values are the §12 Stamp codes, not display names. Candidate
hardening (Phase 4): narrow the Zod field to the canonical enum so this fails at
parse, not at render.

## 2026-07-11 — BreadcrumbList JSON-LD host drifted from sitemap host (Session 8)
**What happened:** Session 7's heat-exchangers page hard-coded
`BASE = 'https://www.vedantagroup.net'` for BreadcrumbList JSON-LD while
`sitemap.ts` and `robots.ts` use `https://vedantagroup.net` (no www). Session 8
copied the pattern, creating a second instance before the reviewer pass caught
it — the visible-record-vs-machine-record drift class CLAUDE.md exists to
prevent.
**Root cause:** canonical host constant duplicated per page file instead of
living in one place; no CI check compares JSON-LD URLs to sitemap host.
**Rule:** any absolute URL emitted into JSON-LD must use the same host string
as sitemap.ts. When Phase 4 adds more product pages, hoist BASE into a shared
lib/site.ts constant (one definition), and Session 13's redirect/sitemap CI
should assert JSON-LD hosts match the sitemap host.

## 2026-08-27 — Session 0 (B8): rate limiter duplicated between /api/rfq and /api/presign

**What happened:** `/api/presign` had no rate limit at all. Fixed by copying
the in-memory IP rate-limit pattern from `app/api/rfq/route.ts` into
`app/api/presign/route.ts` with a shorter window (60s/10 req vs 10min/5 req) —
a pragmatic duplication rather than extracting a shared module for two call
sites.

**Root cause:** no shared rate-limit helper existed; extracting one for a
two-file duplication was judged over-engineering for this session.

**Rule:** if a third route needs IP rate limiting, extract
`lib/rate-limit.ts` at that point — don't let a third copy-paste happen.

## 2026-08-27 — Session 0 (B10 hoist): BASE constant not fully hoisted

**What happened:** Created `apps/web/lib/site.ts` exporting `BASE` and
replaced the 20 per-file `const BASE = 'https://vedantagroup.net'`
redeclarations that B10's canonical-URL work already touched. Left
un-hoisted (out of scope for this session, not touched by B1–B10):
`apps/web/app/sitemap.ts` (its own `const base = ...`), and hardcoded
literal `https://vedantagroup.net` strings in
`app/(group)/contact/page.tsx` and `app/(group)/about/page.tsx`
breadcrumb JSON-LD.

**Rule:** the next session touching any of those three files should
import `BASE` from `lib/site.ts` instead of redeclaring or hardcoding it.

## 2026-08-27 — Session 0 browser verify: StickyQuoteChip low-contrast on dark sections (pre-existing, not touched)

**What happened:** browser-checking B1 (Tailwind content glob restoring
`bottom-6 right-6` on `StickyQuoteChip`) surfaced that the chip's
`variant="secondary"` `Button` uses the light-surface style (dark
`text-steel-950` on a transparent fill) regardless of what's actually
behind it — over a `steel-950` product-grid section the label is nearly
unreadable. The `bottom-6`/`right-6` positioning itself is correct
(confirms B1's fix worked); this is a separate, pre-existing contrast
bug, out of scope for this session (not one of B1–B10).

**Rule:** `StickyQuoteChip`/`Button` needs a `data-chrome`-aware
secondary variant (same mechanism `globals.css` already uses for the
focus ring on dark chrome) before this is fixed — flag for a future
session.

## 2026-08-27 — Session 1 (T3): route-level axe surfaces sitewide steel-500 text contrast failures (VG-004)

**What happened:** the new Playwright + axe-core route gate
(`apps/web/e2e/a11y.spec.ts`) is the first check that ever ran axe
against real painted routes rather than isolated jsdom component
stories (`packages/datum-ui/src/a11y.test.tsx` explicitly cannot check
color-contrast — no paint layer). It found `color-contrast` violations
on 11 of 32 routes, all traced to the same root cause: `text-steel-500`
(#7a7269) used as body/caption/menu text falls under the 4.5:1 floor
against every background it appears on — 3.8:1 on the dark Header
chrome (#14171a), 3.66:1 in the mega-menu panel (#1c1a18), and 4.15:1
against the page surface (#f2f0ea). Two further one-off violations
(muted tones #5c5850 and #b5b0a4, ratios 2.54 and 1.89) on `/` and
`/request-a-quote/thank-you/` need their own look. This is a token-
usage bug spanning `Header.tsx`, page-level muted captions, and the
thank-you page — not a one-line fix, and out of scope for a
test-harness session (CLAUDE.md scope discipline).

**Affected routes (skipped in `e2e/a11y.spec.ts` via `KNOWN_FAILURES`,
pending the fix):** `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`,
`/request-a-quote/`, `/request-a-quote/thank-you/`, `/dhruv-epc/`,
`/precise-engineers/`, `/precise-engineers/capabilities/`,
`/precise-engineers/proof/`.

**Rule:** before using `text-steel-500` (or any token below 4.5:1
against its actual background) for body/caption text, check
`packages/tokens/src/tokens.test.ts`'s contrast covenant — if the pair
isn't an explicit allowlisted exception, it needs `steel-600`+ (proven
≥4.5:1) instead. A future session should audit every `text-steel-500`
usage against its real background and either swap the token or move
the specific use to a covenant-sanctioned pair, then un-skip these
routes one at a time.

## 2026-08-27 — Session 1 (T3 verify): pre-existing `.github/workflows/ci.yml` "Redirect map integrity" step is not standard-compliant YAML

**What happened:** while validating `ci.yml` after wiring T3's
accessibility gate, two independent strict YAML parsers (PyYAML,
Ruby's Psych) both fail to parse the whole file — not because of
anything this session added, but because of a pre-existing step:

```yaml
- name: Redirect map integrity
  run: node -e "
    const fs = require('fs');
    ...
  "
```

`node -e "` is an unquoted plain scalar followed by a bare `"`, not a
proper YAML double-quoted block — the trailing `"` line dedents back
to the mapping's own indentation, which both parsers read as "scalar
ended, now expecting a new key," and choke on the orphaned quote.
Verified this predates the session (same failure, same construct, on
`git show cf7faaa:.github/workflows/ci.yml`). GitHub Actions' own YAML
parser may tolerate it — untested here — but it is not something to
build new steps on by copying the pattern.

**Root cause:** hand-written multi-line `node -e "..."` shell embedded
directly in workflow YAML instead of a `|` block scalar or a checked-in
script file.

**Rule:** out of scope for T3 (unrelated step, not one of the two
placeholders this session's brief named) — not fixed here. Next session
touching `ci.yml` should convert that step to `run: |` with the JS
written as plain shell-safe lines, or move it into
`scripts/test-redirects.mjs`-style a checked-in file, and confirm with
`python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`
that the whole file parses clean before merging.
