# DATUM — The Dhruv EPC Design System
**Phase 2 Deliverable · Design Systems Team · v1.0 · 6 July 2026**
**Status:** Draft for approval · No code — documentation only
**Depends on:** Phase 1 Audit + PRD/TRD Validation Addendum (amendments 1–7 assumed accepted)

---

## Why "Datum"

In engineering drawing, a **datum** is the reference surface from which every measurement is taken. Nothing on a fabrication drawing is placed by feel; everything is dimensioned from the datum. That is this design language in one word: a system where every color, size, distance, and motion is *measured from a reference*, the way Dhruv measures a vessel shell.

This is also the anti-imitation strategy the brief demands. Apple, Stripe, Linear, and Vercel are inspirations for *discipline* — restraint, typographic hierarchy, systemized decisions — but their visual worlds come from *their* subjects (consumer electronics, payments infrastructure, software tools). Datum's visual world comes from **Dhruv's subject**: the GA drawing, the weld pool, the mill certificate, the inspection stamp, rolled steel plate. We borrow the *rigor* of the references and none of their *look*. That is what makes the system original and — because it's derived from a 100-year-old drafting vernacular rather than a 2026 web trend — timeless.

---

# PART I — IDENTITY

## 1. Brand Personality

Five traits, each with a behavioral rule so "personality" is enforceable, not decorative:

| Trait | Meaning | Enforcement rule |
|---|---|---|
| **Precise** | Says exactly what is true, with numbers | Copy leads with figures and codes; no claim without a spec, photo, or document behind it |
| **Assured** | Confident without shouting | No exclamation marks, no superlatives without proof ("excellent" is banned; "100% document-adherence rating, EIL evaluation" is encouraged) |
| **Substantial** | Feels like heavy plate, not thin sheet | Generous scale, weighty type, real photography — never stock imagery, never decorative illustration |
| **Direct** | Respects an engineer's time | Every page answers its question in the first screen; no marketing preamble before facts |
| **Quietly proud** | 30 years, U2 stamp, PSU approvals — stated plainly | Credentials appear as *stamps of record*, not badges of self-congratulation |

**Voice register:** the tone of a good fabrication drawing's notes column — declarative, unambiguous, sentence case, active voice. "We fabricate shell & tube exchangers to ASME Sec. VIII Div. 1 & 2 and TEMA" — not "world-class heat transfer solutions."

**Why:** Phase 1 established that our buyers (proposal engineers, procurement, TPIA reviewers) are verifiers, not browsers. Personality traits chosen for *their* trust psychology: in this sector, restraint reads as competence and enthusiasm reads as sales. The enforcement-rule format exists because brand personality documents usually die as adjectives; ours has to survive contact with copywriters and component builders.

## 2. Visual Identity

**Core concept: "The drawing, brought to life."** The visual system takes its DNA from the general-arrangement drawing — the one artifact every persona in our research already trusts:

- **The datum line** — a thin horizontal rule with a short perpendicular tick at its origin — is the system's signature mark. It underlines section eyebrows, frames hero imagery, and structures the footer. It is our equivalent of Stripe's gradient or Linear's glow: one ownable, repeatable gesture. Why this and not a logo flourish: it's drawn from the subject's world, it's cheap to render, it scales from favicon to hero, and no competitor can claim it without copying us.
- **Two materials, one heat source.** The palette is built as *steel* (a cool graphite scale) on *mill paper* (warm-neutral whites), with a single hot accent — **arc amber** — used the way heat is used in a fabrication shop: rarely, deliberately, and only where work happens (see §4).
- **Measured photography.** Real shop and product photography, consistently graded (see §2.1), often framed by a hairline dimension motif with an actual figure ("Ø 3,600 mm") — turning brand decoration into literal proof. No stock photos, no 3D renders pretending to be product, no AI-generated imagery. Ever.
- **Type as instrumentation.** All measurements, dimensions, weights, and codes render in a monospaced face with tabular figures — the typographic equivalent of a caliper readout. Prose stays in the grotesk. The eye learns instantly: *mono = fact*.

### 2.1 Photography treatment (the identity's biggest lever)
Rules: shot on-site, people working where possible (scale + humanity), consistent grade — slightly lifted blacks, desaturated ambient color, weld/heat sources allowed to bloom naturally toward amber (reinforcing the accent without a filter's dishonesty). Compositions favor scale cues (a person beside a vessel head) and process honesty (grinding sparks, NDT in progress). **Why:** Phase 1 §5 identified photography as the single largest gap between current state and premium; and because our product *is* physical craft, treated photography does more brand work than any graphic system could. The grade rules exist so images from different shoots and years feel like one company.

### 2.2 Logo handling
The existing Dhruv EPC mark is retained (rebranding is out of scope) but governed: monochrome carbon or white only within the system; clearspace = the height of the "D"; never on photography without a scrim zone; the group association appears as a set-width text lockup — "A Vedanta Group company" in caption type — never as competing logos. **Why:** entity clarity (Phase 1 §6.1) demands Dhruv-first presentation; the lockup rule encodes the brand-architecture decision into every page.

## 3. Design Principles

1. **Proof over polish.** Any element that can carry evidence (a number, a code, a client sector, a certificate) must; decoration that displaces evidence is cut. *Test: could this pixel help a proposal engineer justify shortlisting us? If not, why is it here?*
2. **Everything from the datum.** No arbitrary values, anywhere. Every dimension resolves to the spacing scale, every color to a token, every duration to the motion scale. *Why: consistency is how a small team ships premium — and how the system survives its authors.*
3. **Restraint is confidence.** One accent. One signature motion moment. One amber button per screen. The quiet around an element is what makes it read as certain. *Why: Phase 1 risk #3 — consumer flash undermines industrial credibility; restraint is the premium register this audience trusts.*
4. **Fast is a feature of trust.** Performance budgets are design constraints, not engineering afterthoughts: if a treatment can't hit LCP ≤ 2.5s on a plant-office connection in Vadodara or Dammam, the treatment is wrong, not the budget. *Why: our users' real networks (Phase 1 §7); a slow site from a precision manufacturer is a brand contradiction.*
5. **Nothing unattributed.** No anonymous quotes, no unlabeled logos, no undated claims, no unexplained numbers. Every proof element carries its provenance. *Why: this rule alone fixes half the trust failures found in the audit — and it's what separates evidence from decoration.*

---

# PART II — FOUNDATIONS

## 4. Color System

### 4.1 Architecture
Three families — **Steel** (neutrals, the workhorse), **Arc** (the single accent), **Signal** (semantic feedback) — defined as primitives, consumed only through semantic aliases (§26). Light-first: mill-paper surfaces are the default; graphite "dark sections" are a deliberate sectional device (hero variants, trust bands), not a user-toggled dark mode. **Why light-first:** datasheets and drawings are light artifacts; light surfaces render technical density more legibly; and it distances us from the black-canvas-plus-neon default of contemporary dev-tool sites.

### 4.2 Steel scale (neutrals)
Cool, slightly blue-gray — the color temperature of mill plate, not of a warmed "cream" palette (deliberately avoiding today's ubiquitous warm-paper trend, which will date).

| Token | Value | Role |
|---|---|---|
| steel-50 | `#F7F8F8` | Page background ("mill white") |
| steel-100 | `#EFF1F2` | Alternate section background, table header fill |
| steel-200 | `#E1E5E7` | Hairlines, card borders, dividers ("scribed line") |
| steel-300 | `#C7CDD1` | Disabled fills, strong dividers |
| steel-400 | `#A3ACB2` | Placeholder text, disabled text on light |
| steel-500 | `#7B858D` | Tertiary text, icon default |
| steel-600 | `#59636B` | Secondary text on light (7.0:1 on steel-50) |
| steel-700 | `#3F4950` | Emphasized secondary text |
| steel-800 | `#2A3238` | Dark-section elevated surface |
| steel-900 | `#1C2328` | Dark-section background ("graphite") |
| steel-950 | `#121619` | Ink — primary text, primary buttons ("carbon") |

### 4.3 Arc (accent)
The color of the weld pool and hot rolled edge — earned from the shop floor, not picked from a trend palette.

| Token | Value | Role |
|---|---|---|
| arc-300 | `#FFA45E` | Accent on dark surfaces (large text/graphics; 7.4:1 on steel-900) |
| arc-500 | `#F0670F` | Graphical accent, focus rings, datum ticks, RFQ button fill |
| arc-600 | `#C24E05` | Accent *text* and links on light surfaces (4.9:1 on steel-50) |
| arc-700 | `#9A3F06` | Hover/pressed for arc-600 text, RFQ pressed state |

**Usage law — "amber is heat":** arc appears only where action or emphasis genuinely lives: the RFQ button (its exclusive fill — see §12), focus indicators, the datum tick, active states, and at most one highlighted figure per view. Target ≤ 5% of any screen's area. Body text never sets in arc-500 (contrast on white is only ~3.2:1); text uses arc-600+. **Why one accent, and why this one:** a single accent is the strongest available hierarchy tool — it lets us *reserve meaning* (amber = "this is the action") the way Stripe reserves its blurple for interaction. Amber specifically is honest to the subject (heat is literally how the product is made), highly distinctive against cool graphite, and — governed this strictly — cannot collapse into the orange-everywhere noise of the old template.

### 4.4 Signal (semantic)
Muted, engineering-toned — feedback should inform, not alarm.

| Token | Value | Role |
|---|---|---|
| signal-success | `#1E7A55` | Valid input, success notices ("inspection green") |
| signal-error | `#B3392E` | Errors ("oxide red" — distinct from arc so error ≠ action) |
| signal-warn | `#8A6116` | Warnings, caution notes |
| signal-info | steel-600 | Neutral information |

Each ships with a paired tint (e.g., success-tint `#E8F3EE`) for message surfaces. **Why muted:** saturated alert colors read consumer-app; and error must be unmistakably *not* amber, so a validation failure can never be confused with a call to action.

### 4.5 Contrast covenant
Every sanctioned text/surface pair is enumerated in the token sheet with its measured ratio; pairs below 4.5:1 (normal text) / 3:1 (large text, UI graphics) simply do not exist as tokens. **Why:** accessibility by construction beats accessibility by review — you cannot ship a failing combination if the failing combination has no name.

## 5. Typography System

### 5.1 The three voices
| Role | Face | Why this face |
|---|---|---|
| **Display & headings** | **Schibsted Grotesk** | A contemporary grotesque with real character (angled terminals, confident counters) that isn't yet a web cliché — deliberately *not* Inter/Geist/Söhne/Helvetica, so the site can't be mistaken for a dev-tool template. Open license keeps it self-hostable (performance + no tracking). |
| **Body & UI** | **Inter** | The workhorse: exceptional legibility at 14–18px, huge weight/feature range, tabular figures available, proven Devanagari-adjacent i18n path for future Hindi/Gujarati. Its very neutrality is the point — body text should be invisible so headings and data can speak. |
| **Data & measurement** | **IBM Plex Mono** | Every dimension, weight, pressure, code, and figure sets in mono. Plex Mono has an engineering-document heritage, excellent numerals, and pairs with grotesques without novelty-font quirkiness. |

**The mono rule is the system's most original typographic decision:** *mono = verified fact* becomes a learned visual grammar across the entire site — spec tables, hero stats, case-study metrics, even inline ("shells up to `Ø 4,000 mm`"). No inspiration brand does this; it comes from datasheets, which is why it belongs to us.

### 5.2 Scale
Fluid between a 360px floor and 1440px ceiling (documented as min→max; implementation later). Ratio ≈ 1.25 (major third) — assertive hierarchy without display sizes that force short marketing headlines; our H1s carry real qualifiers ("…ASME U-Stamp, Shell & Tube") and need room to wrap with dignity.

| Step | Size (min→max) | Line height | Weight | Use |
|---|---|---|---|---|
| display-xl | 40→64px | 1.05 | 500 | Home hero only |
| display | 34→48px | 1.1 | 500 | Page heroes |
| h1 | 30→40px | 1.15 | 600 | Page title when hero is compact |
| h2 | 26→32px | 1.2 | 600 | Section titles |
| h3 | 21→24px | 1.3 | 600 | Subsections, card titles |
| h4 | 18→20px | 1.4 | 600 | Minor headings, table groups |
| body-lg | 18px | 1.6 | 400 | Lead paragraphs, value statements |
| body | 16px | 1.6 | 400 | Default prose |
| small | 14px | 1.5 | 400/500 | UI, captions, table labels |
| caption | 12px | 1.4 | 500, +0.06em tracking, uppercase | Eyebrows, column headers, provenance lines |
| data-lg | 24→32px | 1.2 | 500 (mono) | Hero/case-study metrics |
| data | 15px | 1.5 | 400 (mono), tabular | Spec values |

Rules: maximum weight is 600 (no 700–900 — heavy weights shout; medium-weight-at-large-size is the premium register the references share); prose measure 60–75 characters; headings in sentence case (uppercase is reserved for the caption/eyebrow voice so it stays meaningful); tabular lining figures mandatory wherever numbers align vertically. **Why fluid type:** breakpoint-jumping type creates the "template resize" feel; continuous scaling reads engineered — and it's measured from the viewport like everything else is measured from the datum.

## 6. Spacing Scale

Base unit **4px**; named steps only: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`.

- Component-internal rhythm: 4–24
- Between related elements: 24–32
- Between component groups: 48–64
- Between page sections: 96–128 desktop / 64–80 mobile
- Section spacing is *chosen per relationship, then never overridden* — adjacency communicates relatedness, so spacing is information, not aesthetics.

**Why a gapped scale (no 20, 40, 56):** fewer choices produce more consistency; the gaps force decisions up or down into clearly different values, which is what makes rhythm perceptible. The old template's flat, equal section spacing made everything equally unimportant (Phase 1 §5); the scale exists to make emphasis structural.

## 7. Grid System

- **Columns:** 12 (desktop ≥1024), 8 (tablet 768–1023), 4 (mobile <768)
- **Gutters:** 32px desktop / 24px tablet / 16px mobile
- **Margins:** 24px mobile, 40px tablet, 64px desktop minimum
- **Content max-width:** 1200px (prose and data); **wide max-width:** 1360px (imagery, tables that earn it); full-bleed reserved for photography bands
- **Vertical grid:** 8px baseline alignment for adjacent columns of mixed content

Standard layouts: 12 (full), 8+4 (content + rail — the product-page workhorse), 6+6 (paired), 4+4+4 (card grids), 10-centered (long-form case-study prose). **Why 1200 not 1440 for content:** spec tables and prose read best under ~1200; letting *only* photography exceed it creates a rhythm — facts contained, evidence expansive — that becomes part of the visual voice.

## 8. Elevation

Datum is a **flat-first** system: an engineering drawing has no drop shadows. Hierarchy comes from tone (steel-50 vs 100 vs white panels), scribed 1px borders, and scale — not simulated depth.

| Level | Name | Treatment | Used by |
|---|---|---|---|
| 0 | Surface | Flat; borders/tone only | Everything by default: cards, tables, sections |
| 1 | Raised | Hairline border + shadow-1 | Dropdowns, popovers, sticky header (scrolled), toasts |
| 2 | Overlay | Shadow-2 + page scrim (steel-950 @ 40%) | Modals, mobile drawer, image lightbox |

Only things that *actually float above the page in interaction terms* get elevation. **Why:** shadows on static cards are the most recognizable template tell of the last decade; reserving depth for genuinely-floating elements keeps it meaningful and keeps the page feeling machined.

## 9. Shadows

Two values total, both cool-tinted (steel-950-based, never gray-black — warm shadows on cool surfaces look dirty):

- **shadow-1 (Raised):** tight, low: y=2, blur=8, 8% + y=1, blur=2, 6%
- **shadow-2 (Overlay):** y=16, blur=40, 16% + y=2, blur=8, 8%

No colored glows, no inset-shadow decoration, no shadow-on-hover "lift" for cards (hover is expressed by border and accent instead — §15). **Why two:** a shadow *scale* invites drift; two named levels mapped 1:1 to elevation levels cannot drift.

## 10. Glass Effects

One sanctioned use: the **sticky header scrim** — when the header detaches on scroll, its surface becomes steel-50 at 88% opacity with a 12px backdrop blur and a bottom scribed line, so content passing beneath stays contextually visible without ever compromising nav legibility. Degrades to solid steel-50 where blur is unsupported or `prefers-reduced-transparency` is set.

Everywhere else, glassmorphism is **prohibited**: no frosted cards, no glass panels over photography, no translucent CTAs. **Why so strict:** blur is expensive on the low-end Android devices our analytics will certainly show; translucency degrades contrast unpredictably over photography; and glass-as-decoration is a 2021–2025 trend marker — the opposite of timeless. The single use we keep is *functional* (spatial continuity during scroll), which is the test any effect must pass.

## 11. Motion Principles & Animation Philosophy

**Philosophy — motion is annotation.** On a drawing, an arrow exists to direct attention to a fact. Motion in Datum does the same: it explains spatial relationships (where the drawer came from), confirms actions (the button acknowledged you), and directs attention (the spec table surfaced) — and does nothing else. If a motion doesn't answer *what just happened* or *where should I look*, it's deleted. We explicitly reject ambient/decorative animation (floating particles, perpetual gradients, parallax): it costs frames on weak devices, reads as consumer-app, and ages fastest of any design element.

**Durations (the complete set):**
| Token | Value | Use |
|---|---|---|
| motion-instant | 100ms | State ticks: hover tints, focus rings |
| motion-fast | 180ms | Buttons, inputs, small reveals |
| motion-standard | 240ms | Dropdowns, accordions, card transitions |
| motion-deliberate | 400ms | Drawers, modals, section reveals |
| motion-signature | 700ms | The signature moment only |

**Easing:** enter/standard = fast-out-slow-in (deceleration; elements arrive with mass, like a crane setting a load); exit = accelerate-out; **no bounce, no spring, no overshoot** — a fabricated part is placed once, precisely.

**Scroll reveals:** content groups may fade + rise **12px, once, on first entry** (motion-standard, staggered ≤ 60ms between siblings, ≤ 4 siblings). Never re-trigger, never parallax, never scale.

**The signature moment (the one place we spend boldness):** on product-page load, the hero's **datum line draws itself** left-to-right (motion-signature), the dimension tick drops, and the measurement label counts up in mono to its true figure (e.g., `Ø 3,600 mm`) as the photograph resolves. One orchestrated 700ms statement of the entire brand — *we measure things* — then total calm. Appears on product heroes and the home hero only.

**Scroll-bound exploded-view sequence (addendum, approved 2026-07-16 — docs/decisions.md):** a second, additive motion mechanic, distinct from the signature moment above (which is unchanged and still fires first, above this). On the group, Dhruv EPC and Precise Engineers home heroes, the photo slot may carry a pre-rendered image-frame sequence (assembled → separating → fully exploded) whose frame index is bound 1:1 to scroll position within the hero's own in-flow scroll track — the user's scroll deltas map directly to sequence position; nothing intercepts or slows their scroll, and nothing plays automatically or loops. This is deliberately *not* the ambient/parallax pattern rejected above: it is a single object's state bound to scroll position, functionally closer to the signature moment's line-draw than to decorative depth-of-field. Frames cross-fade via opacity only (never scale, never a layout property); the scroll-track height is a runtime behavioral constant, not a visual token. `prefers-reduced-motion` renders the fully-exploded frame as a single static image with no scroll track at all — not a frozen first frame inside a still-tall wrapper, which would leave a dead-scroll zone. **Below 768px the same static treatment applies regardless of motion preference** (2026-07-16 review, docs/ui-ux-review.md §3.3): a multi-viewport scroll track behind a small sticky band on a portrait phone is dead scroll, not motion design — the scrub is a wide-viewport, motion-permitted enhancement; the static fully-exploded frame is the baseline everywhere else. Both branches are CSS-first (globals.css `.exploded-*`) so server-rendered heights are final on every device class — no hydration reflow, no wrong-frame flash. See `docs/design.md` for the full spec, per-product frame breakdowns and image-generation prompts, and `apps/web/components/ExplodedSequence.tsx` for the implementation.

**Reduced motion:** `prefers-reduced-motion` collapses all movement to simple opacity (or nothing); the signature moment renders as its final frame. This is a first-class rendering mode, not a fallback — it must be reviewed in design QA like any state.

**Performance law:** only compositor properties (transform, opacity) may animate; anything triggering layout is banned by rule, not by review. **Why the whole regime:** Phase 1 §12 risk #3 (flash undermines credibility) + §7 (real networks). One memorable moment beats twenty forgettable ones — and a motion system this small can actually be maintained by a small team, which is itself a design decision.

---
*Part II continues in Part III — Components (§12–§20) and Part IV — Patterns & Governance (§21–§27).*

# PART III — COMPONENTS

## 12. Icons

- **Grid & construction:** 24×24px grid, 1.5px stroke, squared caps and joins, 2px corner radii — drafted, not doodled. Base library: Lucide (open, consistent, tree-shakeable), *re-drawn where its rounded style conflicts* with the squared spec.
- **Domain set (custom, the differentiator):** shell & tube exchanger, pressure vessel, reactor, column, skid, pipe spool, storage tank, crane/tonnage, weld torch, NDT probe, stamp/credential, drawing/RFQ. Drawn as simplified *section views* — the way an engineer would sketch them — so even our iconography is drawn from the drawing.
- **Sizes:** 16 (inline), 20 (buttons/inputs), 24 (default), 32 (feature). Color: steel-500 default, inherits text color in interactive contexts; arc only when the icon *is* the accent (datum tick, active state).
- **Certification marks are not icons:** U/U2/IBR/ISO render as a separate "stamp" component — bordered, mono-labeled, monochrome — because credentials must look like credentials, not UI garnish.

**Why:** icon sets are where design systems quietly fall apart (mixed weights, mixed metaphors). One construction spec + one small custom domain set gives distinctiveness exactly where competitors use generic clipart gears, at minimal drawing cost.

## 13. Buttons

**Hierarchy (and the Amber Law):**
| Variant | Surface (light context) | Use |
|---|---|---|
| **RFQ** | arc-500 fill, steel-950 text | *Exclusively* "Request a quote." The only amber-filled element in the system; max one per view |
| **Primary** | steel-950 fill, white text | The main non-RFQ action of a view |
| **Secondary** | transparent, 1px steel-300 border, steel-950 text | Alternate actions ("View equipment," "Download PDF") |
| **Ghost** | transparent, steel-700 text | Tertiary, toolbars, "Cancel" |
| **Link** | arc-600 text, underline on hover | Inline navigation within prose |

On graphite sections, Primary inverts (white fill / carbon text); RFQ stays arc-500 — the one constant across all surfaces, which is the point: **amber means "send us your requirement," everywhere, always.** Why reserve the accent for one action: the entire site exists to produce RFQs (PRD goal 3); giving the conversion action a color *no other element may use* is the strongest, cheapest conversion-hierarchy device available, and it makes every screen self-explanatory.

**Anatomy & states:** heights 48px (default) / 40px (compact); padding 24px horizontal; radius 2px ("machined edge" — a sharp-but-eased corner distinct from both the 0px broadsheet trend and the 8–12px SaaS pill); label in Inter 500, 15px, sentence case, verb-first ("Request a quote," "Upload drawing" — never "Submit"). States: hover = fill deepens one step (100ms); pressed = deepens two + translates down 1px (the only vertical movement a button makes); focus-visible = 2px arc-500 ring at 2px offset (the universal focus signature, §25); loading = label swaps to spinner + "Sending…", width locked to prevent reflow; disabled = steel-200 fill / steel-400 text, cursor unchanged (never hide a disabled state's existence). Icon buttons: 40×40 minimum with accessible name mandatory.

## 14. Forms

Forms are where the site earns its money; they get datasheet clarity:

- **Labels:** always visible, above the field, Inter 500 14px steel-950. Placeholder-as-label is banned (it vanishes on input — an audit-class accessibility failure and a usability tax for spec-heavy fields).
- **Fields:** 48px height, white surface, 1px steel-300 border, radius 2px, 16px text (prevents iOS zoom-jump). Focus: border becomes arc-500 + the 2px ring. Optional fields marked "(optional)" — required is the default and unmarked, because in an RFQ nearly everything is required and asterisk-forests read as bureaucracy.
- **Help & errors:** helper text 13px steel-600 below the field; on error, border signal-error + message with a leading error icon ("Enter a valid phone number with country code") — icon + text because color alone is not information (§25). Errors announce via live region; on submit-failure, focus moves to the first invalid field.
- **Selection:** native-styled selects for short lists; **choice cards** (bordered tiles with domain icon + label, radio semantics) for the RFQ's equipment-type question — visual, thumbable, and self-explanatory where a 13-item dropdown is not.
- **File upload (drawing intake — a first-class component):** a dropzone panel (dashed steel-300 border, drawing icon, "Drop drawings here or browse — PDF, DWG, images · up to 25 MB each"); per-file row with name, size (mono), progress bar (arc-500), remove, and per-file retry on failure; uploads go direct-to-storage (per validation addendum §3.1) so the panel must handle *upload-before-submit* states honestly. Beneath it, one caption line: "Drawings are confidential and reviewed only by our engineering team." **Why that line lives in the design system:** buyers upload *their* IP; the reassurance is a conversion element (Phase 1 §9, addendum §4.3), so it ships with the component, not with someone's memory to add it.

## 15. Tables

**The spec table is Datum's flagship component** — it is the product page's reason to exist (PRD §5.2).

- **Anatomy:** parameter label (Inter 500 14px steel-600) | value (**Plex Mono 15px steel-950, tabular figures**) | units/notes (mono 13px steel-500). Header row in caption voice (12px uppercase) on steel-100.
- **Rules, literally:** horizontal 1px steel-200 scribed lines only — no vertical rules, no zebra striping. A datasheet's grammar, and calmer at density.
- **Rhythm:** 44px minimum row height, 16px cell padding; numeric columns right-aligned (mono + tabular makes magnitudes comparable at a glance — the entire point of a spec table).
- **Density variant** ("engineering density," 36px rows) exists for capability matrices; default stays airy.
- **Responsive strategy:** below 768px, two-column parameter tables reflow to stacked label/value pairs (definition-list pattern) — no horizontal scrolling for the core spec table, ever, because Persona A on a phone in a plant is a primary scenario, not an edge case. Wide comparative tables (capability matrix) instead pin the first column and scroll horizontally with a visible affordance shadow — the honest pattern when data truly exceeds the viewport.
- Row hover: steel-50→100 tint only (tables inform; they don't perform).

## 16. Cards

Flat, bordered, machined:

- **Base:** white surface, 1px steel-200 border, radius 2px, 24px padding. No shadow (§8). Hover on interactive cards: border deepens to steel-400 + the card's arrow glyph nudges 4px right (100ms) — a drafted gesture instead of the floating-card cliché.
- **Product card:** 4:3 photograph (graded per §2.1), h3 title, one-line scope ("Shell & tube, ASME U/U2, up to 250 T"), mono spec chips (max 3), arrow. The one-line scope is mandatory — a card that only names the product ("Heat Exchanger") wastes the buyer's glance (Phase 1 §10: numbers are the copy).
- **Project card:** photo, sector eyebrow ("Fertilizer · PSU"), title, **metric strip** — up to 3 mono figures (weight, Ø, MOC) with 11px labels. Metrics on the card, not behind the click, because the metric *is* the credibility.
- **Certification card:** see §22.
- Grid: 3-up desktop / 2-up tablet / 1-up mobile, 32px gaps; equal heights via alignment, never via truncating meaningfully different content.

## 17. Navigation

- **Header (72px, steel-50, bottom scribed line):** logo lockup left; center: **Equipment** (mega-menu), **Capabilities**, **Projects**, **Company**; right: WhatsApp + click-to-call icons (both first-class per PRD 5.3), then the amber **Request a quote** button — present in the header on every page of the site.
- **Mega-menu (Equipment):** a Raised panel organized by the Phase-1 IA groups — *Static Equipment / Skids & Packages / Fabrication & Machining Services* — each item as name + one-line scope; a right rail deep-links to the Capability Matrix ("Max sizes, materials & codes →"). Grouping is the repair for the audit's flat 13-noun list; the rail exists because "can you build mine?" is the question behind every menu open.
- **Sticky behavior:** header detaches after one viewport with the glass scrim (§10) and compresses to 60px. On product pages **mobile**, a bottom action bar (Request a quote + WhatsApp) persists — thumb-reachable conversion for the scroll-deep spec reader.
- **Mobile:** full-height drawer from the right (motion-deliberate), groups as accordions, RFQ button pinned at drawer bottom; 48px row targets; focus trapped; ESC/scrim closes.
- **Breadcrumbs:** all interior pages, small type, steel-600, "/" separators, current page unlinked; doubles as the BreadcrumbList schema source (one artifact, two audiences — Persona A and Persona C).
- **Banned:** carousels of any kind, auto-rotating anything, hover-only disclosure without click/tap equivalence.

## 18. Footer — "The Title Block"

Every engineering drawing ends in a title block: who drew it, who approved it, to what standard, at what revision. Our footer *is* that title block — the signature identity move of the system:

- **Zone 1 — Title block proper** (graphite band, mono-heavy): the canonical entity record — legal name, "A Vedanta Group company" lockup, works address (Manjusar GIDC, Vadodara) and registered office each *labeled by role*, phone, email, CIN/GST if approved, and a revision line ("Content revised: Jul 2026"). This zone is the visible twin of the Organization/LocalBusiness JSON-LD — the entity-coherence fix (addendum §2.2) rendered as brand.
- **Zone 2 — Credentials strip:** the stamp components (U · U2 · IBR · ISO 9001 · 14001 · 45001) in a single scribed row, each linking to the Certifications page.
- **Zone 3 — Navigation & legal:** sitemap columns (Equipment / Capabilities / Company / Resources), Privacy, Terms, and nothing else — no vendor credit, no social-icon confetti (LinkedIn only, as a labeled link).

**Why:** the audit's messiest failures (contradictory entity data, credentials buried in a menu) are solved by giving them a *ritual home* on every page — and the metaphor is so native to the audience that the footer itself becomes proof we speak their language.

## 19. Hero Sections

**Global hero laws:** one message per hero (no rotation — carousels are banned system-wide); H1 contains the real qualifier, not a slogan; a proof element is present within the hero; primary CTA pair = amber RFQ + one secondary; photograph is real or absent — never stock, **except** the group/Dhruv/Precise home-hero exploded-view sequence below, a named, logged exception (docs/decisions.md, 2026-07-16) — not a precedent for imagery elsewhere on the site.

- **Home hero:** graphite variant. Caption eyebrow ("ASME U & U2 · IBR · Est. Vadodara"), display-xl headline (≤ 10 words, states what we make and to what codes), body-lg subhead (materials + sectors), CTA pair, and a full-bleed graded photograph framed by the datum-line motif carrying a true dimension label. Beneath: a **stats band** — four mono figures with caption labels (years, max tonnage, max Ø, sectors served) — each one sourced from the approved entity/capability record. **Addendum (2026-07-16):** the photo band may instead carry the scroll-bound exploded-view sequence described in §11 — photorealistic AI-rendered equipment imagery (heat exchanger on the group home, pressure vessel on Dhruv, metallic bellows expansion joint on Precise), a deliberate override of the "never stock" imagery law, logged in `docs/decisions.md`. See `docs/design.md` for the full spec and image-generation prompts.
- **Product hero:** light variant, compact. Breadcrumb, H1 (the SEO-qualified title), value statement leading with codes, **inline spec chips** (mono: max size, MOC families, codes) that anchor-link into the spec table, RFQ button. The signature datum-draw moment (§11) plays here.
- **Company/Capability heroes:** light, typographic, photograph optional — not every page earns the big image; restraint keeps the ones that do impressive.

**Why the stats band and chips:** Phase 1 §4 — our users verify, they don't browse; putting measurable capability in the first viewport is the single highest-leverage UX decision on the site.

## 20. Trust Sections

- **Certification cards:** stamp mark + full credential name + **scope statement in plain words** ("Authorized to fabricate ASME Sec. VIII Div. 2 pressure vessels") + issuer + validity + "View certificate" (opens the artifact). A credential without scope and provenance is decoration (Principle 5); the scope line is what turns a logo into an answer.
- **Approvals matrix (the VRV pattern, Phase 1 §3.2):** approvals grouped by approving entity class — PSU / EPC / TPIA-PMC — each with the approving organization named and, where permitted, category of approval. Rendered as an engineering-density table, not a logo soup: an approvals *record*, because that's what a vendor-registration reviewer is trying to reconstruct anyway.
- **Client wall:** uniform-height monochrome logos on steel-50 tiles, **each labeled with name + sector**, alphabetical (no false hierarchy), text-tile fallback for clients without logo permission (addendum §5-5). Labeled because unlabeled logos are invisible to screen readers, to AI crawlers, and to any buyer who doesn't already recognize the mark — three audiences failed by one omission on the current site.
- **Testimonial component:** quote (≤ 40 words, body-lg) + **mandatory attribution** — company, role, and provenance line in caption voice ("Vendor performance evaluation, 2024"). Unattributed quotes cannot be rendered: the component has no layout without the attribution slot. Entity-correct by rule (Precise Engineers' praise never appears on Dhruv pages — addendum §5-6).

# PART IV — PAGE PATTERNS

## 21. Product Page Layout

The template that must "act as a sales engineer" (PRD §1.2). Section order mirrors a proposal engineer's actual evaluation sequence — each section answers the question the previous one raises:

1. **Product hero** (§19) — *what is this and to what codes?*
2. **Specification table** (§15) — *can it meet my numbers?* First scroll, always above the FAQ and gallery; the audit's core finding is that specs are the content.
3. **Types & configurations** — card row of variants (fixed/floating/U-tube…), each with a section-view icon and one-line application note.
4. **Materials & codes** — MOC families as mono chips grouped CS/LAS/SS/duplex/non-ferrous/clad; design codes with edition discipline.
5. **Fabrication & QA strip** — 4–5 step process band (drawing → material w/ mill certs → fabrication → NDT → hydrotest & dispatch), each step a photo + caption; the TPIA persona's section.
6. **Gallery** — 3–5 real units, captions carrying dimensions (photography as proof, §2.1).
7. **Related projects** — up to 3 project cards filtered to this equipment.
8. **FAQ** — 4–6 self-contained Q&As in an accordion; written definition-first so each answer stands alone (they are the FAQPage schema and the GEO fan-out surface — Persona C reads this section as hard as Persona A does).
9. **RFQ band** — graphite full-width closer: "Send us your drawing." + response-SLA line + amber button + WhatsApp alternative.

A slim in-page anchor rail (desktop, 8+4 grid's rail column) lists sections 2–8 — engineers jump, they don't scroll politely.

## 22. Trust Page Patterns

The **Proof hub** (Certifications, Approvals, Clients, Projects) shares one layout spine: typographic hero stating what the page proves → the record (cards/matrix per §20) → provenance notes → RFQ band. Due-diligence users (Persona B, TPIA) get everything reconstructable from one branch of the nav instead of five orphan pages (Phase 1 §4).

## 23. RFQ Flow

**Entry:** header button (every page), product-hero button, section-9 band, mobile bottom bar — all routes land on one `/request-a-quote` page.

**Layout:** 8+4. Left, the form in **two steps**: Step 1 *Requirement* (equipment choice-cards, design code, MOC, quantity, timeline, message, drawing upload) — Step 2 *Contact* (name, company, email, phone with country code). A two-step split because the requirement step is where the buyer's mind already is; asking for identity *after* they've invested effort measurably outperforms identity-first forms, and the step boundary is a natural save point. Progress shown as "Step 1 of 2 — Requirement" (labeled, not dots).

**Right rail (the reassurance column):** "What happens next" — three plain rows (1. An engineer reviews your requirement · 2. We respond within one business day *(SLA figure pending client commitment — placeholder, flagged)* · 3. You receive a technical quotation); the confidentiality note; the certification strip; a WhatsApp/call escape hatch ("Prefer to talk?"). **Why a rail:** the moment of form-filling is the moment of maximum doubt; answering *what happens to this* at that moment is the highest-value copy on the site.

**Thank-you page:** reference number (mono), restated SLA, capability-statement PDF download (the P1 lead-magnet, delivered at peak goodwill), and a link back to Projects. Errors: submission failure keeps every field's data, states the failure plainly, and offers retry + the email/WhatsApp fallback — a lost lead is the one unacceptable failure mode (addendum §4.2).

## 24. Case Study Layout

1. **Header:** sector eyebrow ("Refinery · Gujarat · 2024"), title stating the object plainly ("2 × U-tube exchangers in duplex SS for a hydroprocessing unit"), then the **metric strip** — 3–4 data-lg mono figures (weight, Ø × length, MOC, code) with caption labels. The metrics are the headline's proof; they render before any prose.
2. **Lead photograph**, wide-grid, dimension-framed.
3. **Body** on the 10-centered grid: *Requirement → Engineering → Fabrication & QA → Outcome* (~600–900 words) — the narrative arc of an actual job, not marketing "challenge/solution" boilerplate; the QA section names the inspections passed and by whom, because that's the paragraph a TPIA reader photographs.
4. **Spec sidebar card** (sticky, desktop): the job's full data sheet in mono.
5. **Paired process photos** with factual captions; **client anonymization pattern** built-in ("Confidential — fertilizer sector PSU") so missing name permissions never block publishing (addendum §5-5).
6. **Footer:** next-project link + RFQ band.

## 25. Responsive Behavior & Accessibility Rules

**Breakpoints:** 360 (design floor) · 640 · 768 · 1024 · 1280 · 1440 (fluid ceiling). What changes at each is *documented per component above* — grids collapse 12→8→4, tables re-flow (§15), nav becomes drawer + bottom action bar (§17), heroes stack image-below-text, section spacing steps down one scale value. Content parity is absolute: mobile hides nothing, ever (mobile Persona A is a primary user, and Google/AI indexing is mobile-first).

**Touch:** 44×44px comfortable targets for all primary interactions; 24×24 absolute minimum (WCAG 2.2 — 2.5.8); no hover-dependent information anywhere.

**Accessibility rules (WCAG 2.2 AA as floor, by construction):**
1. Contrast: only covenant pairs exist (§4.5); non-text UI meets 3:1.
2. Focus: the universal 2px arc-500 ring, 2px offset, on *everything* interactive — a designed brand element (§13), never suppressed; focus order follows visual order; skip-link to main content.
3. Structure: one H1 per page; heading levels never skip; landmarks (header/nav/main/footer) on every template; breadcrumb + anchor rails are `nav` with labels.
4. Motion: full `prefers-reduced-motion` mode (§11) reviewed as a deliverable, not assumed.
5. Forms: visible labels, programmatic association, error text + icon + live-region announcement, focus-to-first-error, no time limits.
6. Media: meaningful alt text carrying the technical facts ("50 T fixed-tube-sheet exchanger during hydrotest") — the audit showed alt text is simultaneously an a11y, SEO, and GEO surface; decorative images explicitly nulled.
7. Tables: real table semantics with header scope for spec tables; the mobile definition-list reflow preserves label/value association programmatically.
8. Language: plain sentences; abbreviations expanded on first use per page (ASME, MOC, NDT) — expert-legible but newcomer-safe.
9. Components with keyboard contracts (menu, accordion, drawer, upload) follow ARIA Authoring Practices patterns; native elements preferred over re-invention.

## 26. Design Tokens

**Architecture — three tiers, one direction of reference:**
1. **Primitives** (facts): `steel.200 = #E1E5E7`, `space.6 = 24px`, `type.data.family = IBM Plex Mono`, `motion.fast = 180ms`. Never used directly by components.
2. **Semantic aliases** (decisions): `color.text.secondary → steel.600`, `color.action.rfq → arc.500`, `surface.section.dark → steel.900`, `border.scribed → steel.200`, `focus.ring → arc.500`. This is the layer that encodes *meaning* — and the only layer content pages may consume.
3. **Component tokens** (contracts): `button.rfq.bg → color.action.rfq`, `table.row.minHeight → space.11 (44px)`, `hero.stat.type → type.data-lg`.

**Naming:** `[category].[concept].[variant].[state]`, lowercase dot-path, platform-agnostic (the doc defines names and values; Phase 3 maps them to CSS custom properties/Tailwind config mechanically).

**Governance rules:** tokens are the single source of truth — a value that isn't a token doesn't ship; new tokens require a semantic justification (no `blue-ish-2`); deprecations alias forward for one release; the contrast covenant (§4.5) and motion set (§11) are *closed* lists — additions are design-review events, not commits. **Why three tiers:** primitives can be retuned (a steel value shifts) without touching components; semantics can be re-pointed (dark-section surface changes) without touching primitives; and the future Hindi/Gujarati or sister-company variants (Phase 1 §13-7) become token re-mappings instead of redesigns — the tier system is the scalability requirement made concrete.

## 27. What Approval Unlocks (Phase 3 preview)

With this document approved, Phase 3 can proceed to: token file generation, the component build order (stamp → button → form → table → card → nav → templates), the home + heat-exchanger reference pages as the proving pair, and the photography shot-list derived from §2.1/§21. Open items carried in: the SLA figure (client commitment), CIN/GST display approval, and logo-permission confirmations for the client wall.

---
*End of Datum v1.0. Awaiting approval before Phase 3.*
