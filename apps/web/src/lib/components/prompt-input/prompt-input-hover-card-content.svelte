<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  let {
    align = "start",
    ...restProps
  }: ComponentProps<typeof HoverCard.Content> = $props();
</script>

<HoverCard.Content {align} {...restProps} />
