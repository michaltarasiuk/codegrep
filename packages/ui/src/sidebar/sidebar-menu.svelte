<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "../cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > = $props();
</script>

<ul
  bind:this={ref}
  data-slot="sidebar-menu"
  data-sidebar="menu"
  class={cn("flex w-full min-w-0 flex-col gap-1", className)}
  {...restProps}
>
  {@render children?.()}
</ul>
