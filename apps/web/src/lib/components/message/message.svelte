<script lang="ts">
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import type { HTMLAttributes } from "svelte/elements";

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
