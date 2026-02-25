<script lang="ts">
  import CornerDownLeftIcon from "@lucide/svelte/icons/corner-down-left";
  import SquareIcon from "@lucide/svelte/icons/square";
  import XIcon from "@lucide/svelte/icons/x";
  import type { ChatStatus } from "ai";
  import type { ComponentProps } from "svelte";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    status,
    variant = "default",
    size = "icon-sm",
    class: className,
    children,
    onStop,
    onclick,
    ...restProps
  }: ComponentProps<typeof InputGroup.Button> & {
    status?: ChatStatus;
    onStop?: () => void;
  } = $props();

  let isGenerating = $derived(status === "submitted" || status === "streaming");

  const handleClick = (event: MouseEvent) => {
    if (isGenerating && onStop) {
      event.preventDefault();
      onStop();
      return;
    }
    onclick?.(event as never);
  };
</script>

<InputGroup.Button
  aria-label={isGenerating ? "Stop" : "Submit"}
  type={isGenerating && onStop ? "button" : "submit"}
  {variant}
  {size}
  class={cn(className)}
  onclick={handleClick}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else if status === "submitted"}
    <Spinner />
  {:else if status === "streaming"}
    <SquareIcon class="size-4" />
  {:else if status === "error"}
    <XIcon class="size-4" />
  {:else}
    <CornerDownLeftIcon class="size-4" />
  {/if}
</InputGroup.Button>
