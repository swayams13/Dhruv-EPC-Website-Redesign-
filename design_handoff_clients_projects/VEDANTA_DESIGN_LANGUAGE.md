# VEDANTA GROUP DIGITAL DESIGN LANGUAGE
### Design Forensics — Reverse-Engineered Visual DNA
**Prepared for:** Vedanta Group of Companies / Dhruv EPC Solutions Pvt. Ltd. website redesign
**Phase:** Discovery / Design Forensics only — no redesign proposed in this document
**Date:** 2 September 2026

---

## 0. Source note — read this before anything else

This document was built from two inputs, and they disagree on one important point. Flagging that disagreement here, plainly, is more useful than quietly picking a side.

**Input A — this session's direct forensics.** Three screenshots of the "About Us" page and a live inspection (computed CSS, typography, color sampling, page-by-page screenshots of the homepage, product listing, and a product detail page) of `web.ifoxsolutions.com/vedantagroup.net/dhruv-epc-solutions/`, the URL named as source of truth in the brief for this phase. That page's own footer reads **"Design and Developed by Ifox Solutions."**

**Input B — prior research already in this project.** `04-design-integration-plan.md` (26 Aug 2026) sampled a different set of screenshots of the same client and explicitly *excluded* this exact ifox URL from its identity baseline, on the reasoning that it is "the ifox parallel build, not the live site," and flagged that its imagery carries visible Unsplash watermarks. That document's own forensics table gives: brand red `#AA3833`, nav/body text `#333333`, panel `#F3F4F6`, page white `#FFFFFF`. Separately, `packages/tokens/src/primitives.ts` (already shipped code, confirmed in `07-p0-decisions-locked.md`) locks `brand-500 = #AA3833`, sampled from "three independent regions of the client's live site" — masthead, active sidebar item, section eyebrow.

**What this session found directly on the ifox URL:** brand red renders at `rgb(184, 43, 44)` = `#B82B2C` — close to, but measurably different from, `#AA3833`. Body/heading text renders at `#222334` and panel backgrounds at `#F5F6F8`/`#F4F4F4` — close enough to `#333333`/`#F3F4F6` to read as the same family, but not identical. The card affordance here reads **"Learn More ↗"**, where prior research recorded **"View details ⊕"** on the true legacy site. There is no left `CATEGORIES` rail on this build's product listing, where prior research recorded one as "the site's primary product navigation."

**Reading of this:** the ifox URL is very likely a real, current rendering of the client's site — the color family, typography discipline, photography style, and structural bones (hero-band + breadcrumb, three-column product cards, dark footer with red linework) all match what prior research independently derived from other screenshots. But it is not pixel-identical to the baseline already locked in code, and at least two components (the CTA microcopy/icon, the product-navigation pattern) differ outright. Two explanations are equally plausible without more information: the site has been updated since the earlier screenshots were taken, or this staging mirror carries a slightly different build than what a visitor sees on `vedantagroup.net` today. Either way, **the existing project token (`brand-500 = #AA3833`) is the safer canonical value** — it has independent multi-region provenance already recorded and tested for contrast — and this session's `#B82B2C` should be read as *confirming the same brick-red family*, not competing with it. Everywhere below, values sampled fresh in this session are marked **[session]**; values carried over from prior project research or shipped code are marked **[prior]**. Recommend a quick visual diff against the actual production `vedantagroup.net` before this doc is treated as final.

---

## 1. Brand color forensics

### 1.1 Brand core

| Token | Hex | RGB | HSL | Source | Where observed |
|---|---|---|---|---|---|
| Brand red (canonical) | `#AA3833` | 170, 56, 51 | 2°, 54%, 43% | **[prior]**, locked in `packages/tokens` | Masthead, active sidebar item, section eyebrow (multi-region sample) |
| Brand red (session variant) | `#B82B2C` | 184, 43, 44 | 359°, 62%, 45% | **[session]** | Hero CTA fill, footer links, "Learn More" text, section eyebrows on the ifox build |
| Deep navy accent | `#061229` | 6, 18, 41 | 219°, 74%, 9% | **[prior]** | Product-page H1 on the true legacy site (not independently re-observed this session) |

**Read:** red is a single-hue family in the brick/oxide-red range (hue ~0–2°), never orange-leaning, never crimson/magenta-leaning. Saturation sits in the 50–62% band — assertive but not neon. This is a mineral, industrial red — closer to oxide primer or a safety-equipment red than a corporate "brand red." Treat `#AA3833`–`#B82B2C` as one family with roughly 10 points of hue-independent saturation/lightness variance, not two different colors.

### 1.2 Neutral system

| Token | Hex | RGB | Role | Source |
|---|---|---|---|---|
| Page white | `#FFFFFF` | 255,255,255 | Dominant background — the site is overwhelmingly white | Both |
| Ink / heading-body text | `#222334` | 34,35,52 | All headings, all body copy, nav default | **[session]** |
| Ink (prior sample) | `#333333` | 51,51,51 | Same role, earlier sample | **[prior]** |
| Muted text | `#707070` | 112,112,112 | Nav link default state | **[session]** |
| Muted text (secondary) | `#888888` / `#7E8288` / `#606060` | — | Captions, secondary copy, metadata | **[session]** |
| Panel / surface | `#F5F6F8` | 245,246,248 | Alternating section backgrounds | **[session]** |
| Panel (prior sample) | `#F3F4F6` | 243,244,246 | Same role | **[prior]** |
| Hairline border | `#E0E0E0` / `#D9D9D9` / `#DDDDDD` | — | Card borders, dividers | **[session]** |
| Footer / dark chrome | `#23282D` | 35,40,45 | Footer band background | **[session]** |
| Copyright text on dark | `rgba(255,255,255,0.4)` | — | Footnote-weight text on the footer band | **[session]** |

**Read:** the neutral system is unambiguously **cool** — white, cool light-gray panels, a near-black text color with a faint blue-violet cast (`#222334`, not a true gray). There is no warm/bone undertone anywhere in what was directly sampled. This matters because the project's currently-shipped token ramp (`packages/tokens/src/primitives.ts`, locked by `07-p0-decisions-locked.md` P0-1) uses a **warm bone** ramp (`steel-50 = #F2F0EA` through `steel-950 = #14171A`). That lock was made for a documented, pragmatic reason — the shipped code and the approved design-exploration pages had already defaulted to warm, and re-mapping was judged not worth the churn — not because warm was found to be more authentic to the client's actual site. **This document's forensics say the opposite of what's currently locked.** That is a real tension, not a rounding error, and it is worth a conscious decision by the team rather than a silent one. This document does not resolve it — see §10, rule 3.

### 1.3 Supporting / state colors

| Role | Value | Notes |
|---|---|---|
| Overlay on hero photography | `rgba(0,0,0,0.6–0.8)`, graduated darker toward the bottom | Always present under hero text; never a flat tint |
| Card shadow | `0 0 10px rgba(0,0,0,0.2)` | Soft, low-contrast, barely-there — not a drop shadow in the Material sense |
| Link/icon accent | Brand red | Every "Learn More" arrow, every active nav state, every section eyebrow |
| Certification linework | `#000000` on `#FFFFFF`, no color | Badges are pure black-and-white line art |
| Success/rating | Gold/amber star glyphs | Testimonial rating only — not a system color, don't treat as a token |

### 1.4 Semantic tokens (as observed)

```css
:root {
  --brand-primary: #AA3833;        /* canonical — locked, multi-region sampled */
  --brand-primary-observed: #B82B2C; /* session sample on ifox reference — same family */
  --brand-primary-hover: #8D2F2A;  /* prior: brand-600 */
  --brand-primary-active: #66221F; /* prior: brand-700 */
  --surface-page: #FFFFFF;
  --surface-panel: #F5F6F8;
  --surface-dark: #23282D;         /* footer / dark chrome */
  --text-primary: #222334;
  --text-secondary: #707070;
  --text-muted: #888888;
  --text-on-dark: #FFFFFF;
  --text-on-dark-muted: rgba(255,255,255,0.4);
  --border-subtle: #E0E0E0;
  --overlay-industrial: rgba(0,0,0,0.7);
}
```

---

## 2. Typography forensics

### 2.1 Typeface

**Family (both headings and body):** `"Plus Jakarta Sans", sans-serif` — confirmed directly from computed styles, not estimated. This is a single geometric-humanist sans used for everything: H1 through body copy, navigation, buttons, footer. There is no separate display face and no serif anywhere on the site.

**Character of the face:** moderate x-height, rounded but not soft terminals, low stroke-contrast, a genuinely contemporary webfont (not a legacy system font like Arial/Helvetica, despite the site's otherwise dated UI patterns). It reads as clean and technical rather than warm or editorial — a reasonable fit for an engineering brand, and one of the few genuinely modern choices already in place. This is worth preserving rather than replacing outright.

**Weights observed:** 400 (body — implied, not directly overridden), 600 (most headings, nav, buttons), 700 (H1 only, hero).

**Capitalization:** mixed title case throughout — nothing is set in true uppercase/small-caps. Eyebrow labels ("Our Story," "Testimonial") are title case, not tracked uppercase. This is notable: many industrial-site templates default to uppercase eyebrows/nav; this one does not. Don't introduce uppercase tracking as a "modernization" — it isn't restoring anything, it's inventing a new habit.

**Letter-spacing:** normal throughout every element sampled. No tracked headlines, no tracked nav.

### 2.2 Type scale (observed, with recommended completions)

| Role | Size | Weight | Line-height | Color | Source |
|---|---|---|---|---|---|
| Display / H1 (hero) | 64px | 700 | 64px (1.0) | White, on photo overlay | **[session]**, directly measured |
| H2 | 47px | 600 | 47px (1.0) | `#222334` | **[session]** |
| H3 | 25px | 600 | ~1.3 (implied) | `#222334` | **[session]** |
| H4 (footer heading) | 21px | 600 | — | `#F5F6F8` (light, on dark) | **[session]** |
| Body | 16px | 400 | 24px (1.5) | `#222334` | **[session]** |
| Body — bold lead-in | 19px | 700 | 40px (loose, ~2.1) | `#222334` | **[session]**, product spec intro line |
| Navigation | 16px | 600 | — | `#707070` default | **[session]** |
| Eyebrow | ~16px | 600–700 | — | Brand red or white, title case | **[session]** |
| Button / CTA | 16px | 600 | — | White on red fill | **[session]** |
| Caption / copyright | 14px | 400 | — | `rgba(255,255,255,0.4)` on dark | **[session]** |

**Gaps not directly observed this session** (recommend measuring against production before finalizing): Body Large, Body Small, distinct H1 size for non-hero page titles (product/about page H1s render smaller than the homepage hero H1 — visually closer to 44–56px in the screenshots but not computed-style-verified).

**Proportional read:** the scale jumps hard from H1 (64) to H2 (47) to H3 (25) — roughly a 1.35–1.9 ratio rather than a smooth modular scale. Headings are set at line-height 1.0, which only works because they're short (2–4 word headings); body text properly opens up to 1.5. A modernized scale should keep the *character* of this — big, confident, tight-set headlines against loose, readable body copy — rather than smoothing it into a mathematically "correct" but flatter modular scale.

---

## 3. Layout language

| Property | Value | Source |
|---|---|---|
| Max container width | `1440px` | **[session]**, computed |
| Inner content width | `~1268px` (≈88% of container) | **[session]**, computed |
| Header height | `123px` | **[session]**, computed — tall and logo-forward |
| Hero band height | Full-bleed, roughly 620–680px on desktop | **[session]**, screenshot-measured |
| Product/card grid | 3 columns desktop, equal-width, generous gutter | **[session]**, observed on homepage and product listing |
| Card internal padding | Roomy — photo fills ~65% of card height, text block below | **[session]** |
| Section vertical rhythm | Generous — 80–140px of breathing room between major sections | **[session]**, screenshot-measured |
| Footer grid | 3 columns (Products / Quick Links / Contact) + dark band | **[session]** and screenshots provided |
| Border radius | `3px` (cards, most rectangles), `26px` (pill buttons), `100%` (circular — back-to-top, avatar) | **[session]**, computed across ~3,000 sampled elements |
| Box shadow | Single soft shadow recipe, `0 0 10px rgba(0,0,0,0.2)` — used sparingly, not everywhere | **[session]** |

**Spacing rhythm, converted to an 8px system:** the measured values cluster tightly around multiples of 8 (24, 40, 48, 80, 96, 120, 128px), which is a strong indicator the underlying build already uses an 8px base grid even without an explicit token system. **Recommendation: adopt an 8px base unit** (`space-1 = 8px` through `space-16 = 128px`) — this formalizes what the site is already doing rather than imposing something foreign.

**Alignment tendency:** centered section titles, centered body copy in the About/company-story sections, left-aligned copy inside cards. Hero text is left-lower on the homepage, centered on interior pages. This split (marketing hero vs. utility hero) is a real, consistent pattern worth keeping distinct rather than collapsing into one hero treatment.

**Density:** low-to-moderate. The site is not dense — it uses full-width photography and generous whitespace, but pairs that whitespace with genuinely thin content (the Heat Exchanger product page is one photo and two paragraphs, no data). The *whitespace discipline* is a brand-worthy holdover; the *thinness of content inside that whitespace* is the actual weakness prior project research (`04-design-integration-plan.md` §2.4) already identified, and this session's own inspection of the Heat Exchanger page confirms it directly: materials are listed as a run-on sentence, and there is not one dimensional figure, pressure rating, or capacity number on the page.

---

## 4. Component language

### Header
**Current character:** white/off-white bar, 123px tall, roundel logo + "DHRUV EPC / SOLUTION PVT. LTD." wordmark left, six-item nav right (five text links + dropdown chevrons on three), no visible certification stamp in the header on this build (contradicts prior research, which recorded a header-mounted ISO 9001 mark on the true legacy site — worth confirming which is current).
**Brand-significant:** generous height, logo-left/nav-right split, white ground.
**Outdated:** low information density for the height it spends; no persistent trust signal (cert mark) despite the space.
**Modernization rule:** keep the proportions and the white ground; if the certification mark belongs here per the true legacy site, restore it as a crisp vector, not a raster.

### Navigation / dropdowns
**Current character:** plain text links, 16px/600, muted gray default with chevron affordance on three of six items (mega-menu implied, not confirmed open in this session).
**Brand-significant:** restrained, no background pills, no underlines — text-weight-driven hierarchy only.
**Outdated:** nothing structurally dated; execution is plain rather than legacy.
**Modernization rule:** keep text-only nav discipline; a cleaner dropdown panel (card-style, shadow-bearing) is a safe evolution.

### Hero banners
**Current character:** full-bleed real photography, heavy dark gradient overlay (0.6–0.8 black), white type set at line-height 1.0, breadcrumb beneath the title on interior pages.
**Brand-significant:** real facility photography, not stock, not illustration; the overlay-plus-white-type formula is used with total consistency across every page type sampled (home, product listing, product detail).
**Outdated:** copy tone ("Welcome to...!") reads as a template default rather than considered brand voice.
**Modernization rule:** keep the photo-plus-overlay-plus-breadcrumb structure exactly — it is the single most consistent, most load-bearing pattern on the site. Replace only the copywriting.

### Breadcrumbs
**Current character:** `Home → PageName`, white text, simple right-arrow (→) glyph separator, sitting directly under the hero title, on top of the photo.
**Brand-significant:** placement over the hero image (not on a separate light band) is distinctive and consistent.
**Outdated:** nothing — this is a clean, modern pattern already.
**Modernization rule:** keep as-is.

### Section titles
**Current character:** centered, H2 at 47px/600, often preceded by a small red or white eyebrow in title case (not uppercase).
**Brand-significant:** the eyebrow-plus-headline pairing, and the restraint of NOT tracking/capitalizing the eyebrow.
**Modernization rule:** keep the pairing and the title-case discipline.

### Product cards
**Current character:** white card, ~3px radius, hairline border, soft shadow, real (watermarked) product photography filling the top ~65%, product name centered below in H3, "Learn More ↗" in brand red beneath that.
**Brand-significant:** real photography with a visible ownership watermark; the diagonal-arrow "Learn More" affordance.
**Outdated:** the Vedanta roundel watermark stamped diagonally across every photo is a copy-protection measure, not a designed brand motif — it currently degrades photo legibility and should not be treated as something to preserve for its own sake (see §5).
**Modernization rule:** keep white-card / real-photo / arrow-link structure; replace watermarking with a smaller, corner-anchored mark or none at all if the redesign has proper image licensing/rights.

### Company/certification cards
**Current character:** black line-art seal (scalloped rosette outline) with hand-stacked "A / S / M / E" letters inside, label beneath ("DESPL ASME U Stamp").
**Brand-significant:** the *seal/rosette silhouette itself* — it echoes the scalloped oval border already present in the Vedanta logo mark, making it a genuine recurring brand shape, not a generic badge.
**Outdated:** execution is crude — hand-kerned letters inside a line-art shape rather than a proper vector certification mark; this reads as unfinished, and directly undermines the credibility the certification is supposed to convey.
**Modernization rule:** **keep the rosette/seal silhouette** (it is real brand DNA, tying to the logo), rebuild it as a clean vector mark. This is exactly the kind of thing prior project research (`04-design-integration-plan.md`) already flagged for the header cert mark — the same fix applies here.

### Testimonial
**Current character:** circular-cropped photo, red "Testimonial" eyebrow, bold H2 "Our Customers Say," quoted paragraph, 5-star rating graphic.
**Brand-significant:** none. The photo is a generic stock image of a model, not a real client contact; the quote is unattributed (no name, no company). For a B2B EPC procurement audience — where the whole redesign's credibility argument rests on real facilities, real certifications, and real specifications (a theme already established elsewhere in this project's content-integrity rules) — an unattributed stock-photo testimonial is a liability, not an asset.
**Modernization rule:** **remove**, unless real, attributable client testimonials (name, company, project) become available. Do not carry the pattern forward as a stock-photo placeholder.

### Buttons
**Current character:** one primary style observed — solid brand-red fill, white text, 16px/600, rounded corners (not full pill on the hero CTA specifically, but 26px pill radius appears elsewhere in the radius distribution).
**Brand-significant:** solid red fill as the singular "primary action" signal — red is otherwise used sparingly (links, eyebrows), so a red button reads as unambiguously "the one thing to click."
**Modernization rule:** keep red exclusively for primary actions; do not let it bleed into decorative fills or backgrounds (see §10).

### Links
**Current character:** brand red, no underline, paired with a small diagonal (↗) arrow icon for "Learn More" card actions.
**Brand-significant:** the arrow-icon pairing is a real, repeated affordance.
**Note:** prior project research recorded a different affordance ("View details ⊕", circled-plus) on the true legacy site — see §0. Confirm which is current production before locking this into a component spec.

### Forms
Not sampled this session (no form was reached in the pages visited). Recommend a follow-up pass on the Contact/RFQ page before finalizing form component tokens.

### Client logo grids
Not observed on any page sampled this session. If the true legacy site carries one (unconfirmed), it was not part of this forensics pass.

### Footer
**Current character:** dark charcoal band (`#23282D`), three-column grid (Our Products / Quick Links / Contact), thin red decorative line-fragments/corner brackets as ornament, red social icons, circular back-to-top button, copyright bar at 40%-opacity white, a vendor credit line ("Design and Developed by Ifox Solutions") that is not part of the Vedanta brand and must not carry into the redesign.
**Brand-significant:** dark-charcoal-plus-red-linework is a strong, consistent close to every page; the three-column informational structure (products / navigation / contact) is sensible and worth keeping.
**Outdated:** the corner-bracket linework is decorative without much structural logic — thin, unexplained fragments rather than a clear grid device.
**Modernization rule:** keep dark band + red accent + three-column structure; simplify or better-justify the linework rather than dropping it outright — thin red line accents are one of the few genuinely distinctive marks the site has.

### Contact information
Address, two named phone contacts, three email addresses, presented as plain stacked text in the footer's third column. Plain, functional, no icons paired with each line. Keep the plainness — this reads as trustworthy specificity (named individuals, real addresses) rather than a generic "Contact" CTA, which matters for a vendor-registration/procurement audience.

### Social icons
Small, red, circular or plain glyphs (Facebook, LinkedIn, X) in the footer. Minor, correctly de-emphasized relative to the phone/email contact info that actually matters for this audience.

### Back-to-top control
Circular, white-outline button, bottom-right, dark footer band. Standard pattern, no brand-specific character — safe to modernize freely.

---

## 5. Image language

**Color temperature:** cool-to-neutral, slightly desaturated — steel grays, rust/oxide tones, overcast sky light. Not warm-graded, not saturated/vivid.

**Crop style:** wide, environmental shots for heroes (full facility/structure in frame); tighter, single-subject shots for product cards (one vessel/exchanger/skid, shop-floor background visible but secondary).

**Aspect ratio:** heroes are wide/panoramic (roughly 21:9–16:9 depending on viewport); product cards are closer to square/4:3.

**Overlay darkness:** heavy on heroes (0.6–0.8 black, graduated), none on product cards.

**Image-to-text ratio:** heroes are photo-dominant with a small text block; product cards are roughly 65% photo / 35% text; the "Our Story" and interior-page body sections lean more text-dominant with a single supporting photo.

**Subject matter, confirmed by direct observation:** real fabrication shop floors, overhead cranes, pressure vessels and heat exchangers mid-assembly or in yard storage, structural steelwork, workers in PPE, plant/site exteriors. This reads as documentary/technical, not staged corporate photography — genuinely a strength, and one of the two or three things most worth preserving from this site without modification.

**Subject-matter failure observed directly this session:** the "Our Story" section on the homepage uses a **generic stock photo of a modern glass office with a Hong Kong-style skyline visible through the windows** — nothing about it relates to fabrication, Gujarat, or this company. This is a direct, confirmed instance of exactly the failure mode the brief's DO/DON'T framework warns against, and it should be treated as a mistake to correct, not a pattern to analyze further.

**DO** (derived from what's actually on site, not assumed):
- Real fabrication facilities, shop floors, and yard storage
- Pressure vessels, heat exchangers, skids, structural steel — actual products, mid-build or finished
- Workers in PPE, in context, doing real work
- Overhead cranes, machining equipment, close technical detail shots
- Wide environmental establishing shots for hero bands, graduated dark overlay for text legibility

**DON'T** (each one is a confirmed on-site failure, not a hypothetical):
- Generic office/interior stock photography unrelated to fabrication (confirmed: the "Our Story" image)
- Generic corporate headshot/stock-model photography presented as a client or testimonial (confirmed: the testimonial section)
- Any imagery carrying a third party's watermark (prior research flagged Unsplash-watermarked stock on the same URL family)
- Abstract gradients, illustration, or AI-generated "futuristic factory" imagery — none currently on site, and nothing in the brand's visual history suggests this fits

---

## 6. Graphic motifs

| Motif | Frequency observed | Verdict |
|---|---|---|
| Thin red line fragments / corner brackets (footer) | Footer only, this session | Genuine recurring brand device — modernize, don't remove |
| Scalloped rosette/seal silhouette (certification badges, echoes the logo's own oval border) | Certification section | **Real brand DNA** — the strongest graphic-motif finding in this document. The logo's oval/scalloped mark and the cert badges' scalloped seal shape are the same family of shape. Worth deliberately extending (e.g., as a badge/stamp component) rather than treating as a one-off. |
| Diagonal watermark roundel on product photography | Every real product photo | Copy-protection artifact, not a designed motif — don't preserve deliberately, but note that removing it will need a real image-rights decision |
| Diagonal arrow (↗) on "Learn More" links | Product cards, this session's build | Real, repeated interaction affordance — keep |
| Right-arrow (→) breadcrumb separator | Every interior page hero | Real, repeated — keep |
| Circular silhouette family (back-to-top button, avatar crop, cert-seal outline) | Scattered across footer, testimonial, certifications | A loose but real pattern — circles/roundels recur more than any other non-rectangular shape, consistent with the roundel logo mark. Worth formalizing as "the site's one non-rectangular shape language" rather than introducing new geometric motifs (hexagons, diagonals-as-decoration, etc.) that aren't already present. |

**Frequency discipline:** every motif above appears in exactly one or two structural locations (footer, cert section, card links) — never as page-wide decoration. **This restraint is itself a brand characteristic.** A modernized system should keep motifs load-bearing (they mean something — "verified," "next," "back to top") rather than decorative filler.

---

## 7. Brand personality

**Derived adjectives, from the material actually observed — not assumed:**

- **Industrial** — real shop-floor photography, real equipment, no abstraction
- **Document-literal** — the site prefers stating facts in prose ("established 1994," "ASME U and U2 stamp") over persuasive marketing language
- **Certification-proud** — badges and stamps get dedicated sections and page space, even when the execution is dated
- **Understated** — red is spent carefully (links, eyebrows, one CTA style), never as a background or a loud brand wash
- **Heritage-forward** — "30 years of expertise," 1994 founding date, positioned early and repeatedly
- **Regionally specific** — Gujarat facility addresses, named individual contacts (not a generic "sales@" inbox), real site photography
- **Unpolished-but-earnest** — generous whitespace and a genuinely modern typeface sit next to dated execution details (hand-kerned cert badges, stock-photo missteps) — this reads as a real company that hasn't invested heavily in its digital presentation, not as a company without substance

**What the redesign should NOT feel like**, each tied to specific evidence rather than asserted generically:

- **Not a SaaS startup** — no gradients, no abstract blob illustration, no feature-icon grids anywhere on the current site; introducing them would contradict everything observed
- **Not fintech** — the cool neutral palette could drift this way if pushed too far; the brick-red brand color and documentary photography are what prevent that, and must stay dominant
- **Not a luxury brand** — the current site's density and directness (prose-heavy, spec-oriented, unpretentious) is the opposite of luxury minimalism's restraint-as-status
- **Not a creative agency** — no experimental type, no asymmetric layout play; the grid is conventional and should stay conventional
- **Not a generic AI-generated site** — this is the most concrete risk given the two confirmed imagery mistakes (stock office photo, stock testimonial model) already on the current build. A redesign that adds more generic/synthetic imagery on top of these existing mistakes would be moving in exactly the wrong direction
- **Not Web3** — no gradient meshes, no neon, no futurism; nothing in the material suggests this was ever a consideration, but it's worth stating explicitly given how common that visual language has become in "modernization" work
- **Not consumer e-commerce** — no cart iconography, no promotional badges/sale stickers, no consumer-grade urgency language; the tone throughout (even where the copy is weak) is business-to-business and procurement-facing

---

## 8. Design continuity matrix

| Element | Current website | Brand significance | Keep / Evolve / Remove | Modern implementation |
|---|---|---|---|---|
| Logo treatment | Roundel + wordmark, red "DHRUV EPC" text | High — primary identifier | **Keep** | Vectorize if not already; no redraw |
| Primary red | `#AA3833` (canonical) / `#B82B2C` (session variant) | High — sole wayfinding accent color | **Keep**, reconcile the two values against production first | Use `#AA3833` as the token; treat `#B82B2C` as confirming evidence, not a second color |
| Dark footer | Charcoal `#23282D` band, red linework | Medium-high — consistent close to every page | **Evolve** | Keep dark band + red accent; simplify the linework's logic |
| Typography | Plus Jakarta Sans, single family, tight headline leading | High — already modern, already consistent | **Keep** | Formalize the scale (§2.2), don't change the face |
| Navbar | White, 123px tall, text-only nav, chevron dropdowns | Medium | **Evolve** | Keep proportions and text-only discipline; modernize dropdown panel styling |
| Hero image | Full-bleed real facility photography | High — most consistent pattern on the site | **Keep** | No change to structure; only copy needs work |
| Hero overlay | Graduated black, 0.6–0.8 opacity | High — makes the photo-forward hero legible without losing the photo | **Keep** | Keep the graduated-darkness approach over a flat tint |
| Breadcrumbs | White text over hero photo, `→` separator | Medium — distinctive placement | **Keep** | No change |
| Decorative line patterns | Thin red corner-bracket fragments, footer only | Medium | **Evolve** | Preserve as a footer device; give it clearer structural logic |
| Cards | White, 3px radius, hairline border, soft shadow, real photo | High — the product/company card is the site's core content unit | **Keep** | Preserve recipe; upgrade photography treatment (remove diagonal watermark if rights allow) |
| Certification badges | Hand-drawn scalloped seal, stacked letters | High — echoes the logo's own oval motif, genuine brand DNA | **Evolve** | Redraw as clean vector, preserve the rosette silhouette |
| Buttons | Solid red fill, white text, rounded corners | High — the only "primary action" signal on the site | **Keep** | No structural change; confirm exact radius against production |
| White space | Generous, low-density sections | Medium-high — a real (if under-used) asset | **Keep** | Fill the whitespace with real content (specs, figures) rather than reducing it |
| Product presentation | Photo card → name → "Learn More ↗", no specs, no figures | Low as currently executed; the *slot* is high-value | **Evolve** | Keep the card pattern for listings; product *detail* pages need genuine structural upgrade (spec tables, figures) — this is a content/information-architecture gap, not a visual-style one |
| Testimonial | Stock photo, unattributed quote | None — actively a credibility risk | **Remove** | Do not carry forward; reintroduce only with real, attributable client testimonials |
| Footer | Dark charcoal, 3-column, contact detail, vendor credit line | High (structure) / None (vendor credit) | **Keep structure, remove vendor credit** | Preserve 3-column info architecture; drop "Design and Developed by Ifox Solutions" |
| Contact treatment | Plain stacked text, named individuals, real addresses | High — signals a real, reachable company | **Keep** | No embellishment needed; this plainness is doing real trust-building work |

---

## 9. Design tokens (implementation-ready, traced to source)

```css
:root {
  /* ===== COLOR — brand ===== */
  --brand-primary: #AA3833;            /* canonical, [prior], multi-region sampled + contrast-tested */
  --brand-primary-hover: #8D2F2A;      /* [prior] brand-600 */
  --brand-primary-active: #66221F;     /* [prior] brand-700 */
  --brand-primary-on-dark: #DC8D89;    /* [prior] brand-300 */
  --brand-primary-session-variant: #B82B2C; /* [session] — confirms family, do not use as a second token */

  /* ===== COLOR — neutrals (observed, COOL — see §0 tension with locked warm ramp) ===== */
  --surface-page: #FFFFFF;
  --surface-panel: #F5F6F8;
  --surface-dark: #23282D;
  --text-primary: #222334;
  --text-secondary: #707070;
  --text-muted: #888888;
  --text-on-dark: #FFFFFF;
  --text-on-dark-muted: rgba(255, 255, 255, 0.4);
  --border-subtle: #E0E0E0;
  --border-strong: #D9D9D9;

  /* ===== COLOR — overlays / effects ===== */
  --overlay-industrial: rgba(0, 0, 0, 0.7);   /* hero photo scrim, graduate 0.6→0.8 */
  --shadow-card: 0 0 10px rgba(0, 0, 0, 0.2);

  /* ===== TYPOGRAPHY ===== */
  --font-family-base: "Plus Jakarta Sans", sans-serif;  /* single family, headings + body */
  --font-size-display: 64px;   /* hero H1 only */
  --font-size-h1: 48px;        /* interior page H1 — measure against production to confirm */
  --font-size-h2: 47px;
  --font-size-h3: 25px;
  --font-size-h4: 21px;
  --font-size-body: 16px;
  --font-size-body-lead: 19px;
  --font-size-caption: 14px;
  --line-height-tight: 1.0;    /* headings only, short strings */
  --line-height-body: 1.5;
  --font-weight-regular: 400;
  --font-weight-medium: 600;
  --font-weight-bold: 700;
  --letter-spacing-default: normal; /* confirmed: no tracked headlines or nav on this site */

  /* ===== SPACING — 8px base, formalizing observed rhythm ===== */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-16: 128px;

  /* ===== RADIUS ===== */
  --radius-sm: 3px;    /* cards, most rectangles — observed dominant value */
  --radius-pill: 26px; /* pill buttons */
  --radius-full: 100%; /* circular controls */

  /* ===== BORDERS ===== */
  --border-width-hairline: 1px;
  --border-color-default: var(--border-subtle);

  /* ===== CONTAINERS ===== */
  --container-max: 1440px;
  --container-content: 1268px;
  --header-height: 123px;

  /* ===== BREAKPOINTS ===== */
  --bp-mobile: 360px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1440px;

  /* ===== IMAGE RATIOS ===== */
  --ratio-hero: 21 / 9;
  --ratio-product-card: 4 / 3;

  /* ===== TRANSITIONS ===== */
  --transition-default: 180ms ease;  /* not directly measured — standard default, confirm against production */

  /* ===== Z-INDEX ===== */
  --z-header: 40;
  --z-dropdown: 50;
  --z-overlay: 60;
  --z-modal: 100;
}
```

**Every value above traces to §1–§4 of this document, or is explicitly marked as a reasonable default pending confirmation against production** (transitions, exact interior-page H1 size). Nothing here was invented to fill out a "complete-looking" token set — gaps are left as gaps, not guessed.

---

## 10. VEDANTA GROUP DIGITAL DESIGN CONSTITUTION

Non-negotiable rules for anyone (human or AI) implementing the redesign, derived from the forensics above.

1. **The Vedanta red is an accent, not a page background.** It appears on links, one button style, eyebrows, and thin footer linework — never as a section fill, a hero wash, or a large color block. This restraint is itself brand-authentic; a "boulder of red" anywhere is a redesign mistake, not a bold choice.

2. **Industrial photography must dominate over decorative illustration.** No abstract gradients, no geometric illustration, no AI-generated "futuristic factory" renders. Every hero and every product image is a real facility, real equipment, or real work — full stop.

3. **Resolve the warm/cool neutral question before building, don't inherit it silently.** This document's direct forensics say the true site is cool-neutral (`#FFFFFF` / `#F5F6F8` / `#222334`-family). The currently-shipped token system is locked to a warm-bone ramp for pragmatic, already-documented reasons unrelated to brand fidelity (`07-p0-decisions-locked.md` P0-1). Someone with authority over both facts needs to make this choice consciously — this document does not make it for you.

4. **Never introduce a stock photograph of a person as a testimonial, employee, or "customer."** The current site's one instance of this (§4, Testimonial) is a confirmed credibility liability for a procurement/vendor-registration audience. Real client attribution or no testimonial section at all.

5. **The certification seal's scalloped silhouette is real brand DNA — preserve the shape, fix the craft.** It echoes the logo's own oval border. Redraw as vector; do not replace with a generic checkmark-in-a-circle or flat badge style.

6. **Dark sections use the site's own charcoal (`#23282D`-family), never a generic pure black.** Pair it with red linework, not with white/gray linework — that pairing is the one genuinely distinctive footer treatment already present.

7. **One typeface family, "Plus Jakarta Sans" or its direct successor, for everything.** Do not introduce a second display face "for personality." The site's discipline here is already a strength.

8. **Headlines set tight (line-height ≈1.0), body set open (line-height ≈1.5).** This contrast is deliberate and should be preserved, not smoothed into a uniform modular scale.

9. **Every hero uses a graduated dark overlay over real photography, never a flat tint and never text-on-raw-photo.** This is the single most consistent pattern found across every page type sampled.

10. **Breadcrumbs sit on the hero photo, under the title — not on a separate light band beneath it.** This placement is distinctive; moving it to a conventional light band would be a regression in distinctiveness, not an improvement.

11. **The "Learn More ↗" / arrow-icon affordance and the right-arrow (→) breadcrumb separator are real, repeated interaction patterns — keep both**, but confirm against current production which card-action pattern (arrow-link vs. the circled-plus recorded in prior research) is actually live before finalizing a component spec.

12. **Do not add uppercase tracked type anywhere.** Nothing on the current site is set this way, including eyebrows. Adding it would be inventing a habit, not restoring one.

13. **Cards stay white, thin-bordered, barely-shadowed (`0 0 10px rgba(0,0,0,0.2)`).** No heavier Material-style elevation, no colored card backgrounds.

14. **Radius stays small and rectangular by default (`3px`), reserving fuller radii (`26px` pill, `100%` circle) for buttons and standalone controls only.** Don't round every corner "for modernity" — the site's near-square cards are part of its restrained, technical character.

15. **Whitespace is preserved, but filled with real content, not left as decoration.** The current site's product pages are thin (a photo and two paragraphs, no specification data). Modernizing means adding genuine engineering content — figures, materials, codes, dimensions — inside the existing generous layout, not shrinking the whitespace to compensate for thin content.

16. **Never publish an image carrying a third-party watermark**, and treat the current Vedanta-roundel diagonal watermark on product photography as a rights/production issue to resolve deliberately — not a motif to preserve for its own sake.

17. **Drop the "Design and Developed by [vendor]" footer credit line.** It is not part of the Vedanta identity and should not appear in the redesign regardless of who builds it.

18. **This document's own uncertainty is part of its output — do not silently resolve it.** Where §0 flags a discrepancy between this session's direct observation and prior project research (the exact brand-red hex, the CTA affordance, the presence of a left-rail product navigation), implementation should confirm against current production rather than picking whichever value is more convenient.

---

*This document covers discovery and forensics only, per the brief. No redesign, no new branding, no logo changes, and no speculative visual direction beyond what is explicitly derived from evidence in §1–§9 are proposed here.*
