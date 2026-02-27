<!-- 1c7ad655-5477-4b31-b7dd-0c12642e5a14 -->
---
todos:
  - id: "collect-target-files"
    content: "List all Svelte files in apps/web that use `let { ... } = $props()` and mark them for reorder pass"
    status: pending
  - id: "reorder-props"
    content: "Reorder destructured props in each target file using the agreed priority while keeping `...restProps` last"
    status: pending
  - id: "run-validation"
    content: "Run lint/typecheck for apps/web and fix any formatting/lint regressions introduced by reorder"
    status: pending
  - id: "final-review"
    content: "Review diff to verify changes are non-functional and consistently applied across components"
    status: pending
isProject: false
---
# Sort Props in Svelte Destructuring

## Goal
Apply a consistent ordering for `let { ... } = $props()` across all Svelte components in `apps/web`.

## Ordering Rule
For each destructured prop list, reorder into this sequence:
- Important/data props first (required/value/state/domain props)
- Style props next (`class`, `style`, style-adjacent variant/display props where appropriate)
- Function props last (event/callback handlers such as `on*`)
- Keep spread/rest (`...restProps`) last

## Scope
- Target all `*.svelte` files that destructure `$props()` in `apps/web/src/lib/components/**`.
- Include both UI primitives (e.g. `ui/button/button.svelte`, `ui/sidebar/sidebar-provider.svelte`) and feature components (e.g. `prompt-input/prompt-input.svelte`).
- Skip files without destructured `$props()`.

## Approach
- Build a deterministic per-file ordering pass (manual edit pass, not behavior change).
- Preserve existing defaults (`= ...`), bindables (`$bindable(...)`), aliases (`class: className`), and types.
- Preserve runtime behavior by only reordering keys, not renaming/removing props.
- Keep `children` with non-style/non-function props unless a component convention requires otherwise.
- Run lint/typecheck after edits and resolve formatting-only fallout.

## Validation
- Run project lint for `apps/web` and confirm no new errors.
- Spot-check representative components to ensure callbacks and style classes still flow correctly.
- Ensure diffs are reorder-only (no functional logic changes).