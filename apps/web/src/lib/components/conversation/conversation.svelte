<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import {
    StickToBottom,
    type StickToBottomOptions,
  } from "$lib/components/stick-to-bottom/index.js";
  import { cn } from "$lib/utils/cn.js";

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
