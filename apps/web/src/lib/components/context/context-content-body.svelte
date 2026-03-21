<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

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
