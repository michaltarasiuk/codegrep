<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    from,
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    from: "user" | "assistant" | "system";
  } = $props();
</script>

<div
  bind:this={ref}
  class={cn(
    "group flex w-full max-w-9/10 flex-col gap-2",
    from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
