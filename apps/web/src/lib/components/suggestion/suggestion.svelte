<script lang="ts">
  import { Button } from "@workspace/ui/button/index.js";
  import { cn } from "@workspace/ui/cn.js";
  import type { ComponentProps } from "svelte";

  let {
    suggestion,
    variant = "outline",
    size = "sm",
    onPick,
    children,
    class: className,
    ...restProps
  }: ComponentProps<typeof Button> & {
    suggestion: string;
    onPick?: (suggestion: string) => void;
  } = $props();
</script>

<Button
  type="button"
  {size}
  {variant}
  class={cn("cursor-pointer rounded-full px-4", className)}
  onclick={() => onPick?.(suggestion)}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {suggestion}
  {/if}
</Button>
