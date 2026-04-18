<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type ContextContentBodyProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextContentBodyProps = $props();
</script>

<div
  bind:this={ref}
  data-slot="context-content-body"
  class={cn("w-full p-3", className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</div>
