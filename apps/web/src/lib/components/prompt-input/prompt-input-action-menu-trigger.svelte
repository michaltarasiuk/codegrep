<script lang="ts">
  import PlusIcon from "@lucide/svelte/icons/plus";
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  import PromptInputButton from "./prompt-input-button.svelte";

  let { children, ...restProps }: ComponentProps<typeof PromptInputButton> =
    $props();
</script>

<DropdownMenu.Trigger>
  {#snippet child({ props })}
    <PromptInputButton {...props} {...restProps}>
      {#if children}
        {@render children()}
      {:else}
        <PlusIcon class="size-4" />
      {/if}
    </PromptInputButton>
  {/snippet}
</DropdownMenu.Trigger>
