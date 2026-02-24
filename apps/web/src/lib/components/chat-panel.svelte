<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import { DefaultChatTransport } from "ai";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
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
  let isSubmitDisabled = $derived(!messageInput.trim() || isLoading);

  function submitMessage() {
    chat.sendMessage({ text: messageInput });
    messageInput = "";
  }
</script>

<div class="relative size-full">
  <ScrollArea.Root class="size-full">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-3 pb-36">
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

  <form
    class="absolute inset-x-0 bottom-0 pt-2"
    onsubmit={(e) => {
      e.preventDefault();
      submitMessage();
    }}
  >
    <InputGroup.Root class="mx-auto max-w-4xl">
      <InputGroup.Textarea
        bind:value={messageInput}
        placeholder="Ask about the codebase..."
        class="max-h-72"
        onkeydown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isSubmitDisabled) {
            e.preventDefault();
            submitMessage();
          }
        }}
      />
      <InputGroup.Addon align="block-end">
        <InputGroup.Button
          type="submit"
          variant="default"
          size="icon-xs"
          class="ms-auto rounded-full"
          disabled={isSubmitDisabled}
        >
          <ArrowUpIcon />
          <span class="sr-only">Send</span>
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </form>
</div>
