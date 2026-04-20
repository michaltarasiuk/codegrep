<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
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

<div class="scrollbar-hide flex flex-1 flex-col overscroll-none px-4">
  <div class="relative mx-auto flex w-full max-w-2xl flex-1 flex-col">
    {@render children()}
  </div>
</div>
