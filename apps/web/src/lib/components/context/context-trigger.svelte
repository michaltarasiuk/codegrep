<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  import { getContextState } from "./context-context.svelte.js";
  import ContextIcon from "./context-icon.svelte";

  type ContextTriggerProps = ComponentProps<typeof Button> & {
    children?: Snippet;
  };

  let { children, ...restProps }: ContextTriggerProps = $props();

  const context = getContextState();
  const usedPercent = $derived(context.usedTokens / context.maxTokens);
  const renderedPercent = $derived(
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      style: "percent",
    }).format(usedPercent)
  );
</script>

<HoverCard.Trigger>
  {#snippet child({ props })}
    {#if children}
      {@render children()}
    {:else}
      <Button type="button" variant="ghost" {...props} {...restProps}>
        <span class="text-muted-foreground font-medium">
          {renderedPercent}
        </span>
        <ContextIcon />
      </Button>
    {/if}
  {/snippet}
</HoverCard.Trigger>
