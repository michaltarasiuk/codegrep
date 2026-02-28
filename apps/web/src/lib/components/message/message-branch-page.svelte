<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getMessageBranch } from "./message-branch-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > = $props();

  const branch = getMessageBranch();
</script>

<span
  bind:this={ref}
  class={cn(
    "text-muted-foreground inline-flex h-8 items-center justify-center px-2 text-xs",
    className
  )}
  {...restProps}
>
  {branch.currentBranchPosition + 1} of {branch.totalBranches}
</span>
