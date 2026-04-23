<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import * as Message from "@workspace/ai-elements/message/index.js";
  import type { UIMessage } from "ai";

  import CopyToClipboard from "../copy-to-clipboard.svelte";
  import { getChat, getModel } from "./chat-context.js";

  let {
    message,
    isLast,
  }: {
    message: UIMessage;
    isLast: boolean;
  } = $props();

  let chat = $derived(getChat());
  let model = $derived(getModel());
  let isStreaming = $derived(chat.status === "streaming");

  let messageText = $derived(
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n")
  );

  function handleRetry() {
    chat.regenerate({ body: { model } });
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
      <CopyToClipboard text={messageText}>
        {#snippet children(copy, copied)}
          <Message.Action label="Copy" tooltip="Copy" onclick={copy}>
            {#if copied}
              <CheckIcon class="size-3" />
            {:else}
              <CopyIcon class="size-3" />
            {/if}
          </Message.Action>
        {/snippet}
      </CopyToClipboard>
    </Message.Actions>
  {/if}
</Message.Root>
