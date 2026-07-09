# progress.md — Vedanta Platform Build Log

Running log of what's done, what's next, and problems encountered.
Updated end of each session.

---

## Sessions completed

### Session 0 — Bleeding fix (live site)
**Status:** Not started — this is server-config work on the existing hosting, not in this repo.
**Pending:** Apply .htaccess / crawler 200 fix, delete Envato demo copy, fix audio gate, fix `user-scalable=no`, fix Dhruv Exports link.
**Gate:** `curl -A "GPTBot" -I https://vedantagroup.net/dhruv-epc-solutions/` → 200.

---

### Session 1 — Scaffold monorepo
**Status:** Complete ✅
**Branch:** `phase-1-foundations` → merged to `main` (PR #1)
**Date:** 2026-07-09

#### What was done

- Scaffolded pnpm + Turborepo monorepo with `apps/web` (Next.js 14.2, App Router, TypeScript strict), `packages/tokens`, `packages/datum-ui`, `packages/schemas`
- Wired workspace packages (`@vedanta/tokens`, `@vedanta/datum-ui`, `@vedanta/schemas`) as deps in `apps/web`
- Set up Tailwind v3 with `datumPreset` from `packages/tokens/src/tailwind.ts`
- Company theming via CSS variables: `[data-company="dhruv"]` → `--accent: arc-500`, `[data-company="precise"]` → `--accent: flex-500`
- Route groups: `(group)/`, `dhruv-epc/`, `precise-engineers/` with correct layout wiring
- API routes: `api/rfq/route.ts`, `api/presign/route.ts` (dynamic, stubs only)
- `robots.ts` explicitly allowing GPTBot, ClaudeBot, PerplexityBot, anthropic-ai
- `sitemap.ts`, `_not-found.tsx`, security headers in `next.config.mjs`
- Zod CMS schemas in `packages/schemas/src/cms.ts` covering all types: `Product`, `Testimonial`, `Certification`, `Approval`, `Client`, `Project`, `EntityRecord`
- `content/redirect-map.csv` (header row only, ready for Session 13)
- `docs/mistakes.md` created (append-only incident log)
- CLAUDE.md and BUILD-PLAYBOOK.md authored and committed
- CI (GitHub Actions): typecheck → lint → test → build → redirect-map integrity → axe placeholder → Lighthouse placeholder
- Vitest: 8 tests in `packages/schemas/src/cms.test.ts` covering CMS validation rules

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  8/8 tests
pnpm build       ✓  10 routes, zero errors/warnings
```

---

## Problems faced & how we tackled them

### 1. `pnpm install` blocked by `unrs-resolver` build
**Error:** `ERR_PNPM_IGNORED_BUILDS` — `unrs-resolver` requires a native build step but pnpm blocked it by default.
**Attempted:** `pnpm approve-builds` — interactive command, not usable in a scripted session.
**Fix:** Added `allowBuilds: unrs-resolver: true` to `pnpm-workspace.yaml`. In pnpm v9+, build approvals belong in `pnpm-workspace.yaml`, not `package.json`'s `"pnpm"` field.

### 2. Turbo `Could not resolve workspace` — missing `packageManager`
**Error:** Turbo couldn't find the workspace.
**Fix:** Added `"packageManager": "pnpm@11.10.0"` to root `package.json`. Turbo v2 requires this field to locate the workspace manager.

### 3. `packages/tokens/src/semantic.ts` typecheck failure
**Error:** `satisfies Record<Company, typeof semanticBase>` failed — literal hex values from `as const` made `flex-500` incompatible with `arc-500`'s exact type.
**Fix:** Removed the `satisfies` constraint, keeping only `as const`. The shapes are structurally compatible at runtime; the strict type constraint was unnecessary.

### 4. `packages/tokens/src/tailwind.ts` — Cannot find module 'tailwindcss'
**Error:** `packages/tokens` didn't declare tailwindcss as a devDependency. In pnpm strict isolation, each package can only access what it declares.
**Fix:** Added `"tailwindcss": "*"` to `packages/tokens/package.json` devDependencies.

### 5. `apps/web/tailwind.config.ts` typecheck error
**Error:** `datumPreset as Config` failed because a Tailwind preset object lacks the `content` field required by `Config`.
**Fix:** Double-cast: `datumPreset as unknown as Config`. Standard pattern for Tailwind preset usage.

### 6. `next.config.ts` not supported by Next.js 14
**Error:** Next.js 14 only supports `.js` or `.mjs` for the config file; `.ts` requires Next.js 15+.
**Fix:** Renamed to `next.config.mjs` and converted TypeScript type annotations to JSDoc comments.

### 7. `pnpm turbo lint` — `Could not resolve tailwindcss` (the hard one)
**Error:** `eslint-plugin-tailwindcss` → `tailwind-api-utils` → `loadConfigV3` → `localPkg.resolveModule("tailwindcss", { paths: ["."] })` → `mlly.resolvePathSync` fails because `"."` is a relative path, not an absolute URL.

**Root cause (traced through the stack):**
- `apps/web/.eslintrc.json` had `settings.tailwindcss.config: "tailwind.config.ts"` (relative path)
- `tailwind-api-utils` computes `pwd = path.dirname("tailwind.config.ts")` → `"."`
- It then calls `localPkg.resolveModule("tailwindcss", { paths: ["."] })`
- `local-pkg` uses `mlly.resolvePathSync` with `url: ["."]` — a relative value that mlly cannot resolve to a real package location
- `resolveModule` returns `undefined` → throws `"Could not resolve tailwindcss"`

**Attempted fixes that did not work:**
- Moving `eslint-plugin-tailwindcss` from root devDeps to `apps/web` devDeps — same error
- Adding `.npmrc` with `public-hoist-pattern[]=tailwindcss` — no effect without reinstall, and still doesn't fix the path issue
- Adding `tailwindcss` to root `package.json` devDependencies — available in root node_modules but the relative path resolution still breaks mlly

**Fix that worked:** Remove `settings.tailwindcss.config` entirely from `apps/web/.eslintrc.json`. Without that setting, the plugin falls back to `resolveDefaultConfigPath()` from `tailwindcss/lib/util/resolveConfigPath`, which searches from the linted file's directory and returns an **absolute path**. `path.dirname(absolutePath)` is an absolute directory, which `mlly.resolvePathSync` handles correctly.

**Rule:** Never set `settings.tailwindcss.config` to a relative path. Either omit it (let the plugin auto-discover) or use an absolute path.

---

## What's remaining (BUILD-PLAYBOOK.md)

| Session | Goal | Branch | Model | Status |
|---------|------|--------|-------|--------|
| 0 | Bleeding fix — live site crawler 200s | (server config) | advisor | Not started |
| 1 | Scaffold monorepo | phase-1-foundations | sonnet | ✅ Done |
| 2 | Tokens — primitives + semantic maps + contrast tests | phase-1-foundations | sonnet | Not started |
| 3 | CMS schemas + Zod + JSON-LD builders | phase-1-foundations | sonnet | Partial (cms.ts done, rfq.ts stub, jsonld.ts missing) |
| 4 | Component library part 1 — primitives (Button, form fields, SpecTable) | phase-2-components | fable | Not started |
| 5 | Component library part 2 — composition (cards, nav, footer, hero, trust) | phase-2-components | fable | Not started |
| 6 | RFQ engine end-to-end | phase-3-proving | fable | Not started |
| 7 | Dhruv home + Heat Exchangers page | phase-3-proving | fable | Not started |
| 8 | Precise home + Metallic Bellows + group home | phase-3-proving | fable | Not started |
| 9–12 | Scale-out — all remaining product/capability/proof/case-study pages | phase-4-scaleout | sonnet | Not started |
| 13 | Redirect map + robots + sitemaps | phase-5-launch | sonnet | Not started |
| 14 | Launch checklist | phase-5-launch | opus/sonnet | Not started |

### Immediate next: Session 2 — Tokens

Key items before starting:
- **Human must supply the flex-blue hex scale** — agent proposes values + WCAG contrast ratios, human approves before anything is written to `primitives.ts` (design-review gate per CLAUDE.md)
- Start on `phase-1-foundations` branch (already exists, already tracking remote)
- Session prompt is in BUILD-PLAYBOOK.md §SESSION 2

### Known gaps carried into Session 2

- `packages/schemas/src/rfq.ts` — stub file, needs the two-step RFQ Zod schema, honeypot field, time-trap (SESSION 3)
- `packages/schemas/src/jsonld.ts` — not yet created, typed JSON-LD builders needed (SESSION 3)
- `packages/datum-ui/src/` — empty components directory, populated in Sessions 4–5
- `content/redirect-map.csv` — header row only, needs legacy URL inventory (SESSION 13, you supply the crawl)
- Session 0 (live site) is completely untouched

---

## Open design questions (needs human answer before agent can proceed)

1. **Flex-blue hex values** — ✅ resolved 2026-07-09. Blue approved (Datum §5). See mistakes.md resolution entry.
2. **Dhruv arc-amber hex values** — are the scaffolded values (`arc-500: #F0670F`) correct, or does Swayam have a brand-spec hex?
3. **Session 0** — who is handling the live-site server config? Agent can advise; someone needs to apply it on the actual hosting.
