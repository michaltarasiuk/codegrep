<script lang="ts">
  import BookmarkIcon from "@lucide/svelte/icons/bookmark";
  import { cn } from "@workspace/ui/cn.js";
  import type { ComponentProps, Snippet } from "svelte";

  type CheckpointIconProps = ComponentProps<typeof BookmarkIcon> & {
    children?: Snippet;
  };

  let {
    children,
    class: className,
    ...restProps
  }: CheckpointIconProps = $props();
</script>

{#if children}
  {@render children()}
{:else}
  <BookmarkIcon
    data-slot="checkpoint-icon"
    class={cn("size-4 shrink-0", className)}
    {...restProps}
  />
{/if}
