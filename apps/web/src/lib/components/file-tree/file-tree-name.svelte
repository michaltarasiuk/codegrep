<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

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
  data-slot="file-tree-name"
  class={cn("truncate", className)}
  {...restProps}
>
  {@render children?.()}
</span>
