<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { invalidate, replaceState } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";
  import { client } from "$lib/utils/client";
  import { isDefined } from "$lib/utils/is-defined.js";

  let {
    messages,
  }: {
    messages?: UIMessage[];
  } = $props();

  let id = $state(page.params.id);
  let model = $state(MODELS[0].id);

  const chat = $derived(
    new Chat({
      id,
      messages,
      transport: new DefaultChatTransport({
        api: PUBLIC_API_URL + "/api/chat",
        credentials: "include",
      }),
    })
  );

  async function sendMessage(message: PromptInput.PromptInputMessage) {
    if (!isDefined(id)) {
      const createdChat = await client.api.chat.create.post({
        title: message.text,
      });
      if (!createdChat.error) {
        id = createdChat.data.id;
        replaceState(resolve(`/chat/${id}`), page.state);
        await invalidate("app:chat-list");
      }
    }
    await chat.sendMessage(message, {
      body: {
        model,
      },
    });
  }

  function handleSuggestionPick(text: string) {
    sendMessage({ text });
  }
</script>

<ChatUI.Root {chat} {model}>
  <ChatUI.Conversation>
    {#snippet children(message, isLast)}
      <ChatUI.Message {message} {isLast} />
    {/snippet}
  </ChatUI.Conversation>

  <div class="shrink-0 pt-2">
    {#if !isDefined(chat.lastMessage)}
      <ChatUI.Suggestions onpick={handleSuggestionPick} />
    {/if}
  </div>

  <div class="shrink-0">
    <ChatUI.PromptInput bind:selectedModel={model} handleSubmit={sendMessage} />
  </div>
</ChatUI.Root>
