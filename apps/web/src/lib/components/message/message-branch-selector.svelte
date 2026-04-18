<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

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
      "inline-flex items-center rounded-md border [&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md",
      className
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}
