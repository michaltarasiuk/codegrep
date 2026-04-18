<script lang="ts">
  import * as Conversation from "@workspace/ai-elements/conversation/index.js";
  import { Spinner } from "@workspace/ui/spinner/index.js";
  import type { UIMessage } from "ai";
  import type { Snippet } from "svelte";

  import { getChatState } from "./chat-context.svelte.js";

  let {
    children,
  }: {
    children: Snippet<[UIMessage, boolean]>;
  } = $props();

  let chatState = getChatState();
</script>

<Conversation.Content>
  {#each chatState.messages as message, i (message.id)}
    {@render children(message, i === chatState.messages.length - 1)}
  {/each}

  {#if chatState.isSubmitted}
    <div class="px-1">
      <Spinner variant="classic" />
    </div>
  {/if}
</Conversation.Content>
