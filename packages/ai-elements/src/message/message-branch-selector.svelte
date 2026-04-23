<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  import { getMessageBranch } from "./message-branch-context.svelte.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

  let branch = getMessageBranch();
</script>

{#if branch.totalBranches > 1}
  <div
    bind:this={ref}
    class={cn(
      "inline-flex items-center rounded-md border [&>*:not(:first-child)]:rounded-s-md [&>*:not(:last-child)]:rounded-e-md",
      className
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}
