<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  let scrollShadowVariants = tv({
    defaultVariants: {
      hideScrollBar: false,
      orientation: "vertical",
      variant: "fade",
    },
    slots: {
      base: "scroll-shadow",
    },
    variants: {
      hideScrollBar: {
        false: {},
        true: {
          base: "scroll-shadow--hide-scrollbar",
        },
      },
      orientation: {
        horizontal: {
          base: "scroll-shadow--horizontal",
        },
        vertical: {
          base: "scroll-shadow--vertical",
        },
      },
      variant: {
        fade: {
          base: "scroll-shadow--fade",
        },
      },
    },
  });

  type ScrollShadowVariants = VariantProps<typeof scrollShadowVariants>;
</script>

<script lang="ts">
  import "./scroll-shadow.css";

  import { serializeStyles } from "@emotion/serialize";

  import { cn } from "../cn.js";
  import * as ScrollArea from "../scroll-area/index.js";
  import { useScrollShadow } from "./use-scroll-shadow.svelte.js";
  import {
    getScrollShadowViewportAttrs,
    type ScrollShadowVisibility,
  } from "./utils.js";

  interface ScrollShadowRootProps extends ScrollShadowVariants {
    ref?: HTMLElement | null;
    /**
     * The shadow size in pixels
     * @default 40
     */
    size?: number;
    /**
     * The scroll offset before showing shadows (in pixels)
     * @default 0
     */
    offset?: number;
    /**
     * Controlled shadow visibility state
     * @default "auto"
     */
    visibility?: ScrollShadowVisibility;
    /**
     * Whether scroll shadow detection is enabled
     * @default true
     */
    isEnabled?: boolean;
    /**
     * Custom classes for the horizontal scrollbar
     */
    scrollbarXClasses?: string;
    /**
     * Custom classes for the vertical scrollbar
     */
    scrollbarYClasses?: string;
    /**
     * Custom class name
     */
    class?: string;
    /**
     * Custom inline styles
     */
    style?: string;
    /**
     * Children snippet
     */
    children?: import("svelte").Snippet;
    /**
     * Callback invoked when shadow visibility changes
     */
    onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
  }

  let {
    ref = $bindable(null),
    size = 40,
    offset = 0,
    visibility = "auto",
    isEnabled = true,
    hideScrollBar = false,
    orientation = "vertical",
    variant = "fade",
    scrollbarXClasses = "",
    scrollbarYClasses = "",
    style,
    children,
    onVisibilityChange,
    class: className,
  }: ScrollShadowRootProps = $props();

  let viewportRef = $state<HTMLElement | null>(null);

  let { containerAction } = useScrollShadow(() => ({
    offset,
    visibility,
    isEnabled,
    orientation,
    onVisibilityChange,
  }));

  let slots = $derived.by(() =>
    scrollShadowVariants({
      hideScrollBar,
      orientation,
      variant,
    })
  );
  let viewportAttrs = $derived(
    getScrollShadowViewportAttrs(visibility, isEnabled)
  );

  $effect(() => {
    let el = viewportRef;
    if (!el) return;

    return containerAction(el).destroy;
  });
</script>

<ScrollArea.Root
  bind:ref
  bind:viewportRef
  {orientation}
  {scrollbarXClasses}
  {scrollbarYClasses}
  data-orientation={orientation}
  data-scroll-shadow-size={size}
  style={serializeStyles([
    {
      "--scroll-shadow-size": `${size}px`,
    },
    style,
  ]).styles}
  class={cn(slots.base(), className)}
  viewportProps={viewportAttrs}
>
  {@render children?.()}
</ScrollArea.Root>
