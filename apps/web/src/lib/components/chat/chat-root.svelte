<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import type { Snippet } from "svelte";

  import { setChatContext } from "./chat-context";

  let { chat, children }: { chat: Chat; children: Snippet } = $props();

  setChatContext(() => chat);
</script>

<div class="flex size-full flex-col">
  {@render children()}
</div>
