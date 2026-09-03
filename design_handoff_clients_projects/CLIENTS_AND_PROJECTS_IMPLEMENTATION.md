# Clients & Projects — implementation spec

**Artifact:** `Vedanta Brand Evolution.dc.html`, turn 3 (`3a` page, `3b` quiet grid, `3c` static band) and turn 4 (`4a` moving band).
**Source of content:** `uploads/Vedanta Group_Brochure_2026.pdf`, page 4 (clientele, sectors, approvals) and pages 2–3 (project highlights). All copy is verbatim from the brochure.
**Assets:** `assets/clients/c01…c42.png` (42 client marks), `assets/approvals/a1…a12.png` (12 TPI marks) — cropped from the brochure PDF at 3× on the detected cell grid, white-framed to remove divider hairlines, then trimmed to the ink bounding box.
**Date:** 2 September 2026

---

## 0. What this adds

The current site has no clientele grid, no sector list, no executed-job record and no TPI list — the four blocks the brochure leads with. This is the content §10 rule 15 asks for: real figures inside the existing whitespace. Nothing here changes the IA beyond one new route.

| Block | Count | Where it lives |
|---|---|---|
| Clientele logo wall | 42 marks | `/clients-projects` (full grid) + homepage band |
| Sectors served | 10 | `/clients-projects`; later the seed for `/industries` |
| Project track record | 15 named jobs (Dhruv 8, Precise 7) | `/clients-projects`, grouped by company |
| Approved & inspected by | 12 agencies | `/clients-projects`; per-job agency stays on the product page inspection record |

---

## 1. Route and navigation

- New route: `apps/web/app/(group)/clients-projects/page.tsx`. Hero `variant="photo"`, `align="center"` — the interior-page pattern (`1d`), breadcrumb on the photo, `Home → Clients & projects`.
- Header nav: the existing `Projects` item points here. No new nav item, no mega-panel change.
- Both company sub-sites link into it with a filter query (`?works=dhruv` / `?works=precise`) rather than getting their own copies of the page.
- `redirect-map.csv`: no legacy URL maps here — this is net-new. Add the route to the sitemap and to `routes-baseline` snapshots.

## 2. Content model

Three new content collections, matching the existing `content/*` JSON convention. Nothing is hardcoded in a component.

```
content/clients/*.json          { slug, name, logo, sectors[], consent: 'granted'|'requested'|'none', featuredOnHome: boolean }
content/sectors/*.json          { slug, name, order }
content/projects/*.json         { slug, company: 'dhruv-epc'|'precise-engineers', order, statement, tags[], figures[] }
content/approvals/*.json        (exists) — extend with { logo, kind: 'tpi'|'statutory'|'approved-vendor' }
```

**`consent` is a publish gate, not decoration.** A client record renders only when `consent === 'granted'`; anything else is omitted (omit-not-empty). This is the mechanism that keeps 42 unlicensed marks off production — see §5.

**`figures[]` on a project** carries the number that makes the job hard (`{ label: 'Design pressure', value: '3700', unit: 'PSI' }`), so the same record can later drive a spec-style project detail page without re-authoring copy.

## 3. Components (`packages/datum-ui`)

| Component | Props | Notes |
|---|---|---|
| `ClientLogoWall` | `clients`, `columns = 7`, `variant: 'bordered' \| 'quiet'` | `bordered` = brochure parity, `gap:1px` on a `steel-200` ground, cells white (ref `3a`). `quiet` = row rules only, 6 across (ref `3b`). Cell 112px, logo `max-height:64px`, `object-fit:contain`. |
| `ClientMarquee` | `rowA`, `rowB`, `speed = [64, 76]` | Two rows of 7 visible, counter-scrolling (ref `4a`). See §4. |
| `SectorGrid` | `sectors` | 5 × 2 hairline grid, each item a 2px `bg-accent` left rule + `text-body-lg` name. |
| `ProjectRecordList` | `projects`, `company` | `NN` index in mono `steel-400`, statement at `text-body`, tag line in mono `text-helper`. Row hover `bg-steel-50`. Horizontal rules only — same voice as `SpecTable`. |
| `ApprovalWall` | `approvals` | 6-column card grid, `Stamp`-style tiles: 56px logo box + mono caption. Reuses `CertificationCard`'s border and shadow recipe, not its `<dl>`. |

No new tokens. Everything above resolves from the existing ramp: `steel-200` hairlines, `steel-50` panel, `radius.sm` 3px, `shadow.raised`, accent `#AA3833` at 2–3px rules only. `ClientLogoWall` adds **no** accent fill — the page's one accent fill stays on the RFQ button (§7 warning 6).

## 4. `ClientMarquee` — the one animated device

```css
@keyframes client-marq-l { from { transform: translate3d(0,0,0) }   to { transform: translate3d(-50%,0,0) } }
@keyframes client-marq-r { from { transform: translate3d(-50%,0,0) } to { transform: translate3d(0,0,0) } }
```

- Track = the row rendered **twice**, `width: max-content`, `will-change: transform`. `-50%` therefore lands on a seam-free frame.
- 21 marks per row (even indices row A, odd indices row B) so all 42 pass in one lap without repeating.
- Cells are `box-sizing: border-box`, `width: calc(100% / 7)` of the container at desktop — **not a fixed px width**; the artifact hardcodes `205.714px` because it renders at a fixed 1440. Hairline `border-right` retained so it still reads as the brochure table.
- Speeds `64s` / `76s`, `linear`, `infinite`. Different periods are deliberate: equal speeds make the two rows read as one block sliding.
- `:hover` → `animation-play-state: paused` on both tracks.
- `prefers-reduced-motion: reduce` → `animation: none`, track wraps to a static 7 × 2 grid. QA this state like any other.
- Responsive: 5 visible cells at `md`, 3 at `<768`. Rows never stack into one.
- **Scope: homepage bands only.** The Clients & Projects page uses the static wall. This is the same scoping discipline as the split hero (§7 warning 17) and for the same reason.

**Rule change this depends on:** `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` §5's blanket ban on looping animation is retired (client decision, 2 Sep 2026). The ban now covers auto-advancing carousels only. That amendment is recorded in the notes file; do not re-apply the old rule in review.

## 5. Logo assets — the blocker before publish

The 42 marks in the artifact are **raster crops lifted out of the brochure PDF**. They are fine for client review and wrong for production:

1. **Rights.** Every mark is a third party's trademark. §10 rule 16 and D-5 both apply. Get written permission per client, record it as `consent` on the content record, and render only `granted`. Expect a smaller wall on day one — that is the correct outcome, not a regression.
2. **Format.** Request SVG or transparent PNG at 4× from each client's brand page or press kit. Crops from a print PDF carry JPEG ringing and a baked white ground; they will not survive a dark band or a retina display.
3. **Normalisation.** Logos arrive at wildly different optical weights (Thermax's solid red block beside Reliance's thin serif). Normalise to a fixed **optical height per mark**, not a bounding box — a 56px cap on a wordmark and a 56px cap on a roundel look nothing alike. This is a one-off manual pass, ~30 minutes, and it is what makes the wall look intentional.
4. **`alt` text** carries the company's legal name, not "logo" (§4.1 rule 5).

## 6. Data — verbatim from the brochure

### Sectors served (10)
Compressed Bio-Gas Plant · City Gas Distribution · Nuclear Power Plant · Thermal Power Plant · Hydrogen Plant · Oil & Gas (Refinery) · Fertilizer Plant · Solar Power Plant (CSP) · Hydro Power (PSP) · Chemical & Pharmaceuticals

> The brochure prints "City Gas Distribuition". Corrected to "Distribution" in the artifact and here. Confirm with the client before publish.

### Dhruv EPC Solutions — 8 jobs
1. Natural Gas Conditioning Skid with E&I and FAT for TOYO Project. 21 Mtr Long with weight of 45 MT.
2. District Regulating Station Skids for Emerson.
3. City Gas Distribution Skids for Emerson.
4. High Pressure Air Receivers with test pressure of 150 Bar for Hydropower (PSP) with repeat orders.
5. SDSS Heat Exchanger executed for Refinery as per EIL specifications.
6. ASME 'U' stamp Kettle type Heat Exchanger supplied to Australian project.
7. Developed compressor base frames and Lube oil console for MNC.
8. 300 M3 Surge Vessel System (75 M3 x 4 No's) executed including E&I for Irrigation Project.

Closing statement, carried as the section's pull-quote: *"Interested in developing design and execution challenges of static equipment and skid/modular systems in partnership or individually."*

### Precise Engineers — 7 jobs
1. Expansion Joint Designed and manufactured for CHEVRON USA with Design Pressure of 3700 PSI.
2. 2192 mm ID Inconel 625 FCCU Expansion Joint with RESCO Refractory as per UOP Standard under EIL. Cyclic life test of Inconel 625 Bellows done under TPI.
3. 1400 mm ID Turbine Crossover Pressure Balance Expansion Joint for Siemens project in Argentina.
4. Inline Pressure Balance Expansion joint for Turbine Application exported to Turkey.
5. Elliptical Expansion Joint for Sulphuric Acid Application with LRIS inspection for specific Spring Rate.
6. 1250 mm ID Hot Blast Main Expansion Joint with Refractory to Steel plant in operation since 12 years.
7. Rectangular Expansion Joint 8488 mm L X 3383 mm W with round corners exported to Saudi Arabia.

### Clientele (42, grid order)
ANDRITZ · FDH JV (Fluor · Daewoo E&C · Hyundai) · Ingersoll Rand · Voith · Emerson Process Management · Siemens Dresser-Rand · KNPC · MAN Energy Solutions · ABC Compressors · Wärtsilä · thyssenkrupp · Linde · Forbes Marshall · AM/NS India · L&T Hydrocarbon Engineering · NTPC · Reliance Industries · BARC · NPCIL · Engineers India Limited · Thermax · Nayara Energy · Bharat Petroleum · MRPL · ONGC · IndianOil · BHEL · Tata Steel · JSW Steel · ISGEC Heavy Engineering · Aditya Birla Grasim · Gujarat State Fertilizers & Chemicals · UltraTech Cement · Praj Industries · SAIL · Vizag Steel · Torrent Gas · SWCOGEN · CEM Engineering · Gujarat Gas · National Fertilizers Limited · Sagar Cement · HURL · Sterling & Wilson

### Approved & inspected by (12)
Lloyd's Register · Engineers India Limited · Bureau Veritas · TÜV NORD · SGS · MECON · PDIL · DNV·GL · TÜV Rheinland · Tata Projects · WAPCOS · CEI

> Two readings are conflated in the brochure's single row: agencies that have **inspected and released** jobs, and agencies whose **approved-vendor list** the works sits on. They are different claims to a procurement engineer. The `kind` field in §2 splits them; get the client to classify all twelve before this section publishes.

## 7. Sequencing

1. Content collections + the 15 project records and 10 sectors (no rights gate, publishable immediately).
2. `ProjectRecordList` + `SectorGrid` + `ApprovalWall`, page shell, route, snapshots. **This ships without a single client logo** and is already the most substantive page on the site.
3. Logo consent pass (§5) in parallel — client-side work, not engineering.
4. `ClientLogoWall` behind the `consent` gate.
5. `ClientMarquee` on the three homepages once the wall has enough granted marks to fill 14 cells.

## 8. Checks

- Contrast: no new pairs — every value is already in `tokens.test.ts`.
- Budget: 42 logos is the largest image payload on any route. `next/image`, AVIF, `loading="lazy"` below the fold, and the marquee's 84 `<img>` (rows duplicated) must be the **same** 42 files so the browser cache serves the duplicates. Re-measure the route against the ≤120 KB gz JS / 40 KB HTML budget.
- `prefers-reduced-motion` state of the marquee is a QA item, not an afterthought.
- No accent fill added anywhere on the page except the existing RFQ button.
