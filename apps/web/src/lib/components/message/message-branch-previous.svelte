<script lang="ts">
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import type { ComponentProps } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";

  import { getMessageBranch } from "./message-branch-context.svelte.js";

  let {
    children,
    onclick,
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
  } = $props();

  let branch = getMessageBranch();
</script>

<Button
  type="button"
  aria-label="Previous branch"
  disabled={branch.totalBranches <= 1}
  size="icon-sm"
  variant="ghost"
  onclick={(e) => {
    onclick?.(e);
    branch.goToPrevious();
  }}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <ChevronLeftIcon class="size-3.5" />
  {/if}
</Button>
