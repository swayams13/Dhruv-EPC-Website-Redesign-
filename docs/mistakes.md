# mistakes.md — append-only incident log

One entry per incident: date · what happened · root cause · rule that prevents recurrence.
If the rule is general, promote it into CLAUDE.md.

---
<!-- entries go below this line -->

## 2026-07-09 — primitives.ts flex scale written without human review

**What happened:** Session 0 scaffold wrote hex values for the `flex` company colour scale (`flex-50` through `flex-900`) into `packages/tokens/src/primitives.ts` without first getting the exact palette approved by Swayam. BUILD-PLAYBOOK.md Session 2 is explicit that new hex values require human approval before being committed.

**Root cause:** The agent inferred placeholder colours to make `semantic.ts` satisfy `Record<Company, typeof semanticBase>` rather than blocking and requesting the real values.

**Rule:** Never write hex primitives for a company colour scale without explicit human sign-off. If real values are unknown, write `// TODO: get hex from client` comments and leave the build broken until they arrive. Do not invent plausible colours to make types pass.
