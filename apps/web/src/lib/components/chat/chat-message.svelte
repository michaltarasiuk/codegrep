<script lang="ts">
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import type { UIMessage } from "ai";

  import * as Message from "$lib/components/message/index.js";

  import { getChat, getModel } from "./chat-context";

  let {
    message,
    isLast,
  }: {
    message: UIMessage;
    isLast: boolean;
  } = $props();

  const chat = $derived(getChat());
  const model = $derived(getModel());

  const messageText = $derived(
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n")
  );
  const isStreaming = $derived(chat.status === "streaming");

  function handleRetry() {
    chat.regenerate({ body: { model } });
  }
  function handleCopy() {
    navigator.clipboard.writeText(messageText);
  }
</script>

<Message.Root from={message.role}>
  <Message.Content>
    <Message.Parts {message} {isStreaming} {isLast} />
  </Message.Content>

  {#if message.role === "assistant" && !isStreaming && isLast}
    <Message.Actions>
      <Message.Action label="Retry" tooltip="Retry" onclick={handleRetry}>
        <RefreshCcwIcon class="size-3" />
      </Message.Action>
      <Message.Action label="Copy" tooltip="Copy" onclick={handleCopy}>
        <CopyIcon class="size-3" />
      </Message.Action>
    </Message.Actions>
  {/if}
</Message.Root>
