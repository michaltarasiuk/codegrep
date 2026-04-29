export type ScrollShadowVisibility = "auto" | "both" | "start" | "end" | "none";

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

  let checkOverflow = () => {
    let el = containerEl;
    if (!el) return;

    let { orientation, offset, onVisibilityChange } = getProps();
    let isVertical = orientation === "vertical";
    let scrollStart = isVertical ? el.scrollTop : el.scrollLeft;
    let scrollSize = isVertical ? el.scrollHeight : el.scrollWidth;
    let clientSize = isVertical ? el.clientHeight : el.clientWidth;

    let hasScrollBefore = scrollStart > offset;
    let hasScrollAfter = scrollStart + clientSize + offset < scrollSize;

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

      if (hasScrollBefore && hasScrollAfter) {
        el.dataset["startEndScroll"] = "true";
        delete el.dataset["startScroll"];
        delete el.dataset["endScroll"];

        onVisibilityChange?.("both");
      } else {
        el.dataset["startScroll"] = String(hasScrollBefore);
        el.dataset["endScroll"] = String(hasScrollAfter);
        delete el.dataset["startEndScroll"];

        if (onVisibilityChange) {
          if (hasScrollBefore) {
            onVisibilityChange("start");
          } else if (hasScrollAfter) {
            onVisibilityChange("end");
          } else {
            onVisibilityChange("none");
          }
        }
      }
    });
  };

  $effect(() => {
    let el = containerEl;
    let { visibility, isEnabled } = getProps();

    if (!el || !isEnabled || visibility !== "auto") {
      return;
    }

    // Initial check
    checkOverflow();

    // Use passive listener for better scroll performance
    el.addEventListener("scroll", checkOverflow, { passive: true });

    // Monitor size changes
    let resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => {
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
    containerAction(node: HTMLElement) {
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
