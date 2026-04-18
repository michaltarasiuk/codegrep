<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as Select from "@workspace/ui/select/index.js";
  import type { ComponentProps } from "svelte";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof Select.Trigger> = $props();
</script>

<Select.Trigger
  class={cn(
    "text-muted-foreground border-none bg-transparent font-medium shadow-none transition-colors",
    "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
    className
  )}
  {...restProps}
/>
