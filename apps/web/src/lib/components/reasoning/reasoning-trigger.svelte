<script lang="ts">
  import BrainIcon from "@lucide/svelte/icons/brain";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { cn } from "@workspace/ui/cn.js";
  import { CollapsibleTrigger } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

  let {
    isStreaming = false,
    duration,
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleTrigger> & {
    isStreaming?: boolean;
    duration?: number;
  } = $props();
</script>

<CollapsibleTrigger class={cn("group", className)} {...restProps}>
  {#if children}
    {@render children?.()}
  {:else}
    <div
      class="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition-colors"
    >
      <BrainIcon class="size-4" />
      {#if isStreaming || duration === 0}
        <p class="animate-pulse">Thinking...</p>
      {:else if !isDefined(duration)}
        <p>Thought for a few seconds</p>
      {:else}
        <p>Thought for {duration} seconds</p>
      {/if}
      <ChevronDownIcon
        class="size-4 transition-transform group-data-[state=open]:rotate-180"
      />
    </div>
  {/if}
</CollapsibleTrigger>
