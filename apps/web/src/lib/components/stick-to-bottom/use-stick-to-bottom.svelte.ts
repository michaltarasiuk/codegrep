/*!---------------------------------------------------------------------------------------------
 * Copyright (c) StackBlitz. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Ported from https://github.com/stackblitz-labs/use-stick-to-bottom to Svelte 5.
 *--------------------------------------------------------------------------------------------*/

import { untrack } from "svelte";

export interface StickToBottomState {
  scrollTop: number;
  lastScrollTop?: number;
  ignoreScrollToTop?: number;
  targetScrollTop: number;
  calculatedTargetScrollTop: number;
  scrollDifference: number;
  resizeDifference: number;

  animation?: {
    behavior: "instant" | Required<SpringAnimation>;
    ignoreEscapes: boolean;
    promise: Promise<boolean>;
  };
  lastTick?: number;
  velocity: number;
  accumulated: number;

  escapedFromLock: boolean;
  isAtBottom: boolean;
  isNearBottom: boolean;

  resizeObserver?: ResizeObserver;
}

const DEFAULT_SPRING_ANIMATION = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25,
} as const;

export type SpringAnimation = Partial<typeof DEFAULT_SPRING_ANIMATION>;

export type Animation = ScrollBehavior | SpringAnimation;

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
      wait?: boolean | number;
      ignoreEscapes?: boolean;
      preserveScrollPosition?: boolean;
      duration?: number | Promise<unknown>;
    };

export type ScrollToBottom = (
  scrollOptions?: ScrollToBottomOptions
) => Promise<boolean> | boolean;
export type StopScroll = () => void;

const STICK_TO_BOTTOM_OFFSET_PX = 70;
const SIXTY_FPS_INTERVAL_MS = 1000 / 60;
const RETAIN_ANIMATION_DURATION_MS = 350;

let mouseDown = false;

if (typeof globalThis.document !== "undefined") {
  globalThis.document.addEventListener("mousedown", () => {
    mouseDown = true;
  });
  globalThis.document.addEventListener("mouseup", () => {
    mouseDown = false;
  });
  globalThis.document.addEventListener("click", () => {
    mouseDown = false;
  });
}

export interface StickToBottomInstance {
  scrollRef: (el: HTMLElement | null) => void;
  contentRef: (el: HTMLElement | null) => void;
  scrollElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  scrollToBottom: ScrollToBottom;
  stopScroll: StopScroll;
  readonly isAtBottom: boolean;
  readonly isNearBottom: boolean;
  readonly escapedFromLock: boolean;
  state: StickToBottomState;
}

// eslint-disable-next-line svelte/prefer-svelte-reactivity -- module-level cache, not reactive state
const animationCache = new Map<string, Required<SpringAnimation>>();

function mergeAnimations(...animations: (Animation | boolean | undefined)[]) {
  const result = { ...DEFAULT_SPRING_ANIMATION };
  let instant = false;

  for (const animation of animations) {
    if (animation === "instant") {
      instant = true;
      continue;
    }

    if (typeof animation !== "object") {
      continue;
    }

    instant = false;

    result.damping = animation.damping ?? result.damping;
    result.stiffness = animation.stiffness ?? result.stiffness;
    result.mass = animation.mass ?? result.mass;
  }

  const key = JSON.stringify(result);

  if (!animationCache.has(key)) {
    animationCache.set(key, Object.freeze(result) as Required<SpringAnimation>);
  }

  return instant ? ("instant" as const) : animationCache.get(key)!;
}

export class UseStickToBottom {
  #getOptions: () => StickToBottomOptions;

  get #options() {
    return this.#getOptions();
  }

  #scrollEl = $state<HTMLElement | null>(null);
  #contentEl = $state<HTMLElement | null>(null);
  #escapedFromLock = $state(false);
  #isAtBottom = $state(true);
  #isNearBottom = $state(false);

  #state: StickToBottomState;

  readonly isAtBottom = $derived(this.#isAtBottom || this.#isNearBottom);
  readonly isNearBottom = $derived(this.#isNearBottom);
  readonly escapedFromLock = $derived(this.#escapedFromLock);

  get scrollElement() {
    return this.#scrollEl;
  }

  get contentElement() {
    return this.#contentEl;
  }

  get state() {
    return this.#state;
  }

  constructor(
    options: StickToBottomOptions | (() => StickToBottomOptions) = {}
  ) {
    this.#getOptions = typeof options === "function" ? options : () => options;
    this.#isAtBottom = this.#options.initial !== false;

    let lastCalculation:
      | { targetScrollTop: number; calculatedScrollTop: number }
      | undefined;

    const getScrollEl = () => this.#scrollEl;
    const getContentEl = () => this.#contentEl;
    const getOptions = () => this.#options;

    this.#state = {
      escapedFromLock: this.#escapedFromLock,
      isAtBottom: this.#isAtBottom,
      resizeDifference: 0,
      accumulated: 0,
      velocity: 0,

      get scrollTop() {
        return getScrollEl()?.scrollTop ?? 0;
      },
      set scrollTop(scrollTop: number) {
        const el = getScrollEl();
        if (el) {
          el.scrollTop = scrollTop;
          this.ignoreScrollToTop = el.scrollTop;
        }
      },

      get targetScrollTop() {
        const scrollEl = getScrollEl();
        const contentEl = getContentEl();
        if (!scrollEl || !contentEl) {
          return 0;
        }
        return scrollEl.scrollHeight - 1 - scrollEl.clientHeight;
      },

      get calculatedTargetScrollTop() {
        const scrollEl = getScrollEl();
        const contentEl = getContentEl();
        if (!scrollEl || !contentEl) {
          return 0;
        }

        const { targetScrollTop } = this;
        const opts = getOptions();

        if (!opts.targetScrollTop) {
          return targetScrollTop;
        }

        if (lastCalculation?.targetScrollTop === targetScrollTop) {
          return lastCalculation.calculatedScrollTop;
        }

        const calculatedScrollTop = Math.max(
          Math.min(
            opts.targetScrollTop(targetScrollTop, {
              scrollElement: scrollEl,
              contentElement: contentEl,
            }),
            targetScrollTop
          ),
          0
        );

        lastCalculation = { targetScrollTop, calculatedScrollTop };

        requestAnimationFrame(() => {
          lastCalculation = undefined;
        });

        return calculatedScrollTop;
      },

      get scrollDifference() {
        return this.calculatedTargetScrollTop - this.scrollTop;
      },

      get isNearBottom() {
        return this.scrollDifference <= STICK_TO_BOTTOM_OFFSET_PX;
      },
    } as StickToBottomState;
  }

  #setIsAtBottom = (value: boolean) => {
    this.#state.isAtBottom = value;
    this.#isAtBottom = value;
  };

  #setEscapedFromLock = (value: boolean) => {
    this.#state.escapedFromLock = value;
    this.#escapedFromLock = value;
  };

  #isSelecting = () => {
    if (!mouseDown) {
      return false;
    }

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return false;
    }

    const range = selection.getRangeAt(0);
    return (
      range.commonAncestorContainer.contains(this.#scrollEl) ||
      this.#scrollEl?.contains(range.commonAncestorContainer) === true
    );
  };

  scrollToBottom: ScrollToBottom = (scrollOptions = {}) => {
    if (typeof scrollOptions === "string") {
      scrollOptions = { animation: scrollOptions };
    }

    if (!scrollOptions.preserveScrollPosition) {
      this.#setIsAtBottom(true);
    }

    const waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0);
    const behavior = mergeAnimations(this.#options, scrollOptions.animation);
    const { ignoreEscapes = false } = scrollOptions;

    let durationElapsed: number;
    let startTarget = this.#state.calculatedTargetScrollTop;

    if (scrollOptions.duration instanceof Promise) {
      scrollOptions.duration.finally(() => {
        durationElapsed = Date.now();
      });
    } else {
      durationElapsed = waitElapsed + (scrollOptions.duration ?? 0);
    }

    const state = this.#state;

    const next = async (): Promise<boolean> => {
      const promise = new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      ).then(() => {
        if (!state.isAtBottom) {
          state.animation = undefined;
          return false;
        }

        const { scrollTop } = state;
        const tick = performance.now();
        const tickDelta =
          (tick - (state.lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS;
        state.animation ||= { behavior, promise: resultPromise, ignoreEscapes };

        if (state.animation.behavior === behavior) {
          state.lastTick = tick;
        }

        if (this.#isSelecting()) {
          return next();
        }

        if (waitElapsed > Date.now()) {
          return next();
        }

        if (
          scrollTop < Math.min(startTarget, state.calculatedTargetScrollTop)
        ) {
          if (state.animation?.behavior === behavior) {
            if (behavior === "instant") {
              state.scrollTop = state.calculatedTargetScrollTop;
              return next();
            }

            state.velocity =
              (behavior.damping * state.velocity +
                behavior.stiffness * state.scrollDifference) /
              behavior.mass;
            state.accumulated += state.velocity * tickDelta;
            state.scrollTop += state.accumulated;

            if (state.scrollTop !== scrollTop) {
              state.accumulated = 0;
            }
          }

          return next();
        }

        if (durationElapsed > Date.now()) {
          startTarget = state.calculatedTargetScrollTop;
          return next();
        }

        state.animation = undefined;

        if (state.scrollTop < state.calculatedTargetScrollTop) {
          return this.scrollToBottom({
            animation: mergeAnimations(this.#options, this.#options.resize),
            ignoreEscapes,
            duration: Math.max(0, durationElapsed - Date.now()) || undefined,
          });
        }

        return state.isAtBottom;
      });

      return promise.then((isAtBottom) => {
        requestAnimationFrame(() => {
          if (!state.animation) {
            state.lastTick = undefined;
            state.velocity = 0;
          }
        });

        return isAtBottom;
      });
    };

    if (scrollOptions.wait !== true) {
      state.animation = undefined;
    }

    if (state.animation?.behavior === behavior) {
      return state.animation.promise;
    }

    const resultPromise = next();
    return resultPromise;
  };

  stopScroll: StopScroll = () => {
    this.#setEscapedFromLock(true);
    this.#setIsAtBottom(false);
  };

  #handleScroll = ({ target }: Event) => {
    if (target !== this.#scrollEl) {
      return;
    }

    const state = this.#state;
    const { scrollTop, ignoreScrollToTop } = state;
    let { lastScrollTop = scrollTop } = state;

    state.lastScrollTop = scrollTop;
    state.ignoreScrollToTop = undefined;

    if (ignoreScrollToTop && ignoreScrollToTop > scrollTop) {
      lastScrollTop = ignoreScrollToTop;
    }

    this.#isNearBottom = state.isNearBottom;

    setTimeout(() => {
      if (state.resizeDifference || scrollTop === ignoreScrollToTop) {
        return;
      }

      if (this.#isSelecting()) {
        this.#setEscapedFromLock(true);
        this.#setIsAtBottom(false);
        return;
      }

      const isScrollingDown = scrollTop > lastScrollTop;
      const isScrollingUp = scrollTop < lastScrollTop;

      if (state.animation?.ignoreEscapes) {
        state.scrollTop = lastScrollTop;
        return;
      }

      if (isScrollingUp) {
        this.#setEscapedFromLock(true);
        this.#setIsAtBottom(false);
      }

      if (isScrollingDown) {
        this.#setEscapedFromLock(false);
      }

      if (!state.escapedFromLock && state.isNearBottom) {
        this.#setIsAtBottom(true);
      }
    }, 1);
  };

  #handleWheel = ({ target, deltaY }: WheelEvent) => {
    let element = target as HTMLElement;

    while (!["scroll", "auto"].includes(getComputedStyle(element).overflow)) {
      if (!element.parentElement) {
        return;
      }
      element = element.parentElement;
    }

    if (
      element === this.#scrollEl &&
      deltaY < 0 &&
      this.#scrollEl.scrollHeight > this.#scrollEl.clientHeight &&
      !this.#state.animation?.ignoreEscapes
    ) {
      this.#setEscapedFromLock(true);
      this.#setIsAtBottom(false);
    }
  };

  scrollRef = (el: HTMLElement | null) => {
    this.#scrollEl?.removeEventListener("scroll", this.#handleScroll);
    this.#scrollEl?.removeEventListener("wheel", this.#handleWheel);
    el?.addEventListener("scroll", this.#handleScroll, { passive: true });
    el?.addEventListener("wheel", this.#handleWheel, { passive: true });
    this.#scrollEl = el;
  };

  contentRef = (el: HTMLElement | null) => {
    const state = this.#state;
    state.resizeObserver?.disconnect();

    if (!el) {
      this.#contentEl = null;
      return;
    }

    this.#contentEl = el;

    let previousHeight: number | undefined;

    state.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { height } = entry.contentRect;
      const difference = height - (previousHeight ?? height);

      state.resizeDifference = difference;

      if (state.scrollTop > state.targetScrollTop) {
        state.scrollTop = state.targetScrollTop;
      }

      untrack(() => {
        this.#isNearBottom = state.isNearBottom;
      });

      if (difference >= 0) {
        const animation = mergeAnimations(
          this.#options,
          previousHeight ? this.#options.resize : this.#options.initial
        );

        this.scrollToBottom({
          animation,
          wait: true,
          preserveScrollPosition: true,
          duration:
            animation === "instant" ? undefined : RETAIN_ANIMATION_DURATION_MS,
        });
      } else {
        if (state.isNearBottom) {
          untrack(() => {
            this.#setEscapedFromLock(false);
            this.#setIsAtBottom(true);
          });
        }
      }

      previousHeight = height;

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (state.resizeDifference === difference) {
            state.resizeDifference = 0;
          }
        }, 1);
      });
    });

    state.resizeObserver.observe(el);
  };
}
