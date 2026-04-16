<script lang="ts">
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { setStickToBottom } from "./stick-to-bottom-context.svelte.js";
  import {
    type GetTargetScrollTop,
    type StickToBottomOptions,
    UseStickToBottom,
  } from "./use-stick-to-bottom.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement>, StickToBottomOptions {
    instance?: UseStickToBottom;
    children: Snippet;
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

  const defaultInstance = new UseStickToBottom(() => ({
    mass,
    damping,
    stiffness,
    resize,
    initial,
    targetScrollTop: (target, elements) => {
      const get = context?.targetScrollTop ?? currentTargetScrollTop;
      return get?.(target, elements) ?? target;
    },
  }));

  let active = $derived(instance ?? defaultInstance);
  const context = setStickToBottom(() => active);

  let scrollEl = $state<HTMLElement | null>(null);

  $effect(function ensureStickToBottomScrollOverflow() {
    if (scrollEl) {
      if (getComputedStyle(scrollEl).overflow === "visible") {
        scrollEl.style.overflow = "auto";
      }
    }
  });

  $effect(function bindStickToBottomScrollElement() {
    const el = scrollEl;
    const inst = active;
    untrack(() => inst.scrollRef(el));
    return function unbindStickToBottomScrollElement() {
      untrack(() => inst.scrollRef(null));
    };
  });
</script>

<div bind:this={scrollEl} {...restProps}>
  {@render children()}
</div>
