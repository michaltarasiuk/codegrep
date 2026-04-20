<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import {
    compactFormatter,
    getUsagePanelState,
    percentFormatter,
  } from "./context-context.svelte.js";

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

  let context = getUsagePanelState();

  let usedPercent = $derived(context.usedTokens / context.maxTokens);
  let displayPct = $derived(percentFormatter.format(usedPercent));
  let used = $derived(compactFormatter.format(context.usedTokens));
  let total = $derived(compactFormatter.format(context.maxTokens));
  let progressValue = $derived(usedPercent * PERCENT_MAX);
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
      <p class="text-muted-foreground font-mono">
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
