<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    inset,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    inset?: boolean;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="dropdown-menu-label"
  data-inset={inset}
  class={cn("px-2 py-1.5 text-sm font-semibold data-inset:ps-8", className)}
  {...restProps}
>
  {@render children?.()}
</div>
