<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import ImageIcon from "@lucide/svelte/icons/image";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import { DefaultChatTransport, type UIMessage } from "ai";

  import { PUBLIC_API_URL } from "$env/static/public";
  import { MODELS } from "$lib/components/chat/consts.js";
  import * as ChatUI from "$lib/components/chat/index.js";
  import * as Message from "$lib/components/message/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";
  import * as Suggestion from "$lib/components/suggestion";
  import { SUGGESTIONS } from "$lib/components/suggestion/consts.js";

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
  <ChatUI.Messages messages={chat.messages} {isSubmitted}>
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
  </ChatUI.Messages>

  <div class="shrink-0 pt-2">
    {#if !chat.lastMessage}
      <Suggestion.Root>
        {#each SUGGESTIONS as suggestion (suggestion)}
          <Suggestion.Item {suggestion} onpick={handleSuggestionPick} />
        {/each}
      </Suggestion.Root>
    {/if}

    <PromptInput.Provider>
      <PromptInput.Root globalDrop multiple onsubmit={handleSubmit}>
        <PromptInput.Body>
          <PromptInput.Textarea
            placeholder="Plan, search, build anything"
            class="max-h-72"
          />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Tools>
            <ChatUI.ModelSelector bind:selectedModel models={MODELS} />
          </PromptInput.Tools>

          <div class="flex items-center gap-2">
            <PromptInput.ActionMenu>
              <PromptInput.ActionMenuTrigger variant="ghost" size="icon-sm">
                <ImageIcon size={16} class="text-muted-foreground" />
              </PromptInput.ActionMenuTrigger>
              <PromptInput.ActionMenuContent>
                <PromptInput.ActionAddAttachments label="Add image or file" />
              </PromptInput.ActionMenuContent>
            </PromptInput.ActionMenu>
            <PromptInput.Submit
              status={chat.status}
              size="icon-sm"
              onstop={() => chat.stop()}
            />
          </div>
        </PromptInput.Footer>
      </PromptInput.Root>
    </PromptInput.Provider>
  </div>
</div>
