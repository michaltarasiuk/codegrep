<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Collapsible } from "$lib/components/ui/collapsible/index.js";

  let {
    defaultOpen = true,
    open = $bindable(defaultOpen),
    ...restProps
  }: ComponentProps<typeof Collapsible> & { defaultOpen?: boolean } = $props();
</script>

<Collapsible bind:open {...restProps} />
