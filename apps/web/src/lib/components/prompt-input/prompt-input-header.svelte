<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    align = "block-end",
    class: className,
    ...restProps
  }: ComponentProps<typeof InputGroup.Addon> = $props();
</script>

<InputGroup.Addon
  {align}
  class={cn("order-first flex-wrap gap-1", className)}
  {...restProps}
/>
