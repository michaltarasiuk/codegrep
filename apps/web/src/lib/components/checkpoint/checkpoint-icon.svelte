<script lang="ts">
  import BookmarkIcon from "@lucide/svelte/icons/bookmark";
  import type { ComponentProps, Snippet } from "svelte";

  import { cn } from "$lib/utils/cn.js";

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
