<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { setMessageBranch } from "./message-branch-context.svelte.js";

  let {
    ref = $bindable(null),
    defaultBranch = 0,
    branch = $bindable(defaultBranch),
    onBranchChange,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    defaultBranch?: number;
    branch?: number;
    onBranchChange?: (branchIndex: number) => void;
  } = $props();

  setMessageBranch(
    function currentBranch() {
      return branch;
    },
    function setCurrentBranch(value) {
      branch = value;
    },
    function readOnBranchChange() {
      return onBranchChange ?? null;
    }
  );
</script>

<div
  bind:this={ref}
  class={cn("grid w-full gap-2 [&>div]:pb-0", className)}
  {...restProps}
>
  {@render children?.()}
</div>
