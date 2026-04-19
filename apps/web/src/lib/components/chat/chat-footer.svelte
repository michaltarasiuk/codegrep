<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";

  import { getChat } from "./chat-context.js";

  let {
    children,
  }: {
    children: Snippet;
  } = $props();

  let chat = $derived(getChat());
  let hasMessages = $derived(chat.messages.length > 0);
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
