<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import { CollapsibleContent } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

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
  <div class="border-muted mt-4 space-y-2 border-s-2 ps-4">
    {@render children?.()}
  </div>
</CollapsibleContent>
