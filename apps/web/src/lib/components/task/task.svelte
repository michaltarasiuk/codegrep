<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Collapsible } from "$lib/components/ui/collapsible/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    defaultOpen = true,
    open = $bindable(defaultOpen),
    class: className,
    ...restProps
  }: ComponentProps<typeof Collapsible> & { defaultOpen?: boolean } = $props();
</script>

<Collapsible bind:open class={cn(className)} {...restProps} />
