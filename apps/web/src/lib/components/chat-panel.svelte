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

  let isStreaming = $derived(chat.status === "streaming");
  let isGenerating = $derived(chat.status === "submitted" || isStreaming);

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

<div class="flex size-full flex-col">
  <Conversation.Root class="min-h-0 flex-1 overflow-y-auto">
    <Conversation.Content class="flex min-h-full flex-col gap-3 p-4">
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
                {#if message.role === "assistant"}
                  <Message.Response
                    content={messagePart.text}
                    animation={{ enabled: isStreaming && isLastMessage }}
                  />
                {:else}
                  {messagePart.text}
                {/if}
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

  <div class="shrink-0 pt-2">
    {#if !chat.lastMessage}
      <Suggestion.Root>
        {#each SUGGESTIONS as suggestion (suggestion)}
          <Suggestion.Item {suggestion} onpick={handleSuggestionPick} />
        {/each}
      </Suggestion.Root>
    {/if}

    <PromptInput.Provider>
      <PromptInput.Root onsubmit={handleSubmit}>
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
