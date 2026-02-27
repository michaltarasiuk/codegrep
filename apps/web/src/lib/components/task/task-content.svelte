<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { CollapsibleContent } from "$lib/components/ui/collapsible/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleContent> = $props();
</script>

<CollapsibleContent
  class={cn(
    "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
    className
  )}
  {...restProps}
>
  <div class="border-muted mt-4 space-y-2 border-l-2 pl-4">
    {@render children?.()}
  </div>
</CollapsibleContent>
