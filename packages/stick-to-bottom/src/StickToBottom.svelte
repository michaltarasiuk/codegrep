<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { setStickToBottom } from "./context.svelte.js";
  import type {
    StickToBottomInstance,
    StickToBottomOptions,
  } from "./use-stick-to-bottom.svelte.js";
  import { useStickToBottom } from "./use-stick-to-bottom.svelte.js";

  export interface StickToBottomProps
    extends
      Omit<HTMLAttributes<HTMLDivElement>, "children">,
      StickToBottomOptions {
    children?: Snippet<[StickToBottomInstance]>;
    contentClass?: string;
  }

  let {
    children,
    resize,
    initial,
    mass,
    damping,
    stiffness,
    targetScrollTop,
    ...restProps
  }: StickToBottomProps = $props();

  const stickToBottom = useStickToBottom(() => ({
    resize,
    initial,
    mass,
    damping,
    stiffness,
    targetScrollTop,
  }));

  setStickToBottom(stickToBottom);
</script>

<div use:stickToBottom.scrollAction {...restProps}>
  {#if children}
    {@render children(stickToBottom)}
  {/if}
</div>
