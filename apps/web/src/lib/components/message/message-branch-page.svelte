<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  import { getMessageBranch } from "./message-branch-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > = $props();

  let branch = getMessageBranch();
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
