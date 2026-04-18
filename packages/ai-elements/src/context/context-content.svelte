<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as HoverCard from "@workspace/ui/hover-card/index.js";
  import type { ComponentProps } from "svelte";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof HoverCard.Content> = $props();
</script>

<HoverCard.Content
  class={cn("min-w-60 divide-y overflow-hidden p-0", className)}
  {...restProps}
/>
