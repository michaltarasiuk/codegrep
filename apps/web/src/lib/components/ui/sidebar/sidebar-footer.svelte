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
  data-slot="sidebar-footer"
  data-sidebar="footer"
  class={cn("flex flex-col gap-2 p-2", className)}
  {...restProps}
>
  {@render children?.()}
</div>
