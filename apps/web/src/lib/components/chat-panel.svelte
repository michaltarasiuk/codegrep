<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { cn } from "@workspace/ui/cn.js";
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

  async function sendMessage(message: PromptInput.PromptInputMessage) {
    // Any new prompt from a shared chat starts a private fork, so hide the shared-only checkpoint UI
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
    sendMessage({
      text,
    });
  }
</script>

<ChatUI.Root {chat} {model}>
  <ChatUI.Content>
    <ChatUI.Conversation>
      {#snippet children(message, isLast)}
        <ChatUI.Message {message} {isLast} />

        {#if shared && isLast}
          <ChatUI.PrivateChatCheckpoint />
        {/if}
      {/snippet}
    </ChatUI.Conversation>

    <div
      class={cn(
        "bg-background w-full py-4",
        isDefined(chat.lastMessage)
          ? "sticky bottom-0"
          : "absolute bottom-0 md:bottom-1/2 md:translate-y-1/2"
      )}
    >
      {#if !isDefined(chat.lastMessage)}
        <ChatUI.Suggestions onPick={handleSuggestionPick} />
      {/if}

      <ChatUI.PromptInput
        bind:selectedModel={model}
        handleSubmit={sendMessage}
      />
    </div>
  </ChatUI.Content>
</ChatUI.Root>
