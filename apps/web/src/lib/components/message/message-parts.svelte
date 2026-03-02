<script lang="ts">
  import type { UIMessage } from "ai";

  import * as Reasoning from "$lib/components/reasoning";

  import Response from "./message-response.svelte";

  let {
    message,
    isLastMessage,
    isStreaming,
  }: {
    message: UIMessage;
    isLastMessage: boolean;
    isStreaming: boolean;
  } = $props();

  let reasoningParts = $derived(
    message.parts.filter((part) => part.type === "reasoning")
  );
  let reasoningText = $derived(
    reasoningParts.map((part) => part.text).join("\n\n")
  );
  let hasReasoning = $derived(reasoningParts.length > 0);
  let isReasoningStreaming = $derived(
    isLastMessage && isStreaming && message.parts.at(-1)?.type === "reasoning"
  );
</script>

{#if hasReasoning}
  <Reasoning.Root class="w-full" isStreaming={isReasoningStreaming}>
    <Reasoning.Trigger />
    <Reasoning.Content content={reasoningText} />
  </Reasoning.Root>
{/if}

{#each message.parts as part, partIndex (partIndex)}
  {#if part.type === "text"}
    <Response
      content={part.text}
      animation={{ enabled: isStreaming && isLastMessage }}
    />
  {/if}
{/each}
