<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  class={cn("flex flex-wrap items-center gap-2", className)}
  {...restProps}
></div>
