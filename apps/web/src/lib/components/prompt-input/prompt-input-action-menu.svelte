<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let props: ComponentProps<typeof DropdownMenu.Root> = $props();
</script>

<DropdownMenu.Root {...props} />
