# Paste this into Claude Code

Copy everything between the rules into Claude Code, from the repo root of the Vedanta website monorepo. Drop this `design_handoff_clients_projects/` folder into the repo root first (or point at wherever you put it).

---

Read `design_handoff_clients_projects/README.md`, then `design_handoff_clients_projects/CLIENTS_AND_PROJECTS_IMPLEMENTATION.md` in full before writing any code. Also read `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` and `VEDANTA_DESIGN_LANGUAGE.md` in that folder — they are the governing design law for this repo and the spec references them by section number.

Your task: build the **Clients & Projects** feature described in those documents, in this codebase, following this codebase's own patterns.

The HTML file `design_handoff_clients_projects/Vedanta Brand Evolution.dc.html` is a **design reference, not production code**. Open it in a browser and look at options `3a`, `3b`, `3c` and `4a`. Recreate what you see there as React/Next.js components in `packages/datum-ui` and `apps/web`, using the existing Tailwind token classes, the existing component conventions, and the existing content-JSON loading pattern. Do not copy its inline styles, do not import it, do not create a new styling approach. Every colour, size and spacing value in it already exists as a token in `packages/tokens` — find the token, use the token.

Work in the order the spec's §7 gives, and stop after each numbered step for review rather than delivering all five at once:

1. Content collections and records — `content/clients/`, `content/sectors/`, `content/projects/`, plus the `logo` and `kind` extension to `content/approvals/`. Add Zod schemas in `packages/schemas` matching the existing style. All copy comes from §6 of the spec and must be entered **verbatim** — these are a real company's executed jobs and a wrong figure is a liability. Do not paraphrase, do not "improve" the grammar, do not round a number.
2. The four content components — `SectorGrid`, `ProjectRecordList`, `ApprovalWall`, `ClientLogoWall` — and the route `apps/web/app/(group)/clients-projects/page.tsx` with the interior photo hero, the stat band and the RFQ closer, per option `3a`. Wire `Projects` in the header nav to it. This step ships **without any client logos** and must look finished without them.
3. The `consent` publish gate on `ClientLogoWall`: a client record renders only when `consent === 'granted'`. Everything else is omitted, not greyed out, not placeholdered. A wall of six granted marks is the correct output, not a bug.
4. `ClientMarquee` per option `4a` — read §4 of the spec for the exact keyframes, track construction, speeds, hover-pause and `prefers-reduced-motion` behaviour. Two rows of seven visible, counter-scrolling, cells sized by `calc(100% / 7)` rather than the fixed px the artifact hardcodes. Mount it on the three homepages only; the Clients & Projects page keeps the static wall.
5. Tests, snapshots and budget: regenerate `apps/web/__snapshots__/routes-baseline/` for the new route, add the route to the sitemap, and re-measure the route against the ≤120 KB gz JS / 40 KB HTML budget with all 42 logos present. Report the numbers.

Hard constraints, all of them from the design law documents — violating any of these means the work gets reverted:

- **No new design tokens and no new colours.** If a value you need is not in `packages/tokens`, tell me rather than inventing it.
- **One accent fill per view.** On this page that is the RFQ button. The logo wall, the sector grid and the project list carry accent only as 2–3px rules.
- **Uppercase tracked type is mono/data voice only** (decision D-6). Section eyebrows, company sub-headings and card labels are title case. The project index numbers, tag lines and provenance notes are `IBM Plex Mono`.
- **Omit, never render empty.** No placeholder logos, no "coming soon", no empty-state illustration.
- **The animation rule changed on 2 Sep 2026.** §5 of the implementation notes previously banned all looping animation; it now permits the continuous logo band and bans auto-advancing carousels only. Implement the marquee. If you find a lint rule, comment or test asserting the old blanket ban, update it and say so.
- **`prefers-reduced-motion: reduce` is a first-class state**, not a fallback. The marquee renders as a static 7 × 2 grid there and must be visually complete.
- **The 42 logo PNGs in `assets/clients/` are review-grade raster crops from a print PDF.** Commit them under a clearly-named review directory and gate them behind `consent`. Do not treat them as final artwork and do not upscale or trace them. Add a TODO referencing §5 of the spec.
- Do not touch `HomeHero.tsx`, `PageHero.tsx`, `ProductHero.tsx`, the header or the footer beyond mounting the marquee and pointing one nav item at the new route.

When you are done with a step, show me the diff summary, the new route rendering, and any place you had to make a judgement call the spec didn't cover.

---

## If Claude Code asks about the repo

- Monorepo: `apps/web` (Next.js app router), `packages/datum-ui` (components), `packages/tokens` (design tokens), `packages/schemas` (Zod), `content/` (JSON records).
- `CLAUDE.md` at the repo root carries the house rules — it takes precedence over anything in this handoff on questions of code style, and this handoff takes precedence on questions of design.
