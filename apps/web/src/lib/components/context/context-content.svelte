<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof HoverCard.Content> = $props();
</script>

<HoverCard.Content
  class={cn("min-w-60 divide-y overflow-hidden p-0", className)}
  {...restProps}
/>
