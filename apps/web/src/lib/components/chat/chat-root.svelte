<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import type { Snippet } from "svelte";

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

<div class="flex size-full flex-col">
  {@render children()}
</div>
