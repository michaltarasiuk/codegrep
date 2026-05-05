<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

  import { MODELS } from "./consts.js";
  import ChatConversation from "./conversation.svelte";
  import ChatFooter from "./footer.svelte";
  import ChatMessage from "./message.svelte";
  import ChatPrivateCheckpoint from "./private-checkpoint.svelte";
  import ChatPromptInput from "./prompt-input.svelte";
  import ChatRoot from "./root.svelte";
  import ChatSuggestions from "./suggestions.svelte";

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

<ChatRoot {chat} {model}>
  <ChatConversation>
    {#snippet children(message, isLast)}
      <ChatMessage {message} {isLast} />

      {#if shared && isLast}
        <ChatPrivateCheckpoint />
      {/if}
    {/snippet}
  </ChatConversation>

  <ChatFooter>
    {#if !hasMessages}
      <ChatSuggestions onPick={handleSuggestionPick} />
    {/if}

    <ChatPromptInput bind:selectedModel={model} handleSubmit={sendMessage} />
  </ChatFooter>
</ChatRoot>
