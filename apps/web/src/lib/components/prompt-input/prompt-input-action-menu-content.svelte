<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    align = "start",
    class: className,
    ...restProps
  }: ComponentProps<typeof DropdownMenu.Content> = $props();
</script>

<DropdownMenu.Content {align} class={cn(className)} {...restProps} />
