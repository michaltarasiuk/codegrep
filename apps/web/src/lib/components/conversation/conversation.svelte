<script lang="ts">
  import {
    StickToBottom,
    type StickToBottomOptions,
  } from "@workspace/stick-to-bottom";
  import { cn } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement>, StickToBottomOptions {
    children: Snippet;
  }

  let {
    children,
    initial = "smooth",
    resize = "smooth",
    class: className,
    ...restProps
  }: Props = $props();
</script>

<StickToBottom
  role="log"
  {initial}
  {resize}
  class={cn("relative flex-1 overflow-y-hidden", className)}
  {...restProps}
>
  {@render children()}
</StickToBottom>
