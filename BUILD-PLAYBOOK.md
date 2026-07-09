# BUILD-PLAYBOOK.md — Claude Code Sessions for the Vedanta Platform

How to drive Claude Code, session by session, from empty repo to launch.
Companion to CLAUDE.md (rules) and docs/vedanta-group-platform-plan.md (what
to build). This file is for YOU, the operator — CLAUDE.md is for the agent.

Conventions used below:
- `$` = your terminal. `>` = a prompt you paste into Claude Code.
- Every session starts in the repo root with `claude`, ends with a commit + push.
- Model per session is stated. Switch with `/model <name>`. Check with `/status`.
- One session = one task. If a session sprawls, commit what's green and restart.

---

## SESSION 0 — Phase 0: stop the bleeding (current live site)
**Model:** sonnet · **Branch:** none (this is server-config work, not the new repo)

This phase happens on the existing hosting, not in this codebase. Use Claude
Code only as an advisor:

> Here is my current .htaccess / server config [paste]. Identify what returns
> HTTP 409 to GPTBot, ClaudeBot, PerplexityBot and Googlebot on inner pages,
> and give me the minimal change to return 200 to all crawlers. Also give me
> the 301 rule to redirect [duplicate domain] wholesale to
> vedantagroup.net/dhruv-epc/ preserving paths.

Manually: delete Envato demo copy, the "Play Intro" audio gate, and
`user-scalable=no`; fix the Dhruv Exports link. Verify with:
`curl -A "GPTBot" -I https://vedantagroup.net/dhruv-epc-solutions/` → expect 200.

**Gate:** all three current sites return 200 to AI crawler user-agents.

---

## SESSION 1 — Scaffold the monorepo
**Model:** sonnet · **Branch:** `main` (initial commit) then `phase-1-foundations`

```
$ mkdir vedanta-platform && cd vedanta-platform && git init
$ mkdir docs && cp <path>/datum-design-system.md <path>/vedanta-group-platform-plan.md docs/
$ cp <path>/CLAUDE.md .
$ claude
```

> Read CLAUDE.md, then docs/vedanta-group-platform-plan.md Part III §T-1 and
> §T-2 in full.
>
> Scaffold exactly the repo structure in §T-2: pnpm + Turborepo; apps/web as
> Next.js 14+ App Router with TypeScript strict; empty packages/tokens,
> packages/datum-ui, packages/schemas with correct package.json wiring;
> content/redirect-map.csv with header row only; docs/mistakes.md with a
> one-line header.
>
> Set up CI (GitHub Actions): typecheck, lint (with
> tailwindcss/no-arbitrary-value as error), vitest, build. Add placeholder
> jobs for axe and Lighthouse budgets marked TODO with the budget numbers
> from plan §P-4 in comments.
>
> Do not build any components or pages. Scaffold only. When done, run
> pnpm typecheck && pnpm lint && pnpm build and show me the output.

```
$ git add -A && git commit -m "chore: scaffold monorepo per plan §T-2" 
$ git branch -M main && git remote add origin git@github.com:<you>/vedanta-platform.git
$ git push -u origin main
$ git checkout -b phase-1-foundations
```

**Gate:** CI green on the empty app.

---

## SESSION 2 — Tokens (Datum made executable)
**Model:** sonnet · **Branch:** `phase-1-foundations`

> Read docs/datum-design-system.md §4 (color), §5 (type), §6 (spacing/grid),
> §7 (motion), and §26 (token architecture) in full before writing anything.
>
> Build packages/tokens:
> 1. primitives.ts — every named value from the Datum spec verbatim: steel
>    scale, arc scale, signal colors, spacing scale, radii, shadows,
>    durations, easings, font stacks. No value invented; every value
>    traceable to a spec section (cite the section in a comment).
> 2. Propose a flex-blue scale for Precise Engineers (4 steps: 300/500/600/
>    700) mirroring the arc scale's structure. For each flex step, compute
>    and list the WCAG contrast ratio against steel-0 and steel-900. Every
>    pairing must meet the contrast covenant in §4.5. Show me the proposed
>    hex values and ratios BEFORE writing them to primitives.ts — this is a
>    design-review event per CLAUDE.md.
> 3. semantic.ts — three alias maps (group / dhruv / precise) per plan §5.
>    Components consume only this layer.
> 4. tailwind.ts — preset generated from semantic maps, emitting CSS
>    variables scoped by [data-company].
> 5. Vitest: every semantic alias resolves to a primitive; no orphan tokens;
>    contrast-covenant pairs assert their minimum ratios numerically.

Review the flex scale yourself before approving. Then:

```
$ git add -A && git commit -m "feat(tokens): Datum primitives + arc/flex semantic maps per §4-7, §26"
$ git push -u origin phase-1-foundations
```

**Gate:** contrast tests pass; you have personally approved the flex hexes.

---

## SESSION 3 — CMS schemas + Zod (the validation-as-law layer)
**Model:** sonnet · **Branch:** `phase-1-foundations`

> Read plan §T-3 (data model) and CLAUDE.md "CMS rules" in full.
>
> Build packages/schemas:
> 1. cms.ts — Zod schemas for every type in §T-3: Company, Product,
>    CapabilityRow, Certification, Approval, Client, Testimonial, Project,
>    EntityRecord. Enforce in the schema itself: Product.oneLineScope must
>    match /\d/; Testimonial requires attnCompany, attnRole, provenance
>    (publish-blocking, no optional); alt text required on every image field.
> 2. rfq.ts — Zod for the RFQ payload per plan FR-3: two-step shape,
>    file-key array (max 5), honeypot field, submission timestamp for the
>    time-trap.
> 3. jsonld.ts — typed builder functions (schema-dts) for Organization,
>    LocalBusiness, Product, FAQPage, BreadcrumbList, Article — each
>    consuming the corresponding CMS type. No free-form JSON.
> 4. Vitest: a numberless scope fails; an unattributed testimonial fails;
>    a valid record round-trips; each JSON-LD builder emits valid schema.org.

Commit, push. Open PR `phase-1-foundations` → `main`, review, merge.

**Gate:** the failure tests fail for the right reasons (check them by hand once).

---

## SESSION 4 — Component library, part 1: primitives
**Model:** **fable** (`/model fable`) · **Branch:** `phase-2-components`

This is the first long-horizon session. Give it the goal, not the steps:

> Read CLAUDE.md fully. Read docs/datum-design-system.md §13 (buttons),
> §14 (forms), §15 (tables), and §27 (build order).
>
> Goal: packages/datum-ui contains, complete and spec-faithful: Stamp,
> DatumRule, Button (all variants incl. variant="rfq"), form fields (input,
> select, textarea, choice-card), UploadDropzone (presigned-PUT contract,
> per-file progress, per-file retry, confidentiality caption slot), and
> SpecTable (desktop table + mobile pinned-first-column scroll with
> affordance shadow + definition-list reflow preserving label/value
> association).
>
> Loop per CLAUDE.md: read the governing section before each component;
> Storybook story per component in both dhruv and precise themes; keyboard
> contract implemented; reduced-motion variant; axe pass per story.
>
> Verify pass is separate: after building all components, re-read each
> Datum section and diff the built component against it line by line.
> Report deviations as a list — do not silently fix without noting.
> If any spec point is ambiguous, name it and stop rather than guess.

Let it run. Fable holds long sessions — don't hover, check in at milestones.
If `/status` shows the session silently switched to Opus (classifier reroute),
`/model fable` to return; it's rare on this codebase.

**Gate:** every Storybook story passes axe; your own keyboard-tab through
each component shows the focus ring everywhere.

---

## SESSION 5 — Component library, part 2: composition
**Model:** fable · **Branch:** `phase-2-components`

> Read Datum §16 (cards), §17 (navigation), §18 (footer), §19 (heroes),
> §20 (trust components), §22 (proof pages).
>
> Goal: ProductCard (scope-line slot is required — no numberless render),
> ProjectCard, StatBand (mono figures + source captions), mega-menu header
> with capability rail, mobile drawer, mobile bottom bar (call / WhatsApp /
> RFQ), title-block footer consuming EntityRecord, hero variants (home,
> product, page), CertificationCard, ApprovalsMatrix, ClientWall (text-tile
> fallback), Testimonial (no unattributed layout — enforce via required
> props, not runtime checks).
>
> Same loop, same separate verify pass. Additionally verify: with both
> theme scopes applied, exactly zero components reference arc- or flex-
> tokens directly — everything through the accent alias.

PR `phase-2-components` → `main`. Review the diff yourself — especially any
place the agent noted a deviation. Merge.

**Gate:** `grep -rn "arc-\|flex-" packages/datum-ui/src/components` returns
only token-file imports, zero class names.

---

## SESSION 6 — RFQ engine end-to-end
**Model:** fable · **Branch:** `phase-3-proving`

> Read plan FR-3 and §T-4 (RFQ pipeline) and Datum §23 in full.
>
> Goal: /request-a-quote works end to end against R2/S3:
> api/presign (scoped, expiring, file-type + size validated), client flow
> (choice-cards prefiltered by ?company=, two steps, upload-before-submit
> with per-file progress/retry), api/rfq (server-side Zod re-validation,
> honeypot + time-trap, rate limit, idempotency key), notifications (email
> via Resend; WhatsApp ping stubbed behind an interface), thank-you with
> mono reference number and restated SLA.
>
> Failure paths are the priority: network drop mid-upload preserves all
> field state; API failure shows plain error + email/WhatsApp fallback
> block; JS disabled renders the static fallback instruction block.
>
> Playwright: happy path, upload-retry path, honeypot rejection, JS-off
> fallback. Run them and show output.

**Gate:** you personally submit a test RFQ with a real PDF from your phone
on 4G and receive the email within a minute.

---

## SESSION 7 — Proving pair 1: Dhruv home + Heat Exchangers
**Model:** fable · **Branch:** `phase-3-proving`

> Read Datum §19 (home hero), §21 (product page template), plan §6.
> Read the seeded CMS content for Dhruv EPC and the heat-exchangers product.
>
> Goal: /dhruv-epc/ and /dhruv-epc/equipment/heat-exchangers/ complete per
> the templates — spec table first scroll, FAQ block (from CMS, rendered
> visibly AND as FAQPage JSON-LD via the typed builder), breadcrumbs
> emitting BreadcrumbList, OG image via @vercel/og (product name + one spec
> figure on graphite), amber law holding (exactly one arc-filled element).
>
> Verify: axe zero criticals; Lighthouse on throttled 4G meets §P-4 budgets
> (show the numbers); view-source shows valid JSON-LD; exactly one H1.

Then the vision loop — this is where Fable's self-checking earns its cost:

> Screenshot /dhruv-epc/equipment/heat-exchangers/ at 1440px and 375px.
> Compare against Datum §21's template description point by point. List
> every deviation before fixing anything.

**Gate:** you read the page as Persona A (proposal engineer): can you
qualify DN/tonnage/codes in 90 seconds without scrolling past the fold twice?

---

## SESSION 8 — Proving pair 2: Precise home + Metallic Bellows, + group home
**Model:** fable · **Branch:** `phase-3-proving`

Same prompt shape as Session 7 with: precise theme scope (blue law),
metallic-bellows spec fields from plan Appendix A, EJMA/ASME B31.3 codes in
the FAQ block. Then the group home per plan §6.1 (two-doors pattern, neutral
steel, both accents only inside their door cards).

PR → review → merge. **This locks the template contract.** Client UAT on the
staging URL happens here, before scale-out.

---

## SESSIONS 9–12 — Phase 4 scale-out
**Model:** **sonnet** (`/model sonnet` — this is content entry, not frontier work)
**Branch:** `phase-4-scaleout`

One session per batch:
- 9: remaining 7 Dhruv equipment pages (CMS entry + QA against template)
- 10: remaining 8 Precise product pages (Appendix A field sets)
- 11: both capability matrices + both proof hubs + contact/legal pages
- 12: 3 case studies per company (Datum §24, anonymization pattern where needed)

Per-session prompt shape:

> The template contract is locked — do not modify any component or layout.
> Enter and wire CMS content for [batch]. For each page, run the verify
> list in CLAUDE.md. Flag any content that fails schema validation (missing
> digits in scope lines, unattributed testimonials) as a content blocker —
> do not weaken the schema to admit it.

That last line matters: the schema is the quality gate; the agent must never
"fix" a validation failure by loosening validation.

---

## SESSION 13 — Redirect map + robots + sitemaps
**Model:** sonnet · **Branch:** `phase-5-launch`

> Read plan FR-8, FR-9, §T-4. content/redirect-map.csv contains the full
> legacy inventory [you supply this — crawl the old site with a sitemap
> tool first]. Build: edge middleware compiling the CSV to 301s; a CI test
> asserting every legacy URL → 301 → 200; robots.ts explicitly allowing
> Googlebot, GPTBot, ClaudeBot, anthropic-ai, PerplexityBot and disallowing
> /api/; per-company XML sitemaps + index.

**Gate:** the redirect CI test passes against the staging deploy.

---

## SESSION 14 — Launch checklist
**Model:** opus or sonnet · **Branch:** `phase-5-launch` → merge → deploy

> Run the launch gate from plan Appendix B against the production build and
> report each item pass/fail with evidence: crawler 200s (curl each UA),
> Lighthouse numbers per route type, axe results, one-accent-per-view sweep,
> testimonial attribution sweep, EntityRecord-vs-JSON-LD byte comparison,
> synthetic RFQ test, footer vendor-credit check, stock-imagery sweep.
> Do not mark any item pass without showing the evidence.

DNS cutover happens manually. Then: Search Console sitemap submission,
daily synthetic RFQ cron, 6-week coverage watch.

---

## Standing rules for every session

1. **Start:** `claude` → `/status` (confirm model) → paste the session prompt.
2. **Model routing:** fable = Sessions 4–8 only. Sonnet everywhere else.
   Fable burns limits ~2× faster — spend it on long-horizon, spec-dense work.
3. **End:** verify pass green → commit with spec-section citation → push.
   Never end a session with uncommitted green work.
4. **When the agent asks a design question:** that's the system working.
   Answer it in the session AND, if the answer is a rule, add it to CLAUDE.md
   in the same commit.
5. **When something goes wrong:** one entry in docs/mistakes.md before the fix.
6. **Weekly:** re-read mistakes.md; promote recurring patterns into CLAUDE.md.
7. **Checking in on Fable sessions:** if a session's output shows repeated
   attempts at the same component/file, that's the circuit breaker's job to
   catch — but check in anyway. A stuck loop reported at attempt 3 is better
   than one reported at attempt 3 an hour later because you weren't watching.
