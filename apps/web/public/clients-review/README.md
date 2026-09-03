# clients-review/ — review-grade logo crops, NOT production artwork

The 54 files here (`clients/c01.png`…`c42.png`, `approvals/a1.png`…`a12.png`)
are raster crops lifted out of `Vedanta Group_Brochure_2026.pdf` page 4 at 3×,
white-framed to remove divider hairlines, trimmed to ink bounding box.

They are **for client review only**. Do not wire any content record's `logo`
field to a path under this directory until:

1. Written permission is on file per client/agency, recorded as `consent` on
   the `ClientRecord` (agencies have no such field yet — see TODO below).
2. Real artwork (SVG or 4× transparent PNG from the client's own brand page)
   replaces the brochure crop — these carry JPEG ringing and a baked white
   ground and will not survive a dark band or a retina display.
3. Each mark is normalized to a fixed optical height, not a bounding box.

See `design_handoff_clients_projects/CLIENTS_AND_PROJECTS_IMPLEMENTATION.md`
§5 ("Logo assets — the blocker before publish") for the full rights/format/
normalization checklist this directory exists to satisfy.

TODO (spec §5, §6 note on the 12 agencies): the 12 files under `approvals/`
have no `consent` field on `Approval` at all (only `ClientRecord` does) and
no `kind` classification yet ("inspected and released" vs "approved-vendor
list" — the brochure conflates them). Get the client to classify all twelve
and decide whether agency marks need the same written-permission pass as the
42 client marks before any `Approval.logo` gets populated from this
directory.
