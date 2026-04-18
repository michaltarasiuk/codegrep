<script lang="ts">
  import * as DropdownMenu from "@workspace/ui/dropdown-menu/index.js";
  import type { ComponentProps } from "svelte";

  let {
    align = "start",
    ...restProps
  }: ComponentProps<typeof DropdownMenu.Content> = $props();
</script>

<DropdownMenu.Content {align} {...restProps} />
