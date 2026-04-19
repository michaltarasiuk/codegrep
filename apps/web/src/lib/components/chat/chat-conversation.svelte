<script lang="ts">
  import * as Conversation from "@workspace/ai-elements/conversation/index.js";
  import { Spinner } from "@workspace/ui/spinner/index.js";
  import type { UIMessage } from "ai";
  import type { Snippet } from "svelte";

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
      <Spinner variant="classic" />
    </div>
  {/if}
</Conversation.Content>
