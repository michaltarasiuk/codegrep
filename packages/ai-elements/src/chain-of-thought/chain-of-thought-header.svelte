<script lang="ts">
  import BrainIcon from "@lucide/svelte/icons/brain";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { cn } from "@workspace/ui/cn.js";
  import {
    Collapsible,
    CollapsibleTrigger,
  } from "@workspace/ui/collapsible/index.js";
  import type { Snippet } from "svelte";
  import type { ComponentProps } from "svelte";

  import { getChainOfThought } from "./chain-of-thought-context.svelte.js";

  let {
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleTrigger> & {
    children?: Snippet;
  } = $props();

  let context = getChainOfThought();
</script>

<Collapsible
  open={context.open}
  onOpenChange={(value) => context.setOpen(value)}
>
  <CollapsibleTrigger
    class={cn(
      "text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition-colors",
      className
    )}
    {...restProps}
  >
    <BrainIcon class="size-4" />
    <span class="flex-1 text-start">
      {#if children}
        {@render children()}
      {:else}
        Chain of Thought
      {/if}
    </span>
    <ChevronDownIcon
      class={cn(
        "size-4 transition-transform",
        context.open ? "rotate-180" : "rotate-0"
      )}
    />
  </CollapsibleTrigger>
</Collapsible>
