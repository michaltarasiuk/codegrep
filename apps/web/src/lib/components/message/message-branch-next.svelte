<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
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

  const branch = getMessageBranch();
</script>

<Button
  type="button"
  aria-label="Next branch"
  disabled={branch.totalBranches <= 1}
  size="icon-sm"
  variant="ghost"
  onclick={(e) => {
    onclick?.(e);
    branch.goToNext();
  }}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <ChevronRightIcon class="size-3.5" />
  {/if}
</Button>
