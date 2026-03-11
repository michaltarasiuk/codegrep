<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { PUBLIC_API_URL } from "$env/static/public";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
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

  let isSubmitted = $derived(chat.status === "submitted");

  function handleSuggestionPick(text: string) {
    chat.sendMessage({ text });
  }

  function handleSubmit({ text, files }: PromptInput.PromptInputMessage) {
    chat.sendMessage({ text, files });
  }
</script>

<ChatUI.Root {chat}>
  <ChatUI.Conversation messages={chat.messages} {isSubmitted}>
    {#snippet children(message, isLast)}
      <ChatUI.Message {message} {isLast} />
    {/snippet}
  </ChatUI.Conversation>

  <div class="shrink-0 pt-2">
    {#if !chat.lastMessage}
      <ChatUI.Suggestions onpick={handleSuggestionPick} />
    {/if}
  </div>

  <div class="shrink-0">
    <ChatUI.PromptInput bind:selectedModel {handleSubmit} />
  </div>
</ChatUI.Root>
