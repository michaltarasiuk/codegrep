<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    caption,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    caption?: string;
    children?: Snippet;
  } = $props();
</script>

<div bind:this={ref} class={cn("mt-2 space-y-2", className)} {...restProps}>
  <div
    class="bg-muted relative flex max-h-88 items-center justify-center overflow-hidden rounded-lg p-3"
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
  {#if caption}
    <p class="text-muted-foreground text-xs">{caption}</p>
  {/if}
</div>
