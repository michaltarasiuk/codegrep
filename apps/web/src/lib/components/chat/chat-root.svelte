<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import { StickToBottom } from "@workspace/stick-to-bottom";
  import type { Snippet } from "svelte";

  import { type Model, setChat, setModel } from "./chat-context.js";

  let {
    chat,
    model,
    children,
  }: {
    chat: Chat;
    model: Model;
    children: Snippet;
  } = $props();

  setChat(() => chat);
  setModel(() => model);
</script>

<StickToBottom class="scrollbar-hide flex flex-1 flex-col overscroll-none px-4">
  {@render children()}
</StickToBottom>
