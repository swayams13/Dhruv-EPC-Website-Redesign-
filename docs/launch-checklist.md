# Launch Checklist — Vedanta Platform

**Session:** 14  
**Date:** 2026-07-14  
**Branch:** main  
**Gated by:** Human DNS cutover — do not proceed without client sign-off on client-gated items below.

---

## Full Gate Run Results

```
pnpm typecheck   PASS   4/4 packages, 0 errors (turbo cache hit, e1f76884)
pnpm lint        PASS   0 warnings, 0 errors — no arbitrary values, no eslint-disable
pnpm test        PASS   175 tests across 7 test files — 0 failures (re-counted 2026-08-27, Session 0)
  @vedanta/tokens:   33 tests, 1 file (token covenant, §4.5 contrast ratios)
  @vedanta/schemas:  39 tests, 3 files (cms.test.ts: 8, jsonld.test.ts: 21, rfq.test.ts: 10)
  @vedanta/datum-ui: 77 tests, 1 file (a11y.test.tsx — axe WCAG 2.x A/AA, 24 components × stories)
  @vedanta/web:      26 tests, 2 files (redirects.test.ts: 8, css-parity.test.ts: 18 — globals.css/semantic.ts parity)
pnpm build       PASS   35 static routes + 6 dynamic, 0 errors, 0 warnings
  First Load JS (marketing routes): 93.8 kB — UNDER 120 kB budget
  First Load JS (RFQ route):        112 kB  — UNDER 180 kB budget
```

---

## Appendix B Gate Table

| # | Gate | Status | Evidence |
|---|------|--------|----------|
| 1 | 200s to all AI crawlers | **PASS** | `robots.ts` explicitly allows GPTBot, ClaudeBot, PerplexityBot, anthropic-ai, Google-Extended, Googlebot with `allow: '/'`; `/api/` disallowed only |
| 2 | Redirect map CI-verified | **PASS** | `content/redirect-map.csv` — 66 data rows (67 lines − 1 header); CI step "Redirect map integrity" validates format; step "Redirect runtime test" runs 301 checks against live server |
| 3 | LCP ≤ 2.5s p75 | **CLIENT-GATED** | Requires staging deployment for real Lighthouse run; CI step is placeholder pending first deployable URL |
| 4 | axe zero criticals | **PASS** | 71 axe tests across 24 components (all datum-ui stories) — 0 WCAG A/AA violations; color-contrast numerically enforced in tokens.test.ts; CI axe-core playwright gate is placeholder (requires deployed server) |
| 5 | Every product `oneLineScope` has a number | **PASS** | Zod regex `/\d/` enforced at parse time in `packages/schemas/src/cms.ts:31`; 8 cms schema tests pass including digit rejection test |
| 6 | Every testimonial attributed | **CLIENT-GATED** | No Testimonial records in `apps/web/lib/content/` — testimonials not yet seeded. Zod blocks publish without `attnCompany` + `attnRole` + `provenance`. Schema gate exists; content gate depends on client supplying verified quotes. |
| 7 | Entity record matches JSON-LD | **PASS** | All 18 product/proof pages call `buildOrganization`, `buildLocalBusiness`, `buildProduct`, `buildFAQPage`, `buildBreadcrumbList`, or `buildArticle` from `@vedanta/schemas` with EntityRecord as input. Zero hand-written address/phone/email strings found in any page file. `buildBreadcrumbList` normalizes to trailing-slash canonical (Session 14 Task 1, commit 8e0bd83). |
| 8 | RFQ synthetic test passing | **CLIENT-GATED** | Requires `STORAGE_*`, `RESEND_API_KEY`, `RFQ_NOTIFY_*` credentials. API route exists at `/api/rfq`; presign route at `/api/presign`. Gate runs only against a live deployment with real env vars. |
| 9 | Footer has no vendor credit | **PASS** | `packages/datum-ui/src/components/Footer.tsx` Zone 3 contains: Privacy, Terms, LinkedIn (optional). No "Built by", "Powered by", or agency attribution string anywhere in the file. |
| 10 | Zero stock imagery | **PASS** | All `gallery: []` in `apps/web/lib/content/dhruv-epc.ts` (8 products) and `precise-engineers.ts` (9 products). No `<img src>` or `next/image src` pointing to external domains (unsplash, pexels, picsum, lorempixel, cloudinary, amazonaws) found anywhere in `apps/web/app/`. Comment in dhruv-epc.ts: "real works photography pending (plan §P-5) — no-photo variants render". |

**Summary: 7 PASS · 3 CLIENT-GATED · 0 FAIL**

---

## Client-Gated Items

These cannot be verified without client input or a live staging deployment. DNS cutover is blocked until all three are resolved.

### CG-1: LCP ≤ 2.5s p75 (Gate 3)

**What's needed:** A Vercel (or equivalent) preview deployment URL.  
**What to run:** `@lhci/cli` against the preview URL, or Lighthouse in Chrome DevTools on a throttled 4G connection profile.  
**Target:** LCP ≤ 2.5s at p75, CLS < 0.1, INP < 200ms. LCP element (`<img>` on hero) must carry `priority` prop — verify in rendered HTML (`<link rel="preload" as="image">`).  
**CI stub:** `.github/workflows/ci.yml` step "Performance budgets (Lighthouse CI)" already contains the target thresholds — wire `@lhci/cli` to the preview URL once available.

### CG-2: Testimonial attribution (Gate 6)

**What's needed:** Client to supply verified testimonial quotes with: verbatim quote (≤ 40 words), company name, role/designation, and provenance (e.g. "Vendor performance evaluation report, BPCL, 2024").  
**What to do:** Add records to `apps/web/lib/content/dhruv-epc.ts` or `precise-engineers.ts` as `Testimonial` objects — the Zod schema in `packages/schemas/src/cms.ts` will reject any record missing `attnCompany`, `attnRole`, or `provenance` at parse time.  
**Risk if skipped:** Testimonial component exists in the design system (a11y tested); no seeded data means the testimonial section simply doesn't render on company pages. Not a blocker for launch, but buyer trust signal is absent.

### CG-3: RFQ synthetic test (Gate 8)

**What's needed:** Production/staging env vars: `STORAGE_BUCKET`, `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `RESEND_API_KEY`, `RFQ_NOTIFY_TO`, `RFQ_NOTIFY_FROM`, `DATABASE_URL`.  
**What to run:** End-to-end test: POST a multipart RFQ payload to `/api/rfq`, verify 200 response, verify email delivered to `RFQ_NOTIFY_TO`, verify file appears in R2 bucket.  
**Risk if skipped:** The API route compiles and the presigned upload flow works in dev — but production storage and email delivery are unverified until this test runs with real keys against a live environment. This is a launch-blocking gate; do not cut DNS without a successful E2E RFQ submission.

---

## Notes

- **Classnames-order warnings** in `apps/web/app/precise-engineers/capabilities/page.tsx` (lines 94, 102, 112, 120): fixed in Session 14 cleanup commit — class order auto-corrected by ESLint. Lint now clean at 0 warnings.
- **axe-core CI step** is a placeholder in `ci.yml` — it echoes intent but does not fail. The `pnpm test` axe run (71 component-level tests) is the actual gate. Route-level axe testing via Playwright requires a running server and is deferred to post-deploy QA.
- **Redirect map:** 66 rules validated. Session 13 added 57+ rules and the CI runtime test step. The integrity check (`node -e "..."`) and the runtime test (`scripts/test-redirects.mjs`) both run on every push to `main` and `dev`.
- **JS budget:** All marketing routes at 93.8 kB First Load JS (budget: 120 kB gz). RFQ at 112 kB (budget: 180 kB). Both comfortably under budget as of this build.
