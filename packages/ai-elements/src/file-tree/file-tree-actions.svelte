<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

  function stopPropagation(event: Event) {
    event.stopPropagation();
  }
</script>

<div
  bind:this={ref}
  data-slot="file-tree-actions"
  class={cn("ml-auto flex items-center gap-1", className)}
  onclick={stopPropagation}
  onkeydown={stopPropagation}
  role="group"
  {...restProps}
>
  {@render children?.()}
</div>
