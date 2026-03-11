<script lang="ts">
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import type { UIMessage } from "ai";

  import * as Message from "$lib/components/message/index.js";

  import { getChat } from "./chat-context";

  let {
    message,
    isLast,
  }: {
    message: UIMessage;
    isLast: boolean;
  } = $props();

  const chat = getChat();

  let isStreaming = $derived(chat.status === "streaming");
  let messageText = $derived(
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n")
  );
</script>

<Message.Root from={message.role}>
  <Message.Content>
    <Message.Parts {message} {isLast} {isStreaming} />
  </Message.Content>

  {#if message.role === "assistant" && isLast && !isStreaming}
    <Message.Actions>
      <Message.Action
        label="Retry"
        tooltip="Retry"
        onclick={() => chat.regenerate()}
      >
        <RefreshCcwIcon class="size-3" />
      </Message.Action>
      <Message.Action
        label="Copy"
        tooltip="Copy"
        onclick={() => navigator.clipboard.writeText(messageText)}
      >
        <CopyIcon class="size-3" />
      </Message.Action>
    </Message.Actions>
  {/if}
</Message.Root>
