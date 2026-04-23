import { isDefined } from "@workspace/shared/is-defined.js";
import type { Action } from "svelte/action";

import {
  type Animation,
  mergeAnimations,
  type SpringAnimation,
} from "./utils.js";

export interface ScrollElements {
  scrollElement: HTMLElement;
  contentElement: HTMLElement;
}

export type GetTargetScrollTop = (
  targetScrollTop: number,
  context: ScrollElements
) => number;

export interface StickToBottomOptions extends SpringAnimation {
  resize?: Animation;
  initial?: Animation | boolean;
  targetScrollTop?: GetTargetScrollTop;
}

export type ScrollToBottomOptions =
  | ScrollBehavior
  | {
      animation?: Animation;

      /**
       * Whether to wait for any existing scrolls to finish before
       * performing this one. Or if a millisecond is passed,
       * it will wait for that duration before performing the scroll.
       *
       * @default false
       */
      wait?: boolean | number;

      /**
       * Whether to prevent the user from escaping the scroll,
       * by scrolling up with their mouse.
       *
       * @default false
       */
      ignoreEscapes?: boolean;

      /**
       * Only scroll to the bottom if we're already at the bottom.
       *
       * @default false
       */
      preserveScrollPosition?: boolean;

      /**
       * The extra duration in ms that this scroll event should persist for.
       * (in addition to the time that it takes to get to the bottom)
       *
       * Not to be confused with the duration of the animation -
       * for that you should adjust the animation option.
       *
       * @default 0
       */
      duration?: number | Promise<void>;
    };

interface AnimationState {
  behavior: "instant" | Required<SpringAnimation>;
  ignoreEscapes: boolean;
  promise: Promise<boolean>;
}

const STICK_TO_BOTTOM_OFFSET_PX = 70;
const SIXTY_FPS_INTERVAL_MS = 1000 / 60;
const RETAIN_ANIMATION_DURATION_MS = 350;

export function useStickToBottom(
  getOptions: () => StickToBottomOptions = () => ({})
) {
  let hasEscapedLock = $state(false);
  let isAtBottom = $state(getOptions().initial !== false);
  let isNearBottom = $state(false);

  let scrollElement: HTMLElement | null = null;
  let contentElement: HTMLElement | null = null;

  let isMouseDown = false;

  let animation: AnimationState | null = null;
  let lastTick: number | null = null;
  let velocity = 0;
  let accumulated = 0;

  let resizeDifference = 0;
  let lastScrollTop: number | null = null;
  let ignoreScrollToTop: number | null = null;
  let lastCalculation: {
    targetScrollTop: number;
    calculatedScrollTop: number;
  } | null = null;

  $effect(() => {
    function handleMouseDown() {
      isMouseDown = true;
    }
    function handleMouseUp() {
      isMouseDown = false;
    }
    function handleClick() {
      isMouseDown = false;
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  });

  function getScrollTop() {
    return scrollElement?.scrollTop ?? 0;
  }

  function setScrollTop(value: number) {
    if (isDefined(scrollElement)) {
      scrollElement.scrollTop = value;
      ignoreScrollToTop = scrollElement.scrollTop;
    }
  }

  function getTargetScrollTop() {
    if (!isDefined(scrollElement) || !isDefined(contentElement)) {
      return 0;
    }
    return scrollElement.scrollHeight - 1 - scrollElement.clientHeight;
  }

  function getCalculatedTargetScrollTop() {
    if (!isDefined(scrollElement) || !isDefined(contentElement)) {
      return 0;
    }

    const options = getOptions();
    const target = getTargetScrollTop();

    if (!isDefined(options.targetScrollTop)) {
      return target;
    }

    if (lastCalculation?.targetScrollTop === target) {
      return lastCalculation.calculatedScrollTop;
    }

    const calculatedScrollTop = Math.max(
      Math.min(
        options.targetScrollTop(target, {
          scrollElement,
          contentElement,
        }),
        target
      ),
      0
    );

    lastCalculation = { targetScrollTop: target, calculatedScrollTop };

    requestAnimationFrame(() => {
      lastCalculation = null;
    });

    return calculatedScrollTop;
  }

  function getScrollDifference() {
    return getCalculatedTargetScrollTop() - getScrollTop();
  }

  function getIsNearBottom() {
    return getScrollDifference() <= STICK_TO_BOTTOM_OFFSET_PX;
  }

  function isSelecting() {
    if (!isMouseDown) {
      return false;
    }

    const selection = window.getSelection();
    if (!isDefined(selection) || !selection.rangeCount) {
      return false;
    }

    const range = selection.getRangeAt(0);
    return (
      range.commonAncestorContainer.contains(scrollElement) ||
      scrollElement?.contains(range.commonAncestorContainer) ||
      false
    );
  }

  function scrollToBottom(scrollOptions: ScrollToBottomOptions = {}) {
    if (typeof scrollOptions === "string") {
      scrollOptions = { animation: scrollOptions };
    }

    if (!scrollOptions.preserveScrollPosition) {
      isAtBottom = true;
    }

    const options = getOptions();
    const waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0);
    const behavior = mergeAnimations(options, scrollOptions.animation);
    const { ignoreEscapes = false } = scrollOptions;

    let durationElapsed: number;
    let startTarget = getCalculatedTargetScrollTop();

    if (scrollOptions.duration instanceof Promise) {
      scrollOptions.duration.finally(() => {
        durationElapsed = Date.now();
      });
    } else {
      durationElapsed = waitElapsed + (scrollOptions.duration ?? 0);
    }

    async function next() {
      const promise = new Promise<boolean>((resolve) => {
        requestAnimationFrame(() => {
          if (!isAtBottom) {
            animation = null;
            resolve(false);
            return;
          }

          const scrollTop = getScrollTop();
          const tick = performance.now();
          const tickDelta = (tick - (lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS;

          if (!isDefined(animation)) {
            animation = { behavior, promise: next(), ignoreEscapes };
          }

          if (animation.behavior === behavior) {
            lastTick = tick;
          }

          if (isSelecting()) {
            resolve(next());
            return;
          }

          if (waitElapsed > Date.now()) {
            resolve(next());
            return;
          }

          const calculatedTarget = getCalculatedTargetScrollTop();
          if (scrollTop < Math.min(startTarget, calculatedTarget)) {
            if (animation?.behavior === behavior) {
              if (behavior === "instant") {
                setScrollTop(calculatedTarget);
                resolve(next());
                return;
              }

              velocity =
                (behavior.damping * velocity +
                  behavior.stiffness * getScrollDifference()) /
                behavior.mass;
              accumulated += velocity * tickDelta;
              const newScrollTop = scrollTop + accumulated;
              setScrollTop(newScrollTop);

              if (getScrollTop() !== scrollTop) {
                accumulated = 0;
              }
            }

            resolve(next());
            return;
          }

          if (durationElapsed > Date.now()) {
            startTarget = calculatedTarget;
            resolve(next());
            return;
          }

          animation = null;

          /**
           * If we're still below the target, then queue
           * up another scroll to the bottom with the last
           * requested animation.
           */
          if (getScrollTop() < getCalculatedTargetScrollTop()) {
            const result = scrollToBottom({
              animation: mergeAnimations(options, options.resize),
              ignoreEscapes,
              duration: Math.max(0, durationElapsed - Date.now()) || undefined,
            });
            resolve(result as unknown as boolean);
            return;
          }

          resolve(isAtBottom);
        });
      });

      return promise.then((result) => {
        requestAnimationFrame(() => {
          if (!isDefined(animation)) {
            lastTick = null;
            velocity = 0;
          }
        });

        return result;
      });
    }

    if (scrollOptions.wait !== true) {
      animation = null;
    }

    if (animation?.behavior === behavior) {
      return animation.promise;
    }

    return next();
  }

  function stopScroll() {
    hasEscapedLock = true;
    isAtBottom = false;
  }

  function handleScroll(event: Event) {
    if (event.target !== scrollElement) {
      return;
    }

    const scrollTop = getScrollTop();
    const currentIgnoreScrollToTop = ignoreScrollToTop;
    let currentLastScrollTop = lastScrollTop ?? scrollTop;

    lastScrollTop = scrollTop;
    ignoreScrollToTop = null;

    if (
      isDefined(currentIgnoreScrollToTop) &&
      currentIgnoreScrollToTop > scrollTop
    ) {
      /**
       * When the user scrolls up while the animation plays, the `scrollTop` may
       * not come in separate events; if this happens, to make sure `isScrollingUp`
       * is correct, set the lastScrollTop to the ignored event.
       */
      currentLastScrollTop = currentIgnoreScrollToTop;
    }

    isNearBottom = getIsNearBottom();

    /**
     * Scroll events may come before a ResizeObserver event,
     * so in order to ignore resize events correctly we use a
     * timeout.
     *
     * @see https://github.com/WICG/resize-observer/issues/25#issuecomment-248757228
     */
    setTimeout(() => {
      /**
       * When theres a resize difference ignore the resize event.
       */
      if (resizeDifference || scrollTop === currentIgnoreScrollToTop) {
        return;
      }

      if (isSelecting()) {
        hasEscapedLock = true;
        isAtBottom = false;
        return;
      }

      const isScrollingDown = scrollTop > currentLastScrollTop;
      const isScrollingUp = scrollTop < currentLastScrollTop;

      if (animation?.ignoreEscapes) {
        setScrollTop(currentLastScrollTop);
        return;
      }

      if (isScrollingUp) {
        hasEscapedLock = true;
        isAtBottom = false;
      }

      if (isScrollingDown) {
        hasEscapedLock = false;
      }

      if (!hasEscapedLock && getIsNearBottom()) {
        isAtBottom = true;
      }
    }, 1);
  }

  function handleWheel(event: WheelEvent) {
    let element = event.target as HTMLElement;

    while (!["scroll", "auto"].includes(getComputedStyle(element).overflow)) {
      if (!isDefined(element.parentElement)) {
        return;
      }
      element = element.parentElement;
    }

    /**
     * The browser may cancel the scrolling from the mouse wheel
     * if we update it from the animation in meantime.
     * To prevent this, always escape when the wheel is scrolled up.
     */
    if (
      element === scrollElement &&
      event.deltaY < 0 &&
      scrollElement.scrollHeight > scrollElement.clientHeight &&
      !animation?.ignoreEscapes
    ) {
      hasEscapedLock = true;
      isAtBottom = false;
    }
  }

  const scrollAction: Action<HTMLElement> = (node) => {
    scrollElement = node;

    if (getComputedStyle(node).overflow === "visible") {
      node.style.overflow = "auto";
    }

    node.addEventListener("scroll", handleScroll, { passive: true });
    node.addEventListener("wheel", handleWheel, { passive: true });

    return {
      destroy() {
        node.removeEventListener("scroll", handleScroll);
        node.removeEventListener("wheel", handleWheel);
        scrollElement = null;
      },
    };
  };

  const contentAction: Action<HTMLElement> = (node) => {
    contentElement = node;
    let previousHeight: number | null = null;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!isDefined(entry)) {
        return;
      }
      const { height } = entry.contentRect;
      const difference = height - (previousHeight ?? height);

      resizeDifference = difference;

      /**
       * Sometimes the browser can overscroll past the target,
       * so check for this and adjust appropriately.
       */
      const targetScroll = getTargetScrollTop();
      if (getScrollTop() > targetScroll) {
        setScrollTop(targetScroll);
      }

      isNearBottom = getIsNearBottom();

      if (difference >= 0) {
        /**
         * If it's a positive resize, scroll to the bottom when
         * we're already at the bottom.
         */
        const options = getOptions();
        const animationType = mergeAnimations(
          options,
          isDefined(previousHeight) ? options.resize : options.initial
        );

        scrollToBottom({
          animation: animationType,
          wait: true,
          preserveScrollPosition: true,
          duration:
            animationType === "instant"
              ? undefined
              : RETAIN_ANIMATION_DURATION_MS,
        });
      } else {
        /**
         * Else if it's a negative resize, check if we're near the bottom
         * if we are want to un-escape from the lock, because the resize
         * could have caused the container to be at the bottom.
         */
        if (getIsNearBottom()) {
          hasEscapedLock = false;
          isAtBottom = true;
        }
      }

      previousHeight = height;

      /**
       * Reset the resize difference after the scroll event
       * has fired. Requires a rAF to wait for the scroll event,
       * and a setTimeout to wait for the other timeout we have in
       * resizeObserver in case the scroll event happens after the
       * resize event.
       */
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (resizeDifference === difference) {
            resizeDifference = 0;
          }
        }, 1);
      });
    });

    resizeObserver.observe(node);

    return {
      destroy() {
        resizeObserver.disconnect();
        contentElement = null;
      },
    };
  };

  return {
    get isAtBottom() {
      return isAtBottom || isNearBottom;
    },
    get isNearBottom() {
      return isNearBottom;
    },
    get hasEscapedLock() {
      return hasEscapedLock;
    },
    scrollAction,
    contentAction,
    scrollToBottom,
    stopScroll,
  };
}

export type StickToBottomInstance = ReturnType<typeof useStickToBottom>;
