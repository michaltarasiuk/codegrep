<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  let {
    openDelay = 0,
    closeDelay = 0,
    ...restProps
  }: ComponentProps<typeof HoverCard.Root> = $props();
</script>

<HoverCard.Root {openDelay} {closeDelay} {...restProps} />
