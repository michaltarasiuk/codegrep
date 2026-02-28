<script lang="ts">
  import DownloadIcon from "@lucide/svelte/icons/download";
  import type { ComponentProps } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils/cn.js";

  import {
    type ConversationMessage,
    defaultFormatMessage,
    messagesToMarkdown,
  } from "./types.js";

  let {
    messages,
    filename = "conversation.md",
    formatMessage = defaultFormatMessage,
    children,
    class: className,
    ...restProps
  }: Omit<ComponentProps<typeof Button>, "onclick"> & {
    messages: ConversationMessage[];
    filename?: string;
    formatMessage?: (message: ConversationMessage, index: number) => string;
  } = $props();

  function handleDownload() {
    const markdown = messagesToMarkdown(messages, formatMessage);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
</script>

<Button
  type="button"
  size="icon"
  variant="outline"
  class={cn(
    "dark:bg-background dark:hover:bg-muted absolute top-4 right-4 rounded-full",
    className
  )}
  onclick={handleDownload}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <DownloadIcon class="size-4" />
  {/if}
</Button>
