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
  data-slot="field-content"
  class={cn(
    "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
