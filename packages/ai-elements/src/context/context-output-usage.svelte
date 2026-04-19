<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import {
    currencyFormatter,
    getUsagePanelState,
  } from "./context-context.svelte.js";
  import TokensWithCost from "./tokens-with-cost.svelte";

  type ContextOutputUsageProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextOutputUsageProps = $props();

  let context = getUsagePanelState();

  let outputTokens = $derived(context.usage?.outputTokens ?? 0);
  let outputCost = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: { input: 0, output: outputTokens },
        }).costUSD?.totalUSD
      : null
  );
  let outputCostText = $derived(currencyFormatter.format(outputCost ?? 0));
</script>

{#if children}
  {@render children()}
{:else if outputTokens}
  <div
    bind:this={ref}
    data-slot="context-output-usage"
    class={cn("flex items-center justify-between text-xs", className)}
    {...restProps}
  >
    <span class="text-muted-foreground">Output</span>
    <TokensWithCost costText={outputCostText} tokens={outputTokens} />
  </div>
{/if}
