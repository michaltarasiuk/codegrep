<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils/cn.js";

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
