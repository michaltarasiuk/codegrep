<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { setStickToBottomContext } from "./stick-to-bottom-context.svelte.js";
  import {
    type GetTargetScrollTop,
    type StickToBottomOptions,
    UseStickToBottom,
  } from "./use-stick-to-bottom.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement>, StickToBottomOptions {
    children: Snippet;
    instance?: UseStickToBottom;
    targetScrollTop?: GetTargetScrollTop;
  }

  let {
    instance,
    children,
    resize,
    initial,
    mass,
    damping,
    stiffness,
    targetScrollTop: currentTargetScrollTop,
    ...restProps
  }: Props = $props();

  let defaultInstance = new UseStickToBottom(() => ({
    mass,
    damping,
    stiffness,
    resize,
    initial,
    targetScrollTop: (target, elements) => {
      let get = context?.targetScrollTop ?? currentTargetScrollTop;
      return get?.(target, elements) ?? target;
    },
  }));

  let scrollEl = $state<HTMLElement | null>(null);
  let active = $derived(instance ?? defaultInstance);

  let context = setStickToBottomContext(() => active);

  $effect(() => {
    if (isDefined(scrollEl)) {
      if (getComputedStyle(scrollEl).overflow === "visible") {
        scrollEl.style.overflow = "auto";
      }
    }
  });

  $effect(() => {
    untrack(() => active.scrollRef(scrollEl));
    return function unbindScroll() {
      untrack(() => active.scrollRef(null));
    };
  });
</script>

<div bind:this={scrollEl} {...restProps}>
  {@render children()}
</div>
