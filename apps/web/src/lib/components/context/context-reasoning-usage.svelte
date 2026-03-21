<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getContextState } from "./context-context.svelte.js";
  import TokensWithCost from "./tokens-with-cost.svelte";

  type ContextReasoningUsageProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextReasoningUsageProps = $props();

  const context = getContextState();
  const reasoningTokens = $derived(context.usage?.reasoningTokens ?? 0);
  const reasoningCost = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: { reasoningTokens },
        }).costUSD?.totalUSD
      : undefined
  );
  const reasoningCostText = $derived(
    new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(reasoningCost ?? 0)
  );
</script>

{#if children}
  {@render children()}
{:else if reasoningTokens}
  <div
    bind:this={ref}
    data-slot="context-reasoning-usage"
    class={cn("flex items-center justify-between text-xs", className)}
    {...restProps}
  >
    <span class="text-muted-foreground">Reasoning</span>
    <TokensWithCost costText={reasoningCostText} tokens={reasoningTokens} />
  </div>
{/if}
