<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getContextState } from "./context-context.svelte.js";
  import TokensWithCost from "./tokens-with-cost.svelte";

  type ContextCacheUsageProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextCacheUsageProps = $props();

  const context = getContextState();
  const cacheTokens = $derived(context.usage?.cachedInputTokens ?? 0);
  const cacheCost = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: { cacheReads: cacheTokens, input: 0, output: 0 },
        }).costUSD?.totalUSD
      : undefined
  );
  const cacheCostText = $derived(
    new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(cacheCost ?? 0)
  );
</script>

{#if children}
  {@render children()}
{:else if cacheTokens}
  <div
    bind:this={ref}
    data-slot="context-cache-usage"
    class={cn("flex items-center justify-between text-xs", className)}
    {...restProps}
  >
    <span class="text-muted-foreground">Cache</span>
    <TokensWithCost costText={cacheCostText} tokens={cacheTokens} />
  </div>
{/if}
