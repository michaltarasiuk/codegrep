<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { cn } from "../cn.js";
  import { Textarea } from "../textarea/index.js";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea
  bind:ref
  data-slot="input-group-control"
  class={cn(
    "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
    className
  )}
  bind:value
  {...restProps}
/>
