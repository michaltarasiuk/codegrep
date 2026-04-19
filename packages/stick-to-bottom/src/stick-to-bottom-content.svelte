<script lang="ts">
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { getStickToBottom } from "./stick-to-bottom-context.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children, ...restProps }: Props = $props();

  let contentEl = $state<HTMLElement | null>(null);

  let context = getStickToBottom();

  $effect(() => {
    untrack(() => context.contentRef(contentEl));
    return function unbindContent() {
      untrack(() => context.contentRef(null));
    };
  });
</script>

<div bind:this={contentEl} {...restProps}>
  {@render children()}
</div>
