<script lang="ts">
  import * as HoverCard from "@workspace/ui/hover-card/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof HoverCard.Trigger> = $props();
</script>

<HoverCard.Trigger {...props} />
