<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import { Collapsible } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

  let AUTO_CLOSE_DELAY = 1000;

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

  $effect(function openWhenStreaming() {
    if (isStreaming && !open) {
      open = true;
    }
  });

  $effect(function scheduleAutoClose() {
    if (!isStreaming && open && !hasAutoClosed) {
      let timer = setTimeout(() => {
        open = false;
        hasAutoClosed = true;
      }, AUTO_CLOSE_DELAY);

      return function clearAutoClose() {
        clearTimeout(timer);
      };
    }
  });
</script>

<Collapsible bind:open class={cn("not-prose mb-4", className)} {...restProps} />
