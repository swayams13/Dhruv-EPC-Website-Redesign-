# Exploded-View Image Generation Guide
Companion to `docs/design.md` — practical, copy-paste instructions for producing the three exploded-view frame sequences (heat exchanger, pressure vessel, expansion joint).

This is a manual, human-run task — image generation isn't something Claude Code / this Cowork session can do directly. You run these prompts yourself in one of the tools below, review the output, then hand the finished image files back to a Claude Code session to wire into the site.

---

## 1. Where to do it

| Tool | Where | Why / when |
|---|---|---|
| **Nano Banana** (Google's image model) | [gemini.google.com](https://gemini.google.com) — pick the image-generation mode — or [aistudio.google.com](https://aistudio.google.com) for the API/finer control | Best default choice. Strong at photoreal product/industrial renders, and its "edit this image" flow (upload a prior frame + describe the change) is the single best tool for keeping a sequence visually consistent. |
| **ChatGPT image generation** (GPT-image) | [chatgpt.com](https://chatgpt.com), any tier with image gen enabled | Good alternative if Nano Banana output drifts on metal/industrial materials. ChatGPT also supports "here's the last image, now show it 30% more separated" style follow-ups in the same thread. |

**Pick one tool per full sequence and stay in one continuous chat/thread for all frames of that sequence.** Mixing tools mid-sequence, or starting a fresh chat per frame, is the #1 cause of lighting/angle drift that breaks the scroll-scrub illusion. Three separate threads total — one for the heat exchanger, one for the pressure vessel, one for the expansion joint — each run start-to-finish in the same conversation.

---

## 2. The consistency technique (do this, not 24 independent prompts)

1. Generate the **fully exploded** frame first (the "hero" shot — this is also your OG/social image). Get it right before anything else; every other frame is a variation of this one.
2. Generate the **assembled** frame second, in the *same thread*, with a follow-up prompt like: *"Now show the exact same components, same camera angle, same lighting, same background — but fully assembled together with no gaps between parts."*
3. Generate 3–5 **intermediate** frames by asking, in the same thread: *"Same shot again, but with the components at roughly [25%/50%/75%] of the separation distance between the assembled and fully-exploded versions."* Reference "the same shot" every time — that phrase is what keeps the model anchored to the established camera/lighting rather than reinterpreting the scene.
4. If a frame drifts (different background tone, camera angle shifts, a component changes shape) — don't try to prompt your way out of it. Regenerate just that one frame with an explicit correction ("keep the exact same warm-gray background and camera angle as the previous image, only the tube bundle position should change"), or drop it and rely on fewer, better-matched frames.

**Realistic frame count:** aim for **5–8 keyframes** per sequence (assembled, 2–3 separating stages, fully exploded, +1 held frame for the label pass) rather than the full 24 described in `design.md` as the ideal. 5–8 well-matched frames with the site doing eased crossfades between them looks smoother in practice than 24 frames with visible drift. If you want the fuller 24-frame version later, a frame-interpolation tool (e.g. RIFE, or Adobe After Effects optical flow) can generate the in-betweens from your 5–8 keyframes without needing 24 separate AI generations.

---

## 3. Prompts — Heat Exchanger (group homepage, no accent color)

**Frame: fully exploded (generate this one first)**
> Photorealistic 3D product render of an industrial shell-and-tube heat exchanger, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (matte, hex approx #F2F0EA, no reflections). Camera: eye-level, slight 3/4 angle, minimal lens distortion, centered framing, 16:9 aspect ratio. Components separated along the horizontal assembly axis, evenly spaced, left to right: front channel/bonnet head with inlet nozzle — front tubesheet (thick perforated disc) — full tube bundle (hundreds of thin parallel tubes visible individually) — segmented baffle plates spaced along the bundle — cylindrical outer shell — rear tubesheet — rear channel head with outlet nozzle. Brushed carbon steel finish throughout, subtle even specular highlights, no color cast, no paint, no rust. No people, no logos, no text, no watermark, no background props. Sharp focus throughout, even lighting, no dramatic shadows. Read as a precise engineering illustration first, a beautiful render second.

**Follow-up: assembled**
> Same shot — same camera, same lighting, same background — but every component pushed together into its fully assembled, in-service position with no gaps.

**Follow-ups: intermediate stages** (repeat 2–3 times)
> Same shot again, components at roughly [25% / 50% / 75%] of the separation distance shown in the fully exploded version — keep camera, lighting, and background identical.

---

## 4. Prompts — Pressure Vessel (Dhruv EPC homepage, amber accent `#C98A2E`)

**Frame: fully exploded (generate first)**
> Photorealistic 3D product render of an industrial pressure vessel, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (matte, hex approx #F2F0EA). Camera: eye-level, slight 3/4 angle, centered, 16:9 aspect ratio. Components separated along the vertical assembly axis, evenly spaced, top to bottom: top dished/torispherical head lifted upward — cylindrical shell body in the middle — bottom dished head lowered downward — support saddles or skirt displaced outward from the shell — nozzles and a circular manway cover radiating slightly outward from their mounting positions. Brushed carbon steel finish, with a subtle golden-amber specular highlight (matching hex #C98A2E) only on nozzle flange faces — no other color, no paint. No people, no logos, no text, no watermark. Sharp focus, even lighting, no dramatic shadows. Read as a precise engineering illustration first, a beautiful render second.

**Follow-up: assembled**
> Same shot — same camera, lighting, background — fully assembled, no gaps, in normal service position.

**Follow-ups: intermediate stages** (repeat 2–3 times)
> Same shot again, components at roughly [25% / 50% / 75%] separation — keep everything else identical.

---

## 5. Prompts — Expansion Joint / Metallic Bellows (Precise Engineers homepage, blue accent `#0E6BA8`)

**Frame: fully exploded (generate first)**
> Photorealistic 3D product render of an industrial metallic bellows expansion joint, exploded/disassembly view, engineering visualization style. Studio lighting on a neutral warm-gray background (matte, hex approx #F2F0EA). Camera: eye-level, straight-on to slight 3/4 angle, centered, 16:9 aspect ratio. Components separated along the horizontal pipe axis, evenly spaced: top flanged end connection — convoluted stainless steel bellows element in the center (clearly defined convolutions, polished finish, the visual centerpiece) — reinforcing/equalizing rings pulled slightly away from the bellows — external tie rods with end lugs radiating outward and slightly upward — internal flow liner pulled forward, nested where it would normally sit inside the bellows — bottom flanged end connection. Polished stainless steel for the bellows with a subtle cool blue specular rim-light (matching hex #0E6BA8), brushed carbon steel for flanges and tie rods — no paint, no other color cast. No people, no logos, no text, no watermark. Sharp focus, even lighting, no dramatic shadows. Read as a precise engineering illustration first, a beautiful render second.

**Follow-up: assembled**
> Same shot — same camera, lighting, background — bellows fully closed/assembled with end connections together, no gaps.

**Follow-ups: intermediate stages** (repeat 2–3 times)
> Same shot again, components at roughly [25% / 50% / 75%] separation — keep everything else identical.

---

## 6. Export specs

- **Aspect ratio:** 16:9 for every frame in every sequence (matches the hero photo band).
- **Generate at the tool's highest resolution option** (typically 1536×1024 or similar) — you'll downscale, never upscale.
- **Export as PNG** from the generation tool first (lossless), then produce two derived sizes per frame for the site: 1600px-wide (desktop) and 720px-wide (mobile), each in AVIF (primary) and WebP (fallback) — this matches the existing `next/image` pipeline (`apps/web/next.config.mjs` already sets `formats: ['image/avif', 'image/webp']`).
- A quick local conversion once you have the PNGs (run from the repo root, requires `sharp-cli` or similar — ask a Claude Code session to do this conversion step for you, it's a good fit for that):
  ```
  npx @squoosh/cli --avif '{"quality":75}' --webp '{"quality":80}' -d out/ frame-*.png
  ```

---

## 7. Where to save the files

The repo currently has **no `public/` folder under `apps/web/` yet** — the homepage heroes ship today with the `photo` slot empty (confirmed: no page currently passes a `photo=` prop). This feature will be the first to populate it. Recommended structure, consistent with the product-slug naming already used elsewhere in the repo (`heat-exchangers`, `pressure-vessels`, `metallic-bellows-expansion-joint`):

```
apps/web/public/exploded/
├── heat-exchanger/
│   ├── frame-01-assembled.avif  + .webp  (+ -mobile variants)
│   ├── frame-02.avif / .webp
│   ├── ...
│   └── frame-0N-exploded.avif / .webp
├── pressure-vessel/
│   └── (same pattern)
└── expansion-joint/
    └── (same pattern)
```

Since these are local static files served from `public/`, no change to `next.config.mjs`'s `remotePatterns` is needed (that setting only governs *remote* image hosts — these files are local).

---

## 8. Before you hand frames to a Claude Code session, check

- [ ] Background tone and lighting look identical across every frame in a sequence, side by side
- [ ] No text, logos, watermarks, or dimension callouts baked into any image (those get added as real HTML on top, per `design.md` §4.4)
- [ ] Component order/positions match the actual product's real construction (cross-check against that product's spec table before finalizing — don't ship a plausible-looking but wrong internal layout)
- [ ] Accent color (amber/blue) appears only as a subtle specular highlight, never a fill or paint color
- [ ] All frames are uncropped 16:9, nothing recomposed or re-framed between frames

Once frames pass this checklist, hand them (plus this guide and `docs/design.md`) to a Claude Code session on the `phase-4-exploded-hero-sequence` branch (or whatever branch name you land on) to wire into the hero components.
