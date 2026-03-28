<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { DefaultChatTransport, type UIMessage } from "ai";
  import { cn } from "tailwind-variants";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys";
  import { isDefined } from "$lib/utils/is-defined.js";

  let {
    id = page.params.id,
    messages,
  }: {
    id?: string;
    messages?: UIMessage[];
  } = $props();

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
  const hasMessages = $derived(isDefined(chat.lastMessage));

  async function sendMessage(message: PromptInput.PromptInputMessage) {
    await chat.sendMessage(message, {
      body: {
        model,
      },
    });
    if (!isDefined(id)) {
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
  <ChatUI.Content>
    <ChatUI.Conversation>
      {#snippet children(message, isLast)}
        <ChatUI.Message {message} {isLast} />
      {/snippet}
    </ChatUI.Conversation>

    <div
      class={cn(
        "bg-background bottom-0 py-4",
        hasMessages
          ? "sticky"
          : "absolute w-full md:bottom-1/2 md:translate-y-1/2"
      )}
    >
      {#if !hasMessages}
        <ChatUI.Suggestions onPick={handleSuggestionPick} />
      {/if}

      <ChatUI.PromptInput
        bind:selectedModel={model}
        handleSubmit={sendMessage}
      />
    </div>
  </ChatUI.Content>
</ChatUI.Root>
