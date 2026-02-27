<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
  bind:this={ref}
  class={cn(
    "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</span>
