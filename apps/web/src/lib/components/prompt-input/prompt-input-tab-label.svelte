<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > = $props();
</script>

<h3
  bind:this={ref}
  class={cn("text-muted-foreground mb-2 px-3 text-xs font-medium", className)}
  {...restProps}
>
  {@render children?.()}
</h3>
