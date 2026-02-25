<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof DropdownMenu.Item> = $props();
</script>

<DropdownMenu.Item class={cn(className)} {...restProps} />
