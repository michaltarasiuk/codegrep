<script lang="ts">
  import type { UIMessage } from "ai";
  import type { Snippet } from "svelte";

  import * as Conversation from "$lib/components/conversation/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";

  import { getChat } from "./chat-context.js";

  let {
    children,
  }: {
    children: Snippet<[UIMessage, boolean]>;
  } = $props();

  let chat = $derived(getChat());

  let isSubmitted = $derived(chat.status === "submitted");
  let messages = $derived(chat.messages);
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
