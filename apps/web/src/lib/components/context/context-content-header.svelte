<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getContextState } from "./context-context.svelte.js";

  const PERCENT_MAX = 100;

  type ContextContentHeaderProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>
  > & {
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: ContextContentHeaderProps = $props();

  const context = getContextState();
  const usedPercent = $derived(context.usedTokens / context.maxTokens);
  const displayPct = $derived(
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      style: "percent",
    }).format(usedPercent)
  );
  const used = $derived(
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(
      context.usedTokens
    )
  );
  const total = $derived(
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(
      context.maxTokens
    )
  );
  const progressValue = $derived(usedPercent * PERCENT_MAX);
</script>

<div
  bind:this={ref}
  data-slot="context-content-header"
  class={cn("w-full space-y-2 p-3", className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <div class="flex items-center justify-between gap-3 text-xs">
      <p>{displayPct}</p>
      <p class="font-mono text-muted-foreground">
        {used} / {total}
      </p>
    </div>
    <div class="space-y-2">
      <div
        class="bg-muted relative h-2 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={PERCENT_MAX}
      >
        <div
          class="bg-primary h-full transition-all"
          style:width="{progressValue}%"
        ></div>
      </div>
    </div>
  {/if}
</div>
