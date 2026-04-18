<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

  let {
    id,
    messages = [],
    shared = false,
  }: {
    id?: string;
    messages?: UIMessage[];
    shared?: boolean;
  } = $props();

  let chatId = $derived(id);
  let chat = $derived(
    new Chat({
      id: chatId,
      messages,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        credentials: "include",
      }),
    })
  );

  let model = $state(MODELS[0].id);
  let hasMessages = $derived(isDefined(chat.lastMessage));

  async function sendMessage(message: PromptInput.PromptInputMessage) {
    shared &&= false;
    await chat.sendMessage(message, {
      body: {
        model,
      },
    });
    if (!isDefined(chatId)) {
      await goto(resolve(`/chat/${chat.id}`), {
        replaceState: true,
        invalidate: [CHAT_LIST_KEY],
      });
    }
  }

  function handleSuggestionPick(text: string) {
    sendMessage({ text });
  }
</script>

<ChatUI.Root {chat} {model}>
  <ChatUI.Conversation>
    {#snippet children(message, isLast)}
      <ChatUI.Message {message} {isLast} />

      {#if shared && isLast}
        <ChatUI.PrivateChatCheckpoint />
      {/if}
    {/snippet}
  </ChatUI.Conversation>

  <ChatUI.Footer>
    {#if !hasMessages}
      <ChatUI.Suggestions onPick={handleSuggestionPick} />
    {/if}

    <ChatUI.PromptInput bind:selectedModel={model} handleSubmit={sendMessage} />
  </ChatUI.Footer>
</ChatUI.Root>
