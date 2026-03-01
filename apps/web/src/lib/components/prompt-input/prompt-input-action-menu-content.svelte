<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let {
    align = "start",
    ...restProps
  }: ComponentProps<typeof DropdownMenu.Content> = $props();
</script>

<DropdownMenu.Content {align} {...restProps} />
