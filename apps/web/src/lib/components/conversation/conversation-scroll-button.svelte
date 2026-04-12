<script lang="ts">
  import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
  import type { ComponentProps } from "svelte";

  import { getStickToBottomContext } from "$lib/components/stick-to-bottom/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof Button> = $props();

  let { isAtBottom, scrollToBottom } = $derived(getStickToBottomContext());

  function handleScrollToBottom() {
    scrollToBottom();
  }
</script>

{#if !isAtBottom}
  <Button
    type="button"
    size="icon"
    variant="outline"
    class={cn(
      "dark:bg-background dark:hover:bg-muted absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
      className
    )}
    onclick={handleScrollToBottom}
    {...restProps}
  >
    {#if children}
      {@render children?.()}
    {:else}
      <ArrowDownIcon class="size-4" />
    {/if}
  </Button>
{/if}
