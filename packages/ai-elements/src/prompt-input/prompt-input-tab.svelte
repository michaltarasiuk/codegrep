<script lang="ts">
  import { type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} {...restProps}>
  {@render children?.()}
</div>
