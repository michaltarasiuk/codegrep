<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    children?: import("svelte").Snippet;
  } = $props();
</script>

<span
  bind:this={ref}
  class={cn(
    "bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-normal transition-colors",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</span>
