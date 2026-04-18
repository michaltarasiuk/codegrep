<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as InputGroup from "@workspace/ui/input-group/index.js";
  import type { ComponentProps } from "svelte";

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
