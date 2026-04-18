<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as ScrollArea from "@workspace/ui/scroll-area/index.js";
  import type { ComponentProps } from "svelte";

  let {
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof ScrollArea.Root> = $props();
</script>

<ScrollArea.Root
  orientation="horizontal"
  scrollbarXClasses="hidden"
  class="w-full overflow-x-auto whitespace-nowrap"
  {...restProps}
>
  <div class={cn("flex w-max flex-nowrap items-center gap-2 py-2", className)}>
    {@render children?.()}
  </div>
</ScrollArea.Root>
