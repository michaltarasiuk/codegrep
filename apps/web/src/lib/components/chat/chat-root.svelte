<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import type { Snippet } from "svelte";
  import { cn } from "tailwind-variants";

  import { type Model, setChat, setModel } from "./chat-context";

  let {
    chat,
    model,
    children,
    className,
  }: {
    chat: Chat;
    model: Model;
    children: Snippet;
    className?: string;
  } = $props();

  setChat(() => chat);
  setModel(() => model);
</script>

<div class={cn("relative flex size-full flex-col", className)}>
  {@render children()}
</div>
