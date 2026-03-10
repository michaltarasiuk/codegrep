<script lang="ts">
  import type { UIMessage } from "ai";
  import type { Snippet } from "svelte";

  import * as Conversation from "$lib/components/conversation/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";

  let {
    messages,
    isSubmitted,
    children,
  }: {
    messages: UIMessage[];
    isSubmitted: boolean;
    children: Snippet<[UIMessage, boolean]>;
  } = $props();
</script>

<Conversation.Root class="min-h-0 flex-1 overflow-y-auto">
  <Conversation.Content class="flex min-h-full flex-col gap-3 p-4">
    {#each messages as message, i (i)}
      {@render children(message, i === messages.length - 1)}
    {/each}

    {#if isSubmitted}
      <div class="px-1">
        <Spinner />
      </div>
    {/if}
  </Conversation.Content>
</Conversation.Root>
