<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn(
    "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
