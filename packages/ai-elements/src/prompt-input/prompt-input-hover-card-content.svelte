<script lang="ts">
  import * as HoverCard from "@workspace/ui/hover-card/index.js";
  import type { ComponentProps } from "svelte";

  let {
    align = "start",
    ...restProps
  }: ComponentProps<typeof HoverCard.Content> = $props();
</script>

<HoverCard.Content {align} {...restProps} />
