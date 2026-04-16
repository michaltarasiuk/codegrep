export type ScrollShadowVisibility =
  | "auto"
  | "both"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "none";

export interface UseScrollShadowProps {
  orientation: "vertical" | "horizontal";
  offset: number;
  visibility: ScrollShadowVisibility;
  isEnabled: boolean;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

export function useScrollShadow(getProps: () => UseScrollShadowProps) {
  let containerEl = $state<HTMLElement | null>(null);

  // Cache previous state to avoid unnecessary DOM updates
  let prevState: {
    hasScrollBefore: boolean;
    hasScrollAfter: boolean;
  } | null = null;

  // Track pending RAF to avoid multiple scheduled updates
  let rafId: number | null = null;

  const checkOverflow = () => {
    const el = containerEl;
    if (!el) return;

    const { orientation, offset, onVisibilityChange } = getProps();
    const isVertical = orientation === "vertical";
    const scrollStart = isVertical ? el.scrollTop : el.scrollLeft;
    const scrollSize = isVertical ? el.scrollHeight : el.scrollWidth;
    const clientSize = isVertical ? el.clientHeight : el.clientWidth;

    const hasScrollBefore = scrollStart > offset;
    const hasScrollAfter = scrollStart + clientSize + offset < scrollSize;

    // Skip DOM updates if state hasn't changed
    if (
      prevState &&
      prevState.hasScrollBefore === hasScrollBefore &&
      prevState.hasScrollAfter === hasScrollAfter
    ) {
      return;
    }

    // Update state cache
    prevState = { hasScrollBefore, hasScrollAfter };

    // Cancel previous pending update
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    // Batch DOM updates with RAF for better performance
    rafId = requestAnimationFrame(() => {
      rafId = null;

      if (isVertical) {
        if (hasScrollBefore && hasScrollAfter) {
          el.dataset["topBottomScroll"] = "true";
          delete el.dataset["topScroll"];
          delete el.dataset["bottomScroll"];

          onVisibilityChange?.("both");
        } else {
          el.dataset["topScroll"] = String(hasScrollBefore);
          el.dataset["bottomScroll"] = String(hasScrollAfter);
          delete el.dataset["topBottomScroll"];

          if (onVisibilityChange) {
            if (hasScrollBefore) {
              onVisibilityChange("top");
            } else if (hasScrollAfter) {
              onVisibilityChange("bottom");
            } else {
              onVisibilityChange("none");
            }
          }
        }
      } else if (hasScrollBefore && hasScrollAfter) {
        el.dataset["leftRightScroll"] = "true";
        delete el.dataset["leftScroll"];
        delete el.dataset["rightScroll"];

        onVisibilityChange?.("both");
      } else {
        el.dataset["leftScroll"] = String(hasScrollBefore);
        el.dataset["rightScroll"] = String(hasScrollAfter);
        delete el.dataset["leftRightScroll"];

        if (onVisibilityChange) {
          if (hasScrollBefore) {
            onVisibilityChange("left");
          } else if (hasScrollAfter) {
            onVisibilityChange("right");
          } else {
            onVisibilityChange("none");
          }
        }
      }
    });
  };

  $effect(function observeOverflow() {
    const el = containerEl;
    const { visibility, isEnabled } = getProps();

    if (!el || !isEnabled || visibility !== "auto") {
      return;
    }

    // Initial check
    checkOverflow();

    // Use passive listener for better scroll performance
    el.addEventListener("scroll", checkOverflow, { passive: true });

    // Monitor size changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return function disconnectOverflow() {
      el.removeEventListener("scroll", checkOverflow);
      resizeObserver.disconnect();

      // Cancel pending RAF and cleanup cache
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      prevState = null;
    };
  });

  return {
    containerRef(node: HTMLElement) {
      containerEl = node;
      return {
        destroy() {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          prevState = null;
          containerEl = null;
        },
      };
    },
  };
}
