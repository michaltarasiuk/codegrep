<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  class={cn(
    "bg-secondary text-foreground inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
