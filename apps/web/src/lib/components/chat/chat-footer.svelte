<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";

  import { getChatState } from "./chat-context.svelte.js";

  let {
    children,
  }: {
    children: Snippet;
  } = $props();

  let chatState = getChatState();
  let hasMessages = $derived(chatState.messages.length > 0);
</script>

<div
  class={cn(
    "bg-background w-full py-4",
    hasMessages
      ? "sticky bottom-0"
      : "absolute bottom-0 md:bottom-1/2 md:translate-y-1/2"
  )}
>
  {@render children()}
</div>
