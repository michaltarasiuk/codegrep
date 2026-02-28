<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { useSidebar } from "./context.svelte.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > = $props();

  const sidebar = useSidebar();
</script>

<button
  bind:this={ref}
  data-sidebar="rail"
  data-slot="sidebar-rail"
  aria-label="Toggle Sidebar"
  tabIndex={-1}
  onclick={() => sidebar.toggle()}
  title="Toggle Sidebar"
  class={cn(
    "hover:after:bg-sidebar-border group-data-[side=left]:-inset-e- absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=right]:inset-s-0 after:absolute after:inset-y-0 after:inset-s-[calc(1/2*100%-1px)] after:w-0.5 sm:flex",
    "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
    "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
    "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full",
    "[[data-side=left][data-collapsible=offcanvas]_&]:-inset-e-",
    "[[data-side=right][data-collapsible=offcanvas]_&]:-inset-s-2",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</button>
