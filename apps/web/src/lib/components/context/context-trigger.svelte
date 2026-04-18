<script lang="ts">
  import type { ComponentProps, Snippet } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  import {
    getContextState,
    percentFormatter,
  } from "./context-context.svelte.js";
  import ContextIcon from "./context-icon.svelte";

  type ContextTriggerProps = ComponentProps<typeof Button> & {
    children?: Snippet;
  };

  let { children, ...restProps }: ContextTriggerProps = $props();

  let context = getContextState();

  let usedPercent = $derived(context.usedTokens / context.maxTokens);
  let renderedPercent = $derived(percentFormatter.format(usedPercent));
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
