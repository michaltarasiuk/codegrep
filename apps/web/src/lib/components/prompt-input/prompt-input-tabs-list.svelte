<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} {...restProps}>
  {@render children?.()}
</div>
