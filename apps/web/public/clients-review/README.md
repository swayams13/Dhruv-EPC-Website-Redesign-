# clients-review/ — review-grade logo crops, still NOT final artwork

The 54 files here (`clients/c01.png`…`c42.png`, `approvals/a1.png`…`a12.png`)
are raster crops lifted out of `Vedanta Group_Brochure_2026.pdf` page 4 at 3×,
white-framed to remove divider hairlines, trimmed to ink bounding box.

**Status as of 2026-09-03:** written permission is now on file for all 44
named clients (`consent: 'granted'` on every `content/clients/*.json`
record — see `docs/mistakes.md`), and every `logo` field here is wired and
rendering in production. **This resolves the rights gate, not the artwork
quality gate.** These are still the exact review-grade crops §5 warns
against:

1. ~~Written permission is on file per client~~ — done, all 44.
2. Real artwork (SVG or 4× transparent PNG from the client's own brand page)
   still needs to replace every crop here — they carry JPEG ringing and a
   baked white ground and will not survive a dark band or a retina display.
3. Each mark still needs normalizing to a fixed optical height, not a
   bounding box — the wall currently reads as uneven brand weights.

A future session should re-request real artwork per client and swap the
`logo` paths in `content/clients/*.json` / `content/approvals/*.json` —
no content-record shape or component change needed, only the asset files.

See `design_handoff_clients_projects/CLIENTS_AND_PROJECTS_IMPLEMENTATION.md`
§5 ("Logo assets — the blocker before publish") for the full checklist.

TODO (spec §5, §6 note on the 12 agencies): the 12 files under `approvals/`
have no `consent` field on `Approval` at all (only `ClientRecord` does) and
no `kind` classification yet ("inspected and released" vs "approved-vendor
list" — the brochure conflates them). `Approval.logo` is now populated for
all 12 without that classification (human explicitly deferred it,
2026-09-03) — get the client to classify all twelve when convenient;
`ApprovalWall` doesn't currently render `kind` differently, so nothing is
blocked on it.
