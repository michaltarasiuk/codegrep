<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Collapsible } from "$lib/components/ui/collapsible/index.js";
  import { cn } from "$lib/utils/cn.js";

  const AUTO_CLOSE_DELAY = 1000;

  let {
    isStreaming = false,
    defaultOpen = isStreaming,
    open = $bindable(defaultOpen),
    class: className,
    ...restProps
  }: ComponentProps<typeof Collapsible> & {
    isStreaming?: boolean;
    defaultOpen?: boolean;
  } = $props();

  let hasAutoClosed = $state(false);

  $effect(() => {
    if (isStreaming && !open) {
      open = true;
    }
  });

  $effect(() => {
    if (!isStreaming && open && !hasAutoClosed) {
      const timer = setTimeout(() => {
        open = false;
        hasAutoClosed = true;
      }, AUTO_CLOSE_DELAY);

      return () => clearTimeout(timer);
    }
  });
</script>

<Collapsible bind:open class={cn("not-prose mb-4", className)} {...restProps} />
