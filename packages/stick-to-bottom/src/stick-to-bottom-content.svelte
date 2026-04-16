<script lang="ts">
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { getStickToBottomContext } from "./stick-to-bottom-context.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children, ...restProps }: Props = $props();

  const context = getStickToBottomContext();

  let contentEl = $state<HTMLElement | null>(null);

  $effect(function bindStickToBottomContentElement() {
    const el = contentEl;
    untrack(() => context.contentRef(el));
    return function unbindStickToBottomContentElement() {
      untrack(() => context.contentRef(null));
    };
  });
</script>

<div bind:this={contentEl} {...restProps}>
  {@render children()}
</div>
