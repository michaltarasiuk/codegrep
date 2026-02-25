<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  let props: ComponentProps<typeof HoverCard.Trigger> = $props();
</script>

<HoverCard.Trigger {...props} />
