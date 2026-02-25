<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { DefaultChatTransport } from "ai";

  import * as PromptInput from "$lib/components/prompt-input/index.js";
  import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils/cn";

  import Spinner from "./ui/spinner/spinner.svelte";

  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: import.meta.env.PUBLIC_API_URL + "/api/chat",
    }),
  });

  let messageInput = $state("");
  let isLoading = $derived(
    chat.status === "streaming" || chat.status === "submitted"
  );

  function handleSubmit({ text }: PromptInput.PromptInputMessage) {
    chat.sendMessage({ text });
    messageInput = "";
  }
</script>

<div class="relative size-full">
  <ScrollArea.Root class="size-full">
    <div class="flex size-full max-w-4xl flex-col gap-3 pb-36">
      {#each chat.messages as message, messageIndex (messageIndex)}
        {#each message.parts as messagePart, partIndex (partIndex)}
          {#if messagePart.type === "text"}
            <div
              class={cn(
                "w-fit max-w-4/5 rounded-xl px-4 py-2 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ms-auto"
                  : "bg-muted"
              )}
            >
              {messagePart.text}
            </div>
          {/if}
        {/each}
      {/each}

      {#if isLoading}
        <div class="px-1">
          <Spinner />
        </div>
      {/if}
    </div>
  </ScrollArea.Root>

  <div class="absolute inset-x-0 bottom-0 pt-2">
    <PromptInput.Provider>
      <PromptInput.Root class="mx-auto max-w-4xl" onSubmit={handleSubmit}>
        <PromptInput.Body>
          <PromptInput.Textarea
            bind:value={messageInput}
            class="max-h-72"
            placeholder="Ask about the codebase..."
          />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Submit
            status={chat.status}
            size="icon-xs"
            class="ms-auto"
            onStop={() => chat.stop()}
          />
        </PromptInput.Footer>
      </PromptInput.Root>
    </PromptInput.Provider>
  </div>
</div>
