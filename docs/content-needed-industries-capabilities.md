# Content needed — Industries & Capabilities (Session 8, VG-020/021)

The engineering for `/industries/` and `/capabilities/` shipped in Session 8:
routes, gates, JSON-LD, sitemap/robots wiring. Every record in
`content/industries/*.json` and `content/capabilities/*.json` is a
**schema-valid placeholder** — it passes the build's ship gates (≥2 products
per industry, ≥1 envelope row per capability) but carries no real narrative
or engineering copy. Every field that needs real content is marked
`CONTENT REQUIRED` in the JSON and renders that way on the page.

**Nothing here is indexed or in the sitemap.** Every record ships with
`"contentComplete": false`. A page enters the sitemap and drops `noindex`
only once its record's `contentComplete` flips to `true` — that's the one
field to change per record once the content below is signed off. No code
change is needed to publish a record.

Send this file directly to whoever at Vedanta has the sourced answers.

---

## Industries (`content/industries/*.json`)

Five records shipped, each with real, already-published products attached
(via `productSlugs`, carried forward from each Product's `industrySlugs`
tag set in Session 4/7). For each, the following fields need sourced copy:

- `requirements` — 150–200 words: what this sector demands of the equipment.
- `applications` — a real list of specific plant applications (not the
  generic placeholder currently there).
- `engineeringConsiderations` — corrosion regime, cyclic duty, code
  obligations specific to the sector.
- `faqs` — 4–6 real Q&As (currently placeholder Q&As with `CONTENT REQUIRED`
  answers).

| Slug | Name | Products already linked | Needs |
|---|---|---|---|
| `oil-gas` | Oil & Gas | heat-exchangers, metallic-bellows-expansion-joint, pressure-vessels, process-skids | requirements, applications, engineering considerations, FAQs, sign-off |
| `refining-petrochemical` | Refining & Petrochemical | fabric-bellows, heat-exchangers, metallic-bellows-expansion-joint, pressure-vessels, process-skids, storage-tanks, telescopic-expansion-joint | same |
| `fertilizer-chemicals` | Fertilizer & Chemicals | heat-exchangers, metallic-bellows-expansion-joint, pressure-vessels, process-skids, storage-tanks | same |
| `power` | Power | damper, fabric-bellows, heat-exchangers, metallic-bellows-expansion-joint, pressure-vessels, process-skids, rubber-bellows | same |
| `water-infrastructure` | Water Infrastructure | dismantling-joint, rubber-bellows, storage-tanks, zero-velocity-valve | same — the blueprint (§10) flags this sector as the group's strongest content (surge protection: ZVVs, air cushion valves, bladder vessels) and worth prioritizing first |

**Not shipped — `pharmaceutical`.** Blueprint §10 names it as a sixth
candidate, but no Product record currently carries `industrySlugs:
["pharmaceutical"]` (or equivalent) — zero product evidence means it can't
even clear the ≥2-product ship gate as a placeholder. If Vedanta wants this
sector live, engineering needs to first tag ≥2 real products with a
pharmaceutical industry link; a placeholder Industry record can then be
added the same way as the five above.

**Every industry's `capabilitySlugs` is currently empty (`[]`)** — no
sourced link exists yet between an industry and the capability page(s) that
serve it. Once both sides have real content, populate this array so the
industry detail page's "Capabilities" section renders (it's currently
hidden — the section only shows when the array is non-empty).

## Capabilities (`content/capabilities/*.json`)

Eight records shipped, per blueprint §11's candidate list. Two
(`heavy-fabrication`, `heavy-machining`) are pre-linked to the matching
Dhruv EPC Product record of the same name; `bellows-forming` is linked to
Precise Engineers' three bellows products (metallic, rubber, fabric) as a
reasonable grouping of already-published products — none of these links are
sourced facts beyond "these products plausibly use this process," and
should be confirmed, not assumed correct.

For every capability, these fields need sourced copy:

- `envelope` — **the ship gate.** Real process-envelope figures: size/
  capacity range, tolerances, and whatever else the design spec's example
  set names (bay dimensions, crane capacity, plate thickness range,
  diameter range, WPS/PQR count, NDT methods held in-house vs. subcontracted
  — blueprint §11). Currently two placeholder rows per record.
- `equipmentList` — real machine/equipment list.
- `standards` — real standards list.
- `faqs` — 4–6 real Q&As.
- `productSlugs` — confirm or correct the pre-linked products above; add
  links for the other five capabilities once sourced.

| Slug | Name | Company | Pre-linked products |
|---|---|---|---|
| `design-engineering` | Design & Engineering | both | none |
| `heavy-fabrication` | Heavy Fabrication | Dhruv EPC | heavy-fabrication |
| `welding` | Welding | both | none |
| `heavy-machining` | Heavy Machining | Dhruv EPC | heavy-machining |
| `bellows-forming` | Bellows Forming | Precise Engineers | metallic-bellows-expansion-joint, rubber-bellows, fabric-bellows (confirm) |
| `heat-treatment` | Heat Treatment | Dhruv EPC | none |
| `surface-treatment` | Surface Treatment | Dhruv EPC | none |
| `testing-inspection` | Testing & Inspection | both | none |

Dhruv EPC's existing hand-written `/dhruv-epc/capabilities/` prose page
(and Precise Engineers' equivalent) already state some of these figures as
"DEMO figure — engineering data pending" — those are a *starting point* for
sourcing, not a substitute for engineering sign-off, since that page's own
notice says the same numbers are prototype placeholders.

---

## To publish a record

1. Replace every `CONTENT REQUIRED` field with sourced copy.
2. Get engineering/management sign-off on the envelope figures (Capability)
   or sector narrative (Industry) — same bar as every other numeric claim
   on this site (CLAUDE.md: "never write superlatives without a sourced
   number").
3. Flip `"contentComplete": false` → `true` in that one JSON file.
4. Run `pnpm build` — the record now appears in `sitemap.xml` and drops
   `noindex` automatically. No other code change is required.
