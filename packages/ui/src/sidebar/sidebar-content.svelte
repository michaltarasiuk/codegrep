<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "../cn.js";

  let {
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  data-slot="sidebar-content"
  data-sidebar="content"
  class={cn(
    "scrollbar-hide flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
