<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "../cn.js";

  let {
    ref = $bindable(null),
    variant = "legend",
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
    variant?: "legend" | "label";
  } = $props();
</script>

<legend
  bind:this={ref}
  data-slot="field-legend"
  data-variant={variant}
  class={cn(
    "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</legend>
