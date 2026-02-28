<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getMessageBranch } from "./message-branch-context.svelte.js";

  let {
    ref = $bindable(null),
    index,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    index: number;
  } = $props();

  const branch = getMessageBranch();

  $effect(() => {
    return branch.registerBranch(index);
  });
</script>

<div
  bind:this={ref}
  class={cn(
    "grid gap-2 overflow-hidden [&>div]:pb-0",
    branch.isCurrentBranch(index) ? "block" : "hidden",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
