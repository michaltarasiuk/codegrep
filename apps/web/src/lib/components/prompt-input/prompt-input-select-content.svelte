<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof Select.Content> = $props();
</script>

<Select.Content class={cn(className)} {...restProps} />
