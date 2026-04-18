<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import {
    currencyFormatter,
    getContextState,
  } from "./context-context.svelte.js";
  import TokensWithCost from "./tokens-with-cost.svelte";

  type ContextInputUsageProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextInputUsageProps = $props();

  let context = getContextState();

  let inputTokens = $derived(context.usage?.inputTokens ?? 0);
  let inputCost = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: { input: inputTokens, output: 0 },
        }).costUSD?.totalUSD
      : null
  );
  let inputCostText = $derived(currencyFormatter.format(inputCost ?? 0));
</script>

{#if children}
  {@render children()}
{:else if inputTokens}
  <div
    bind:this={ref}
    data-slot="context-input-usage"
    class={cn("flex items-center justify-between text-xs", className)}
    {...restProps}
  >
    <span class="text-muted-foreground">Input</span>
    <TokensWithCost costText={inputCostText} tokens={inputTokens} />
  </div>
{/if}
