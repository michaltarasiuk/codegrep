<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import {
    currencyFormatter,
    getContextState,
  } from "./context-context.svelte.js";

  type ContextContentFooterProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextContentFooterProps = $props();

  const context = getContextState();

  let costUSD = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: {
            input: context.usage?.inputTokens ?? 0,
            output: context.usage?.outputTokens ?? 0,
          },
        }).costUSD?.totalUSD
      : null
  );
  let totalCost = $derived(currencyFormatter.format(costUSD ?? 0));
</script>

<div
  bind:this={ref}
  data-slot="context-content-footer"
  class={cn(
    "bg-secondary flex w-full items-center justify-between gap-3 p-3 text-xs",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <span class="text-muted-foreground">Total cost</span>
    <span>{totalCost}</span>
  {/if}
</div>
