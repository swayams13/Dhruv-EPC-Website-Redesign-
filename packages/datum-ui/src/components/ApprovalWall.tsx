// ApprovalWall — Clients & Projects spec §3.
// 6-column card grid for the group-level "Approved & inspected by" agencies
// — distinct from ApprovalsMatrix (Datum §20), which is the per-company
// engineering-density table keyed on entityClass/year. These records carry
// neither (Clients & Projects §2 extends Approval with optional logo/kind
// instead), so this component never reads entityClass or year.
//
// Card recipe reuses CertificationCard's border ("rounded-sm border
// border-steel-200 bg-white"), not its <dl> — plus shadow-raised at rest,
// which CertificationCard doesn't use but the spec calls for here.
//
// Card padding 22/18px and grid gap 20px have no exact spacing-scale token
// (nearest are 16/24px); rounded to py-6/px-4 and gap-6 respectively, and
// the 56px logo box rounds to h-16/w-16 (64px) — same token-gap policy as
// SectorGrid/ProjectRecordList, agreed 2026-09-03.
//
// Omit-not-empty: an agency without a logo yet (all 12 currently, until the
// asset-copy step lands real crops) renders name-only — no placeholder box.

import type { Approval } from '@vedanta/schemas'

export interface ApprovalWallProps {
  approvals: Approval[]
  className?: never
}

export function ApprovalWall({ approvals }: ApprovalWallProps): React.ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
      {approvals.map((approval) => (
        <li
          key={approval.approvingOrg}
          className="flex flex-col items-center gap-4 rounded-sm border border-steel-200 bg-white px-4 py-6 shadow-raised"
        >
          {approval.logo && (
            <div className="flex h-16 w-16 items-center justify-center">
              {/* alt carries the agency's legal name, never "logo" (spec §5.4).
                  h-full w-full, not max-w-16: `maxWidth` is fully replaced in
                  tailwind.ts (content/wide/2xl only) — `max-w-16` would
                  silently emit no CSS. The parent box already caps the size. */}
              <img src={approval.logo} alt={approval.approvingOrg} className="h-full w-full object-contain" />
            </div>
          )}
          <p className="text-center font-mono text-helper text-steel-600">{approval.approvingOrg}</p>
        </li>
      ))}
    </ul>
  )
}
