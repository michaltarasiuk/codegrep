<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

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

  let branch = getMessageBranch();

  $effect(function registerBranch() {
    let unregister = branch.registerBranch(index);
    return function unregisterBranch() {
      unregister();
    };
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
