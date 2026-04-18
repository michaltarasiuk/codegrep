<script lang="ts">
  import { Collapsible } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

  let {
    defaultOpen = true,
    open = $bindable(defaultOpen),
    ...restProps
  }: ComponentProps<typeof Collapsible> & { defaultOpen?: boolean } = $props();
</script>

<Collapsible bind:open {...restProps} />
