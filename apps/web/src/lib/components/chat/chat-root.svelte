<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import { StickToBottom } from "@workspace/stick-to-bottom";
  import type { Snippet } from "svelte";

  import { type Model, setChatState } from "./chat-context.svelte.js";

  let {
    chat,
    model,
    children,
  }: {
    chat: Chat;
    model: Model;
    children: Snippet;
  } = $props();

  setChatState(
    () => chat,
    () => model
  );
</script>

<StickToBottom class="scrollbar-hide flex flex-1 flex-col overscroll-none px-4">
  <div class="relative mx-auto flex w-full max-w-2xl flex-1 flex-col">
    {@render children()}
  </div>
</StickToBottom>
