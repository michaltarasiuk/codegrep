<script lang="ts">
  import * as DropdownMenu from "@workspace/ui/dropdown-menu/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof DropdownMenu.Root> = $props();
</script>

<DropdownMenu.Root {...props} />
