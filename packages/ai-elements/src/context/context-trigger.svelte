<script lang="ts">
  import { Button } from "@workspace/ui/button/index.js";
  import * as HoverCard from "@workspace/ui/hover-card/index.js";
  import type { ComponentProps, Snippet } from "svelte";

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
