# mistakes.md — append-only incident log

One entry per incident: date · what happened · root cause · rule that prevents recurrence.
If the rule is general, promote it into CLAUDE.md.

---
<!-- entries go below this line -->

## 2026-07-09 — primitives.ts flex scale written without human review

**What happened:** Session 0 scaffold wrote hex values for the `flex` company colour scale (`flex-50` through `flex-900`) into `packages/tokens/src/primitives.ts` without first getting the exact palette approved by Swayam. BUILD-PLAYBOOK.md Session 2 is explicit that new hex values require human approval before being committed.

**Root cause:** The agent inferred placeholder colours to make `semantic.ts` satisfy `Record<Company, typeof semanticBase>` rather than blocking and requesting the real values.

**Rule:** Never write hex primitives for a company colour scale without explicit human sign-off. If real values are unknown, write `// TODO: get hex from client` comments and leave the build broken until they arrive. Do not invent plausible colours to make types pass.

**Resolution (2026-07-09):** Swayam reviewed two options — blue (Datum §5 spec) vs maroon (existing brand CSS). Approved Option A: blue. Rationale: group home two-doors pattern requires amber vs blue to read as distinct companies; amber vs maroon is visually muddled (2.02:1 contrast between the two). Existing site maroon also shared with Vedanta wordmark — entity bleed risk on Precise routes. Approved values: `flex-300: #5BA8D4`, `flex-500: #0E6BA8`, `flex-600: #0A5589`, `flex-700: #083F6A`. WCAG at flex-500 vs white: 5.70:1 (AA ✓). No code change required — these values were already in primitives.ts. Gap closed.
