<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > = $props();
</script>

<span
  bind:this={ref}
  data-slot="file-tree-icon"
  class={cn("shrink-0", className)}
  {...restProps}
>
  {@render children?.()}
</span>
