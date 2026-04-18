<script lang="ts">
  import * as HoverCard from "@workspace/ui/hover-card/index.js";
  import type { ComponentProps } from "svelte";

  let {
    openDelay = 0,
    closeDelay = 0,
    ...restProps
  }: ComponentProps<typeof HoverCard.Root> = $props();
</script>

<HoverCard.Root {openDelay} {closeDelay} {...restProps} />
