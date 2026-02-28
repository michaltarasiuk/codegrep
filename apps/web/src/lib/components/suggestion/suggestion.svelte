<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    suggestion,
    variant = "outline",
    size = "sm",
    onpick,
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof Button> & {
    suggestion: string;
    onpick?: (suggestion: string) => void;
  } = $props();
</script>

<Button
  type="button"
  {size}
  {variant}
  class={cn("cursor-pointer rounded-full px-4", className)}
  onclick={() => onpick?.(suggestion)}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {suggestion}
  {/if}
</Button>
