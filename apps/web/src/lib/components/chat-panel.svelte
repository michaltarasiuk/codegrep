<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
  import { DefaultChatTransport } from "ai";

  import * as Conversation from "$lib/components/conversation/index.js";
  import * as Message from "$lib/components/message/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";
  import * as Suggestion from "$lib/components/suggestion";
  import { SUGGESTIONS } from "$lib/components/suggestion/consts.js";

  import Spinner from "./ui/spinner/spinner.svelte";

  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: import.meta.env.PUBLIC_API_URL + "/api/chat",
    }),
  });

  let isGenerating = $derived(
    chat.status === "submitted" || chat.status === "streaming"
  );

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function handleSuggestionPick(text: string) {
    chat.sendMessage({ text });
  }

  function handleSubmit({ text }: PromptInput.PromptInputMessage) {
    chat.sendMessage({ text });
  }
</script>

<div class="relative size-full">
  <Conversation.Root class="size-full overflow-y-auto">
    <Conversation.Content
      class="mx-auto flex size-full max-w-4xl flex-col gap-3 pb-36"
    >
      {#each chat.messages as message, messageIndex (messageIndex)}
        {#each message.parts as messagePart, partIndex (partIndex)}
          {#if messagePart.type === "text"}
            {@const isLastMessage = messageIndex === chat.messages.length - 1}
            <Message.Root from={message.role}>
              <Message.Content
                class={message.role === "assistant"
                  ? "bg-muted rounded-lg px-4 py-3"
                  : "bg-primary text-primary-foreground rounded-lg px-4 py-3"}
              >
                {messagePart.text}
              </Message.Content>

              {#if message.role === "assistant" && isLastMessage}
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
                    onclick={() => handleCopy(messagePart.text)}
                  >
                    <CopyIcon class="size-3" />
                  </Message.Action>
                </Message.Actions>
              {/if}
            </Message.Root>
          {/if}
        {/each}
      {/each}

      {#if isGenerating}
        <div class="px-1">
          <Spinner />
        </div>
      {/if}
    </Conversation.Content>
  </Conversation.Root>

  <div class="absolute inset-x-0 bottom-0 pt-2">
    {#if !chat.lastMessage}
      <Suggestion.Root>
        {#each SUGGESTIONS as suggestion (suggestion)}
          <Suggestion.Item {suggestion} onpick={handleSuggestionPick} />
        {/each}
      </Suggestion.Root>
    {/if}

    <PromptInput.Provider>
      <PromptInput.Root class="mx-auto max-w-4xl" onsubmit={handleSubmit}>
        <PromptInput.Body>
          <PromptInput.Textarea
            class="max-h-72"
            placeholder="Ask about the codebase..."
          />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Submit
            status={chat.status}
            size="icon-xs"
            class="ms-auto"
            onstop={() => chat.stop()}
          />
        </PromptInput.Footer>
      </PromptInput.Root>
    </PromptInput.Provider>
  </div>
</div>
