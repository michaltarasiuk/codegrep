<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import { ScrollShadow } from "@workspace/ui/scroll-shadow/index.js";
  import type { ComponentProps } from "svelte";

  let {
    children,
    class: className,
    ...restProps
  }: Omit<
    ComponentProps<typeof ScrollShadow>,
    "orientation" | "hideScrollBar"
  > = $props();
</script>

<ScrollShadow
  orientation="horizontal"
  hideScrollBar
  class="w-full whitespace-nowrap"
  {...restProps}
>
  <div class={cn("flex w-max flex-nowrap items-center gap-2 py-2", className)}>
    {@render children?.()}
  </div>
</ScrollShadow>
