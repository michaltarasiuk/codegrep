<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { type ChatStatus, DefaultChatTransport, type UIMessage } from "ai";
  import { cn } from "tailwind-variants";

  import { goto } from "$app/navigation";
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

  let id = $derived(page.params.id);
  let model = $state(MODELS[0].id);
  let submitStatus = $state<ChatStatus>("ready");

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

  async function createChat(title: string) {
    const createdChat = await client.api.chat.create.post({
      title,
    });
    if (!createdChat.error) {
      await goto(resolve(`/chat/${createdChat.data.id}`), {
        replaceState: true,
        invalidateAll: true,
      });
    }
  }

  async function sendMessage(message: PromptInput.PromptInputMessage) {
    const isNewChat = !isDefined(id);
    if (isNewChat) {
      try {
        submitStatus = "submitted";
        await createChat(message.text);
      } catch {
        submitStatus = "error";
        return;
      } finally {
        submitStatus = "ready";
      }
    }
    // For new chats, the user message is already persisted by createChat and
    // loaded from the server after goto. Pass undefined to trigger the AI
    // response without re-adding the user message.
    await chat.sendMessage(isNewChat ? undefined : message, {
      body: {
        model,
      },
    });
  }

  function handleSuggestionPick(text: string) {
    sendMessage({ text });
  }
</script>

<ChatUI.Root
  {chat}
  {model}
  className={cn(isDefined(chat.lastMessage) && "pb-30")}
>
  <ChatUI.Conversation>
    {#snippet children(message, isLast)}
      <ChatUI.Message {message} {isLast} />
    {/snippet}
  </ChatUI.Conversation>

  <div
    class={cn(
      "absolute bottom-0 w-full pt-2",
      !isDefined(chat.lastMessage) && "md:bottom-1/2 md:translate-y-1/2"
    )}
  >
    {#if !isDefined(chat.lastMessage)}
      <ChatUI.Suggestions onpick={handleSuggestionPick} />
    {/if}

    <ChatUI.PromptInput
      bind:selectedModel={model}
      {submitStatus}
      handleSubmit={sendMessage}
    />
  </div>
</ChatUI.Root>
