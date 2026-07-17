# design.md — Exploded-View Hero System
**Vedanta Group of Companies · Dhruv EPC Solutions Pvt Ltd · Precise Engineers**

Status: **Proposal — requires design-review sign-off before implementation** (Datum §26 event)
Author: Claude (Cowork), drafted from the existing codebase
Date: 2026-07-16
Applies to: `apps/web/app/(group)/page.tsx`, `dhruv-epc/page.tsx`, `precise-engineers/page.tsx`, and any new components this requires in `packages/datum-ui`

---

## 0. Governance flag — read this first

This document proposes something the codebase currently forbids, deliberately, at the user's direction. Two existing rules are in direct tension with the brief:

1. **CLAUDE.md, "Never" section:** *"Never use stock photos, AI-generated images, or renders — real works photography only."*
2. **`docs/datum-design-system.md` §11 (Motion):** rejects ambient/decorative animation and parallax outright, and caps the entire system's animation budget to one 700ms "signature moment" per hero (a line-draw + count-up), reused verbatim on the home hero and every product hero.
3. **`docs/launch-checklist.md` (Session 14):** the hero components are marked *"template contract locked after Session 8 — no component or layout changes permitted,"* and the project is in final pre-launch gate review (7/10 gates passed, 3 client-blocked). This is not an early-stage codebase — it's days from going live.

**Decision already made (per your instruction):** the exploded-view sequences will use **photorealistic AI-generated 3D-render imagery** (Nano Banana / ChatGPT image generation), not the diagrammatic-illustration alternative. That is a conscious, explicit override of rule (1) above, not an oversight. This document does not quietly work around that rule — it names the override so it can be logged.

**Before this ships, three things need explicit human sign-off, not silent agreement:**
- A dated entry in `docs/mistakes.md` (or a new `docs/decisions.md`) recording that the photography law was knowingly overridden for this feature, and why, so no future session "fixes" it back to a photo.
- Reopening the Session-8 hero template lock — this is a scope decision for whoever owns that lock, not something to just re-edit.
- A motion-budget exception: the existing spec allows exactly one 700ms moment. A scroll-scrubbed exploded-view sequence is a second, larger motion event. §11 needs an addendum, not a violation-by-silence.

Everything below is written so that *if* those three sign-offs happen, implementation can start immediately from this spec without more discovery. Where the doc must invent something not in Datum (new component, new motion pattern), it says so explicitly and proposes the value as a **candidate token**, not a shipped one.

---

## 1. Brand direction: "industrial luxury"

Vedanta Group sits above Dhruv EPC and Precise Engineers as the holding identity — steel-only, no accent color, per the existing `semanticGroup` token set (`rfq` maps to `steel-950`, no amber/blue). That constraint is actually the right foundation for "luxury": luxury in an industrial B2B context reads as *restraint*, not ornament. The existing system already encodes this correctly — capped weight (600 max), one radius (`radius-sm`, 2px), one accent color per company capped at ≤5% of screen, mono type reserved for verified numbers. The exploded-view feature must reinforce this, not fight it:

- The exploded view is not decoration. It replaces a static photo in a slot the hero already has (`photo` prop on `HomeHero`/`ProductHero`) — it does not add a new slot, new color, or new type of claim.
- Every frame of the exploded sequence is a real, dimensioned assembly — not a stylized abstraction. A proposal engineer should be able to point at a part in the exploded view and expect it to correspond to a real spec-table row. This is what keeps a "wow" visual from reading as fluff to Persona A (the buyer) and Persona C (the crawler) alike.
- Luxury cues to lean on, all already tokenized: generous negative space (space-24/32, i.e. 96–128px section rhythm), warm steel-950 ink on steel-50 paper (not pure black/white), IBM Plex Mono for every dimension label that appears mid-sequence, and the amber/blue accent used only on the single dimension tick + RFQ button, never as a fill.

---

## 2. The three sequences

| Page | Route | Product | Accent (per `semantic.ts`) |
|---|---|---|---|
| Group home | `(group)/page.tsx` | Heat exchanger (shared hero — no company accent; steel only, per `semanticGroup`) | none — steel-950 only |
| Dhruv EPC home | `dhruv-epc/page.tsx` | Pressure vessel | `arc-500` (`#C98A2E`, golden amber — v1.1 palette) |
| Precise Engineers home | `precise-engineers/page.tsx` | Expansion joint (metallic bellows type — the flagship SKU: `metallic-bellows-expansion-joint`) | `flex-500` (`#0E6BA8`, blue) |

This mirrors the existing site architecture exactly (group → Dhruv → Precise, in that order, matching `docs/vedanta-group-platform-plan.md`'s site map) and the existing accent law (steel for group, amber for Dhruv, blue for Precise). Nothing new is invented at the IA level — only the hero's photo slot changes behavior.

### 2.1 Narrative arc (same shape on all three, different subject)

1. **Assembled** (0% scroll into hero) — the equipment as a finished, whole object, matching what currently ships as the static hero photo. This is the "safe" frame — if a user never scrolls, or if `prefers-reduced-motion` is set, this is the *only* frame ever shown.
2. **Separating** (0–60% scroll through the hero's scroll-track) — outer shell/shell components lift and separate along the assembly axis, revealing one internal layer per scroll step.
3. **Fully exploded** (60–90%) — all major components suspended along the assembly axis, evenly spaced, each still occupying its correct relative position — this is the "hero" frame, the one used for social/OG images.
4. **Label pass** (90–100%) — 3–5 IBM Plex Mono dimension/spec callouts fade in against specific components (reusing the existing `DimensionLabel` count-up mechanic instead of inventing a new one), then the sequence holds.

Scrolling back up reverses the sequence (it is scroll-*position*-driven, not scroll-*event*-triggered) — this is what keeps it from being "parallax" in the sense Datum bans (parallax = decorative depth-of-field on scroll; this is a single object's state bound to scroll position, functionally closer to the existing DatumRule/DimensionLabel mechanic than to parallax, which is the argument to make in the design-review sign-off).

### 2.2 Per-product exploded layers

**Heat exchanger (group home)** — shell-and-tube type, matching Dhruv's actual `heat-exchangers` product page so the crawler-reconstructable claim holds end to end:
1. Outer shell (cylindrical pressure shell)
2. Shell-side baffles (segmented baffle plates, shown mid-separation)
3. Tube bundle (full tube array, U-tube or straight, pulled axially clear of the shell)
4. Tubesheet (front + rear, shown as thick perforated discs flanking the bundle)
5. Channel/bonnet head + nozzles (inlet/outlet, shell-side and tube-side, shown last, floating above/below at the correct nozzle orientation)
6. Label pass: shell diameter (Ø mm), tube count, design pressure (bar), design temp (°C), material spec (e.g. SA-516 Gr.70) — same "counts up to a true figure" mechanic as `DimensionLabel`.

**Pressure vessel (Dhruv EPC home)**:
1. Outer shell (vertical or horizontal cylindrical shell with formed heads)
2. Top and bottom heads (dished/torispherical, separated axially)
3. Internal supports/saddles or skirt
4. Internal trays/demister/nozzle reinforcement pads (if the flagship SKU has them — pull the actual spec sheet before finalizing which internals appear)
5. Nozzles and manway (shown last, radiating slightly outward from their shell positions)
6. Label pass: design pressure (bar/psi), shell thickness (mm), volume (m³ or L), code stamp (ASME/ASME U-stamp), material.

**Expansion joint (Precise Engineers home)** — metallic bellows type:
1. End connections (flanges/weld ends, top and bottom)
2. Bellows element (the convoluted metallic bellows, shown as the visually central "opening" element of the whole sequence — this is the money shot)
3. Reinforcing rings / equalizing rings (if present on the flagship configuration)
4. Tie rods / control rods (shown radiating outward, since they're structurally external to the bellows)
5. Liner (internal flow liner, shown last, nested inside the bellows)
6. Label pass: movement capacity (± mm axial/lateral/angular), design pressure, number of convolutions, material (e.g. SS 321).

*Before finalizing exact layer lists, pull the real spec tables from each product's `page.tsx` / CMS content — the label-pass numbers must be true figures pulled from the same source as the spec table, per Datum's "counts up to a true figure" rule and per the CMS rule that `oneLineScope` must contain a digit. Do not invent plausible-looking numbers for the label pass; wire them to the same data the spec table reads from, or the crawler-reconstructable-claim principle breaks.*

---

## 3. Motion mechanics (the technical spec)

### 3.1 What this is NOT
Not scroll-jacking in the sense of hijacking the user's scroll wheel or locking page scroll to a fixed-position stage while an unrelated animation plays. The hero's own scroll-track (its natural in-flow height on the page) is what drives the sequence — the user's scroll deltas map 1:1 to sequence position, nothing intercepts or slows their scroll. This distinction matters for the design-review conversation: Datum's ban is aimed at hijacking and ambient decoration, and this is neither.

### 3.2 Implementation approach — pre-rendered frame sequence, not real-time 3D
Do **not** ship Three.js / WebGL / a live GLTF model. That would blow the JS budget hard (marketing routes are capped at 120 KB gz, currently sitting at 93.8 KB — there is only ~26 KB of headroom) and is unnecessary for a scroll-scrubbed sequence where the camera angle never changes.

Recommended approach: a **numbered image-frame sequence** (the same technique Apple's product pages use), rendered once via AI image generation, then scrubbed via scroll:

1. Generate N frames (recommend **24 frames** per sequence — enough for smooth perceived motion at typical scroll speeds, small enough to keep total payload reasonable) showing the same camera angle/lighting/background across the full separation arc.
2. Export as AVIF (primary) + WebP (fallback) per the existing `next/image` pipeline, at 2 sizes (mobile 720px-wide, desktop 1600px-wide).
3. Preload only frame 0 (the LCP-critical assembled shot — must stay preloaded exactly as today's static hero photo is). Lazy-load the remaining frames once the hero enters the viewport, prioritized by scroll direction.
4. Bind scroll position within the hero's track to a frame index via `IntersectionObserver` + `requestAnimationFrame`-throttled scroll listener (never a raw `scroll` event handler — must be rAF-gated to avoid layout thrash). Swap frames by toggling `opacity`/`display` or `<picture>` `src` — never by animating a layout property, per the existing "only transform/opacity may animate" performance law.
5. Total added payload budget: **≤ 25 KB of new JS** for the scrub controller (vanilla, no animation library — GSAP/Framer Motion would need a "new dependency" justification per CLAUDE.md's "Requires human review" list, and isn't needed for index-swapping logic this simple). Images are not JS budget but do count toward LCP/CLS — reserve the frame container's aspect ratio up front to avoid CLS.
6. `prefers-reduced-motion: reduce` → render frame 0 only, statically, exactly as the current hero photo behaves today. No sequence loads at all (saves the mobile-data cost too — treat this as a data-saver benefit, not just an accessibility checkbox).

### 3.3 New motion tokens needed (candidates — not yet approved)
The existing `motion` token set (`instant/fast/standard/deliberate/signature`) covers discrete transitions, not a continuous scroll-bound sequence, so no existing token directly applies to "how fast frames change relative to scroll" — that's a scroll-distance mapping, not a duration. No new *duration* token is needed. What *is* needed:

- A named scroll-track height, e.g. `scrollTrack.hero: 240vh` (the hero's total in-flow height while its internal sequence plays) — propose as a new primitive under a `layout` or `scroll` namespace, single value, reused identically across all three heroes rather than picked ad hoc.
- Reuse `motion.fast` (180ms) for the label-pass fade-ins (frame 22–24), and reuse the existing `DimensionLabel` count-up component verbatim rather than building a new label mechanic.

### 3.4 Accessibility & performance checklist (mirrors the existing Datum verify pass, extended)
- [ ] `prefers-reduced-motion` → static frame 0, verified at OS level, not just a CSS media query smoke-test
- [ ] Sequence is keyboard/screen-reader inert decoration with a single meaningful `alt` on frame 0 describing the assembled equipment (real technical fact, not "hero image") — the sequence itself gets `aria-hidden`, the real content (H1, value statement, spec chips) is unaffected and reads identically to today
- [ ] No sequence content is load-bearing for any claim — every number that appears in the label pass also exists in the page's real spec table / JSON-LD, so a crawler that never scroll-triggers anything still gets the full claim
- [ ] LCP element (frame 0) preloaded exactly as today's hero photo is — sequence must not regress the existing LCP ≤ 2.5s p75 budget
- [ ] CLS: hero container reserves final aspect ratio before any frame loads
- [ ] 320px viewport: sequence still fits without horizontal scroll; on narrow viewports consider whether the sequence auto-plays as a shorter, simpler crossfade instead of full scroll-scrub (open question for design review — see §5)
- [ ] JS budget: marketing route stays ≤ 120 KB gz after the scrub controller ships (current headroom: ~26 KB)

---

## 4. Image generation prompts (Nano Banana / ChatGPT)

Photorealistic 3D-render style, per your direction. Each prompt is written to produce a **consistent camera angle and lighting across the full frame set**, which is the single biggest failure mode for scroll-scrubbed sequences — if the AI regenerates each frame independently, angle/lighting drift will make the scrub look jittery. Two workable approaches:

- **Preferred:** generate the *fully exploded* master frame first, locking camera/lighting/background, then request "the same shot, same camera, same lighting, but with components N% closer together" for each intermediate frame, referencing the previous output image each time.
- **Fallback (if the tool can't do reference-chaining well):** generate the assembled and fully-exploded end states first, then use interpolation/tweening tooling (e.g. a simple 3D compositing pass, or asking the model for "5 intermediate states evenly spaced between image A and image B") rather than 24 independent generations.

### 4.1 Base prompt — Heat Exchanger (group home)

> Photorealistic 3D product render of an industrial shell-and-tube heat exchanger, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (hex approx #F2F0EA, matte, no reflections on the background itself). Camera: eye-level, slight 3/4 angle, orthographic-leaning perspective (minimal lens distortion), locked framing for a sequence of shots. Components shown separated along the horizontal assembly axis in this order, evenly spaced: cylindrical outer shell (brushed steel finish) — segmented baffle plates — full tube bundle (hundreds of thin parallel tubes, visible individually) — front and rear circular tubesheets (thick perforated discs) — channel/bonnet heads with inlet/outlet nozzles at each end. Materials: brushed and lightly oxidized carbon steel, subtle amber-toned specular highlights only where metal catches light (no other color cast). No people, no logos, no text overlays, no background props, no gradients or bokeh. Sharp focus throughout, even lighting, no dramatic shadows. This must read as a precise engineering illustration first and a beautiful render second — accuracy of proportion and component shape over stylization.

**Frame variants:** re-request the same prompt with `"components fully assembled, touching, no gaps"` (frame 0), then `"components separated by approximately [X]% of full separation distance"` for intermediate frames, then the base prompt above for the fully-exploded frame.

### 4.2 Base prompt — Pressure Vessel (Dhruv EPC home)

> Photorealistic 3D product render of an industrial pressure vessel, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (hex approx #F2F0EA, matte). Camera: eye-level, slight 3/4 angle, locked orthographic-leaning framing for a sequence of shots. Components separated along the vertical assembly axis, evenly spaced, in this order: cylindrical shell body (brushed carbon steel) — top dished/torispherical head, lifted upward — bottom dished head, lowered downward — internal support saddles or skirt, shown displaced outward from the shell — nozzles and a circular manway cover, radiating slightly outward from their mounting positions on the shell. Materials: brushed carbon steel with occasional golden-amber specular highlight (matching brand accent #C98A2E) only on nozzle flange faces — no other color cast, no paint, no rust. No people, no logos, no text, no dramatic shadows, sharp focus throughout, even studio lighting. Read as a precise engineering illustration first, a beautiful render second.

### 4.3 Base prompt — Expansion Joint / Metallic Bellows (Precise Engineers home)

> Photorealistic 3D product render of an industrial metallic bellows expansion joint, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (hex approx #F2F0EA, matte). Camera: eye-level, straight-on to slightly 3/4 angle, locked framing for a sequence of shots. Components separated along the horizontal (pipe axis) assembly axis, evenly spaced, in this order: top flanged end connection — convoluted stainless steel bellows element (the visual centerpiece, shown with clearly defined convolutions, polished stainless finish), positioned centrally — reinforcing/equalizing rings, shown pulled slightly away from the bellows convolutions — external tie rods with end lugs, radiating outward and slightly upward from the assembly — internal flow liner, shown nested just inside where the bellows would be, pulled forward toward camera. Materials: polished stainless steel for the bellows (cool blue-white specular highlights, matching brand accent #0E6BA8 only as a subtle rim-light, not a paint color) and brushed carbon steel for end flanges and tie rods. No people, no logos, no text, sharp focus throughout, even lighting, no dramatic shadow. Read as a precise engineering illustration first, a beautiful render second.

### 4.4 Prompt guardrails (apply to all three)
- Never include text, watermarks, dimension callouts, or logos baked into the image — all labels are rendered as real HTML/DOM (`DimensionLabel` component) on top of the image, per the crawler-reconstructable-claim rule and so labels stay screen-reader/SEO-accessible.
- Keep the background and lighting **identical** across every frame in one sequence — this is the #1 thing to check before accepting a batch of generated frames.
- Keep the accent color (amber/blue) to a subtle specular highlight only, never a fill or paint color — this preserves the "≤5% accent, RFQ button is the only saturated element" rule even inside a photoreal render.
- Aspect ratio: generate at 16:9 (matching the existing hero photo band's aspect ratio) so no cropping/recomposition is needed downstream.

---

## 5. Open questions for design review (do not decide silently)

1. **Photoreal override, formally logged where?** — `docs/mistakes.md` is described as append-only for *incidents*; this is a deliberate decision, not a mistake. Recommend a new `docs/decisions.md` (or a dated section in `docs/vedanta-group-platform-plan.md`) rather than overloading mistakes.md's purpose.
2. **Template lock** — who owns the Session-8 lock, and what's the process to reopen it for this one feature versus reopening it wholesale?
3. **Mobile behavior** — full scroll-scrub on a 320–390px viewport risks feeling sluggish on a long, narrow hero. Candidate alternative: a shorter, simpler 3-frame crossfade (assembled → exploded → labeled) on mobile instead of the full 24-frame scrub, still respecting the same reduced-motion and JS-budget rules. Needs a decision, not an assumption.
4. **Frame count vs. asset budget** — 24 frames × 3 sequences × 2 formats (AVIF/WebP) × 2 sizes = 288 image exports. Confirm this is acceptable generation/storage scope before committing to the number.
5. **Precise Engineers flagship SKU** — this doc assumes the metallic bellows expansion joint is the flagship for the exploded view (it's the most visually legible "bellows opening up" story). Confirm against actual sales priority — it might be the rubber bellows or a different SKU that gets the largest share of RFQs.

---

## 6. What this document deliberately does not do

- It does not modify any code, component, or token file. Everything above is a spec for a future session to implement, once the sign-offs in §0 are obtained.
- It does not invent new hex colors — accent colors referenced above are the *existing* `arc-500`/`flex-500` values from `packages/tokens/src/primitives.ts` (v1.1, approved 2026-07-15).
- It does not touch `docs/datum-design-system.md` directly — any accepted version of this proposal should be merged into that file as new sections (extending §11 Motion and §19 Hero patterns) rather than living permanently as a separate file, once approved.
