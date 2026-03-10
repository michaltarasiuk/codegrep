<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { PUBLIC_API_URL } from "$env/static/public";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
  import * as Message from "$lib/components/message/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";

  let {
    chatId,
    initialMessages = [],
  }: {
    chatId: string;
    initialMessages?: UIMessage[];
  } = $props();

  let selectedModel = $state(MODELS[0].id);

  const chat = new Chat({
    get id() {
      return chatId;
    },
    get messages() {
      return initialMessages;
    },
    transport: new DefaultChatTransport({
      api: PUBLIC_API_URL + "/api/chat",
      credentials: "include",
      get body() {
        return {
          chatId,
          model: selectedModel,
        };
      },
    }),
  });

  let isStreaming = $derived(chat.status === "streaming");
  let isSubmitted = $derived(chat.status === "submitted");

  function getMessageText(message: (typeof chat.messages)[number]) {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n");
  }

  function handleSuggestionPick(text: string) {
    chat.sendMessage({ text });
  }

  function handleSubmit({ text, files }: PromptInput.PromptInputMessage) {
    chat.sendMessage({ text, files });
  }
</script>

<div class="flex size-full flex-col">
  <ChatUI.Conversation messages={chat.messages} {isSubmitted}>
    {#snippet children(message, isLastMessage)}
      {@const messageText = getMessageText(message)}
      <Message.Root from={message.role}>
        <Message.Content>
          <Message.Parts {message} {isLastMessage} {isStreaming} />
        </Message.Content>

        {#if message.role === "assistant" && isLastMessage && !isStreaming}
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
    {/snippet}
  </ChatUI.Conversation>

  <div class="shrink-0 pt-2">
    {#if !chat.lastMessage}
      <ChatUI.Suggestions onpick={handleSuggestionPick} />
    {/if}
  </div>

  <div class="shrink-0">
    <ChatUI.PromptInput {chat} bind:selectedModel {handleSubmit} />
  </div>
</div>
