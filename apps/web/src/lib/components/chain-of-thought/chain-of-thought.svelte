<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { setChainOfThought } from "./chain-of-thought-context.svelte.js";

  let {
    ref = $bindable(null),
    open = $bindable(false),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    open?: boolean;
    children?: Snippet;
  } = $props();

  setChainOfThought({
    get open() {
      return open;
    },
    toggle() {
      open = !open;
    },
    setOpen(value) {
      open = value;
    },
  });
</script>

<div
  bind:this={ref}
  class={cn("not-prose w-full space-y-4", className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</div>
