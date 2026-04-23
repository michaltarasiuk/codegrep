<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { getStickToBottom } from "./context.svelte.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: Snippet;
  }

  let { children, ...restProps }: Props = $props();

  const stickToBottom = getStickToBottom();
</script>

<div {...restProps} use:stickToBottom.contentAction>
  {#if children}
    {@render children()}
  {/if}
</div>
