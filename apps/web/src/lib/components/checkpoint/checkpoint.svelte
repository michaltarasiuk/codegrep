<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import { Separator } from "@workspace/ui/separator/index.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

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
