<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import SearchIcon from "@lucide/svelte/icons/search";
  import { cn } from "@workspace/ui/cn.js";
  import { CollapsibleTrigger } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

  let {
    title,
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleTrigger> & {
    title: string;
  } = $props();
</script>

<CollapsibleTrigger class={cn("group", className)} {...restProps}>
  {#if children}
    {@render children?.()}
  {:else}
    <div
      class="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center gap-2 text-sm transition-colors"
    >
      <SearchIcon class="size-4" />
      <p class="text-sm">{title}</p>
      <ChevronDownIcon
        class="size-4 transition-transform group-data-[state=open]:rotate-180"
      />
    </div>
  {/if}
</CollapsibleTrigger>
