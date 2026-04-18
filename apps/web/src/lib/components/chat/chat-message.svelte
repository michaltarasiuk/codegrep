<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import * as Message from "@workspace/ai-elements/message/index.js";
  import type { UIMessage } from "ai";

  import { getChatState } from "./chat-context.svelte.js";

  let {
    message,
    isLast,
  }: {
    message: UIMessage;
    isLast: boolean;
  } = $props();

  let copied = $state(false);

  let chatState = getChatState();

  let messageText = $derived(
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n")
  );

  function handleRetry() {
    chatState.chat.regenerate({ body: { model: chatState.model } });
  }
  function handleCopy() {
    navigator.clipboard.writeText(messageText);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2_000);
  }
</script>

<Message.Root from={message.role}>
  <Message.Content>
    <Message.Parts {message} isStreaming={chatState.isStreaming} {isLast} />
  </Message.Content>

  {#if message.role === "assistant" && !chatState.isStreaming && isLast}
    <Message.Actions>
      <Message.Action label="Retry" tooltip="Retry" onclick={handleRetry}>
        <RefreshCcwIcon class="size-3" />
      </Message.Action>
      <Message.Action label="Copy" tooltip="Copy" onclick={handleCopy}>
        {#if copied}
          <CheckIcon class="size-3" />
        {:else}
          <CopyIcon class="size-3" />
        {/if}
      </Message.Action>
    </Message.Actions>
  {/if}
</Message.Root>
