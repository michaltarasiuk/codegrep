<script lang="ts">
  import { type CSSObject, serializeStyles } from "@emotion/serialize";
  import {
    Virtualizer as VirtualizerClass,
    type VirtualizerConfig,
  } from "@pierre/diffs";
  import type { Snippet } from "svelte";

  import { isDefined } from "$lib/utils/is-defined";

  import { setVirtualizer } from "./virtualizer.context.js";

  interface VirtualizerProps {
    children: Snippet;
    config?: Partial<VirtualizerConfig>;
    className?: string;
    style?: CSSObject;
    contentClassName?: string;
    contentStyle?: CSSObject;
  }

  let {
    children,
    config,
    className,
    style,
    contentClassName,
    contentStyle,
  }: VirtualizerProps = $props();

  let root: HTMLDivElement | null = $state(null);
  let instance = $derived(
    typeof window !== "undefined" ? new VirtualizerClass(config) : null
  );

  $effect(function setupVirtualizer() {
    if (isDefined(root)) {
      instance?.setup(root);
      return () => {
        instance?.cleanUp();
      };
    }
  });

  setVirtualizer(() => instance);
</script>

<div bind:this={root} class={className} style={serializeStyles([style]).styles}>
  <div class={contentClassName} style={serializeStyles([contentStyle]).styles}>
    {children}
  </div>
</div>
