<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="sidebar-content"
  data-sidebar="content"
  class={cn(
    "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
