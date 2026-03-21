<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  type CheckpointProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: CheckpointProps = $props();
</script>

<div
  bind:this={ref}
  data-slot="checkpoint"
  class={cn(
    "text-muted-foreground flex items-center gap-0.5 overflow-hidden",
    className
  )}
  {...restProps}
>
  {@render children?.()}
  <Separator />
</div>
