<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils/cn.js";

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
