# Frontend Audit — Vedanta Group (not-yet-reviewed surfaces)

Scope: RFQ flow, group pages (about/contact), Dhruv capability/proof/product pages, Precise product page, chrome components, Footer, MobileBottomBar, MobileDrawer, SpecTable, UploadDropzone. Paths are repo-relative; line numbers from current files. Design system doc excluded per brief.

## P0 — broken / ship-blocking

1. **Double footer on /about and /contact.** `apps/web/app/(group)/layout.tsx:41` renders `<Footer entity={groupEntity}>` around all group routes, and `apps/web/app/(group)/about/page.tsx:159–165` and `apps/web/app/(group)/contact/page.tsx:175–181` each render their own `<Footer>` — every group page ships two stacked full footers (duplicate entity block, stamps, sitemap). Fix: delete the per-page Footers (the layout owns chrome), or remove Footer from the layout and keep per-page.

2. **RFQ step 1 "Continue" can dead-click with zero feedback.** `apps/web/app/(group)/request-a-quote/RFQForm.tsx:99–107` — if the user hasn't picked a company (the default when arriving without `?company=`), `RFQStep1.safeParse` fails on `company`, but `errors.company` is rendered nowhere, and the `equipmentType` error node (line 202) lives inside the fieldset that only mounts when `company` is set (line 187). The primary CTA at the top of the funnel does literally nothing visible. Fix: render an error under the company fieldset (`errors.company`) and always render `errors.equipmentType`, plus move focus to the first error.

3. **Placeholder engineering data leaks into visible UI and asserted copy.** `apps/web/app/dhruv-epc/capabilities/page.tsx:16–28` — the SpecTable `note` fields ("DEMO figure — engineering data pending", "DEMO — API 650 unverified; verify before launch") render in the customer-facing Notes column; lines 106–112 add a visible "DEMO figures" banner; meanwhile `metadata.description` (11–13) and the hero lead (60) state the same unverified numbers (3,600 mm / 200 T / 400 bar(g)) as flat fact with no caveat. Fix: gate the page (or the six DEMO rows + banner) behind verified data before launch, and align metadata/hero with whatever is actually verified.

## P1 — hurts conversion or UX

4. **MobileBottomBar overlaps the bottom of every page that uses it.** `packages/datum-ui/src/components/MobileBottomBar.tsx:30–46` — `fixed inset-x-0 bottom-0 z-40` bar (~64px) with no compensating bottom padding on any consuming page (`heat-exchangers/page.tsx:192`, `capabilities/page.tsx:116`, `proof/page.tsx:98`, `metallic-bellows.../page.tsx:193`) — it covers the footer legal row / last content on mobile; also no `env(safe-area-inset-bottom)` for iOS home-indicator. Fix: add `pb-[calc(bar-height+safe-area)] md:pb-0` to consuming layouts (or a spacer inside the component) and safe-area padding on the bar.

5. **Dhruv footer certifications link points at a route that doesn't exist.** `apps/web/app/dhruv-epc/layout.tsx:44` — `certificationsHref="/dhruv-epc/proof/certifications"`; the proof hub lives at `/dhruv-epc/proof` (only `proof/page.tsx` exists). Every footer Stamp on every Dhruv page links to a probable 404. Fix: point at `/dhruv-epc/proof`.

6. **Nav/footer link to unbuilt routes.** `apps/web/components/dhruv/DhruvChrome.tsx:16–19` and `apps/web/app/dhruv-epc/layout.tsx:23,29` link to `/dhruv-epc/projects` and `/dhruv-epc/company`; the thank-you page comment (`thank-you/page.tsx:39`) confirms projects routes are Phase 4. Header links to 404s on every Dhruv page. Fix: remove or stub these links until the routes exist.

7. **Group mega-menu omits Dhruv's Fabrication & Machining line.** `apps/web/components/group/GroupChrome.tsx:13–17` merges only `static-equipment` + `skids-packages`; `fabrication-machining` (Heavy Fabrication, Heavy Machining — both RFQ equipment options) is unreachable from group-level nav. Fix: include the third group (DhruvChrome includes all three).

8. **RFQ form has no focus management or error announcement.** `RFQForm.tsx:106,134` — on validation failure nothing receives focus and errors aren't summarized/announced (individual `role="alert"` nodes exist only for equipmentType/message); on step 1→2 the clicked button unmounts, dropping keyboard/SR focus to `<body>`. Fix: on error, focus the first invalid field; on step change, focus the step heading (`tabIndex={-1}`).

9. **UploadDropzone silently discards files over the 5-file cap.** `packages/datum-ui/src/components/UploadDropzone.tsx:97–98` — `slice(0, room)` drops extras with no message; an engineer dropping 8 drawings loses 3 without knowing. Fix: surface a "Only 5 files can be attached — N were not added" notice when `list.length > room`.

10. **Proof page ships a visible "DEMO-PLACEHOLDER" admission.** `apps/web/app/dhruv-epc/proof/page.tsx:89–94` — "Certification validity dates are DEMO-PLACEHOLDER pending document scans" renders to users on the due-diligence page, undermining exactly the trust the page exists to build. Fix: omit validity dates until sourced instead of publishing a disclaimer.

11. **MobileDrawer ignores reduced-motion.** `packages/datum-ui/src/components/MobileDrawer.tsx:96,103` — scrim fade and panel slide use `duration-deliberate` transitions with no `motion-reduce:` variant, despite the Datum reduced-motion rule (the file's own comment claims exit honors it; entry doesn't). Fix: add `motion-reduce:transition-none motion-reduce:translate-x-0` (or gate `shown` on `prefers-reduced-motion`).

12. **Thank-you page is a dead end at peak goodwill.** `apps/web/app/(group)/request-a-quote/thank-you/page.tsx:35–40` — single "Back to Vedanta Group" link; no route to the company the buyer just enquired with, no equipment browsing, no contact fallback (phone/email) if they need to amend the submission. Fix: add company/product links and the fallback phone/email alongside the reference number.

## P2 — polish

13. **Second accent element in group header.** `GroupChrome.tsx:43–45` — the "Group of Companies" wordmark sub-line is `text-accent`, competing with the header RFQ button for the one-accent-per-view rule; the group layout comment (`(group)/layout.tsx:1`) even declares group scope "steel-only, no color accent". Fix: steel-500 the sub-line.

14. **Inconsistent tel: href sanitization.** `contact/page.tsx:88` and `request-a-quote/page.tsx:49` use `tel:${phone}` with raw spaces; `Footer.tsx:124` strips to `[+\d]`. Fix: share one `telHref()` helper.

15. **Phone input rewrites value on every keystroke.** `RFQForm.tsx:312` — `replace(/[\s-]/g, '')` causes cursor jumps on mid-string edits, and contradicts the spaced placeholder "+91 98765 43210". Fix: strip on blur/submit, not on change.

16. **Dropzone hint text hardcodes limits the props control.** `UploadDropzone.tsx:148` — "PDF, DWG, images · up to 25 MB each" ignores `maxSizeBytes`/`accept`; a caller overriding either ships a lying hint. Fix: derive the hint from the props.

17. **No file-type validation for drag-and-drop.** `UploadDropzone.tsx:130–134` — `accept` filters the picker only; a dropped `.zip`/`.exe` goes straight to presign/upload. Fix: check extension/MIME in `addFiles` and mark rejects as error rows.

18. **FAQ chevron is a raw "⌄" text glyph.** `heat-exchangers/page.tsx:157–159`, `metallic-bellows.../page.tsx:158–160` — rotation center and rendering vary by font/platform; the design system already ships `ChevronDown` (used in MobileDrawer). Fix: use the shared glyph.

19. **MobileDrawer duplicate label + unstyled focus.** `MobileDrawer.tsx:102,116` — both the dialog and the inner `<nav>` are `aria-label="Menu"` (announced twice); close button and rows rely entirely on global focus-visible styling on a steel-950 surface — verify contrast of the focus ring on dark. Fix: rename the nav ("Site navigation") and add explicit `focus-visible:` classes for dark surfaces.

20. **Internal navigation via raw `<a>` (full reloads, no prefetch).** `MobileDrawer.tsx:138–142`, `Footer.tsx:174–178`, `capabilities/page.tsx:90–93` — all internal routes bypass `next/link`. Fix: accept a link component prop in datum-ui (or use Link in app-side files).

21. **Anchor rail vanishes below lg — no in-page nav on mobile.** `heat-exchangers/page.tsx:169`, `metallic-bellows.../page.tsx:170` — "engineers jump, they don't scroll politely" yet mobile readers get no jump list; `sticky top-24` also hardcodes header height. Fix: render a compact horizontal anchor strip under the hero on <lg and tokenize the sticky offset.

22. **No requirement summary on RFQ step 2.** `RFQForm.tsx:273–314` — the buyer submits without seeing what step 1 captured; a one-line recap (equipment · code · qty · N drawings) with an "Edit" affordance reduces mis-submits. Fix: add a compact step-1 recap above the contact fields.

23. **SpecTable matrix: sticky column masks row hover.** `SpecTable.tsx:78` — pinned `<th>` keeps `bg-white` while the row behind tints steel-100 on hover, splitting the row visually. Fix: `group-hover:bg-steel-100` on the sticky cell (add `group` to the row).

24. **Proof hub absent from Dhruv header nav.** `DhruvChrome.tsx:15–19` — links are Capabilities / Projects / Company; the proof page (the vendor-registration reviewer's page) is reachable only via footer stamps (currently a broken href, see #5). Fix: add a Proof link to `LINKS`.

25. **Numberless card in the one-accent audit: group `capabilityRail` label.** `GroupChrome.tsx:54` — "Explore our companies" is the only numberless, adjective-style rail label in the audited set (Dhruv's is "Max sizes, materials & codes"); weak information scent on the highest-traffic menu. Fix: "Two works — 1994 · ASME U/U2 · EJMA" or similar figures-first label.

## Clean bill (no standalone findings)

- `apps/web/app/(group)/about/page.tsx` — content, sourcing discipline, and heading hierarchy all sound; only implicated in the shared double-footer (#1).
- `apps/web/app/(group)/request-a-quote/page.tsx` — layout, noscript fallback, reassurance rail all good; only the shared tel:-href nit (#14).
- `packages/datum-ui/src/components/Footer.tsx` — title-block structure, entity sourcing, stamp filtering all correct; only shared nits (#20).
- `packages/datum-ui/src/components/SpecTable.tsx` — the mobile dl reflow, scope attributes, and density handling are exemplary; one hover nit (#23).

Notably good elsewhere: RFQForm's idempotency key + field preservation on failure, UploadDropzone's presigned-PUT with scaleX progress, MobileDrawer's focus trap and scroll lock, MobileBottomBar's amber-law yielding.
