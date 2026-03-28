<script lang="ts">
  import type { UIMessage } from "ai";
  import type { Snippet } from "svelte";

  import * as Conversation from "$lib/components/conversation/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";

  import { getChat } from "./chat-context";

  let {
    children,
  }: {
    children: Snippet<[UIMessage, boolean]>;
  } = $props();

  const chat = $derived(getChat());

  const isSubmitted = $derived(chat.status === "submitted");
  const messages = $derived(chat.messages);
</script>

<Conversation.Content>
  {#each messages as message, i (message.id)}
    {@render children(message, i === messages.length - 1)}
  {/each}

  {#if isSubmitted}
    <div class="px-1">
      <Spinner />
    </div>
  {/if}
</Conversation.Content>
