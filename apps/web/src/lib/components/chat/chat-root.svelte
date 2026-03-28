<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import type { Snippet } from "svelte";

  import StickToBottom from "../stick-to-bottom/stick-to-bottom.svelte";
  import { type Model, setChat, setModel } from "./chat-context";

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
