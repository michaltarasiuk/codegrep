<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getUsage } from "tokenlens";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getContextState } from "./context-context.svelte.js";
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

  const context = getContextState();
  const outputTokens = $derived(context.usage?.outputTokens ?? 0);
  const outputCost = $derived(
    context.modelId
      ? getUsage({
          modelId: context.modelId,
          usage: { input: 0, output: outputTokens },
        }).costUSD?.totalUSD
      : undefined
  );
  const outputCostText = $derived(
    new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(outputCost ?? 0)
  );
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
