import { untrack } from "svelte";

export interface StickToBottomState {
  scrollTop: number;
  lastScrollTop: number | null;
  ignoreScrollToTop: number | null;
  targetScrollTop: number;
  calculatedTargetScrollTop: number;
  scrollDifference: number;
  resizeDifference: number;

  animation: {
    behavior: "instant" | Required<SpringAnimation>;
    ignoreEscapes: boolean;
    promise: Promise<boolean>;
  } | null;
  lastTick: number | null;
  velocity: number;
  accumulated: number;

  escapedFromLock: boolean;
  isAtBottom: boolean;
  isNearBottom: boolean;

  resizeObserver: ResizeObserver | null;
}

let DEFAULT_SPRING_ANIMATION = {
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

let STICK_TO_BOTTOM_OFFSET_PX = 70;
let SIXTY_FPS_INTERVAL_MS = 1000 / 60;
let RETAIN_ANIMATION_DURATION_MS = 350;

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
  isAtBottom: boolean;
  isNearBottom: boolean;
  escapedFromLock: boolean;
  state: StickToBottomState;
}

// eslint-disable-next-line svelte/prefer-svelte-reactivity -- module-level cache, not reactive state
let animationCache = new Map<string, Required<SpringAnimation>>();

function mergeAnimations(...animations: (Animation | boolean | undefined)[]) {
  let result = { ...DEFAULT_SPRING_ANIMATION };
  let instant = false;

  for (let animation of animations) {
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

  let key = JSON.stringify(result);

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

  isAtBottom = $derived(this.#isAtBottom || this.#isNearBottom);
  isNearBottom = $derived(this.#isNearBottom);
  escapedFromLock = $derived(this.#escapedFromLock);

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

    let lastCalculation: {
      targetScrollTop: number;
      calculatedScrollTop: number;
    } | null = null;

    let getScrollEl = () => this.#scrollEl;
    let getContentEl = () => this.#contentEl;
    let getOptions = () => this.#options;

    this.#state = {
      escapedFromLock: this.#escapedFromLock,
      isAtBottom: this.#isAtBottom,
      lastScrollTop: null,
      ignoreScrollToTop: null,
      resizeDifference: 0,
      animation: null,
      lastTick: null,
      accumulated: 0,
      velocity: 0,
      resizeObserver: null,

      get scrollTop() {
        return getScrollEl()?.scrollTop ?? 0;
      },
      set scrollTop(scrollTop: number) {
        let el = getScrollEl();
        if (el) {
          el.scrollTop = scrollTop;
          this.ignoreScrollToTop = el.scrollTop;
        }
      },

      get targetScrollTop() {
        let scrollEl = getScrollEl();
        let contentEl = getContentEl();
        if (!scrollEl || !contentEl) {
          return 0;
        }
        return scrollEl.scrollHeight - 1 - scrollEl.clientHeight;
      },

      get calculatedTargetScrollTop() {
        let scrollEl = getScrollEl();
        let contentEl = getContentEl();
        if (!scrollEl || !contentEl) {
          return 0;
        }

        let { targetScrollTop } = this;
        let opts = getOptions();

        if (!opts.targetScrollTop) {
          return targetScrollTop;
        }

        if (lastCalculation?.targetScrollTop === targetScrollTop) {
          return lastCalculation.calculatedScrollTop;
        }

        let calculatedScrollTop = Math.max(
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
          lastCalculation = null;
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

    let selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return false;
    }

    let range = selection.getRangeAt(0);
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

    let waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0);
    let behavior = mergeAnimations(this.#options, scrollOptions.animation);
    let { ignoreEscapes = false } = scrollOptions;

    let durationElapsed: number;
    let startTarget = this.#state.calculatedTargetScrollTop;

    if (scrollOptions.duration instanceof Promise) {
      scrollOptions.duration.finally(() => {
        durationElapsed = Date.now();
      });
    } else {
      durationElapsed = waitElapsed + (scrollOptions.duration ?? 0);
    }

    let state = this.#state;

    let next = async (): Promise<boolean> => {
      let promise = new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      ).then(() => {
        if (!state.isAtBottom) {
          state.animation = null;
          return false;
        }

        let { scrollTop } = state;
        let tick = performance.now();
        let tickDelta =
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

        state.animation = null;

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
            state.lastTick = null;
            state.velocity = 0;
          }
        });

        return isAtBottom;
      });
    };

    if (scrollOptions.wait !== true) {
      state.animation = null;
    }

    if (state.animation?.behavior === behavior) {
      return state.animation.promise;
    }

    let resultPromise = next();
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

    let state = this.#state;
    let { scrollTop, ignoreScrollToTop } = state;
    let lastScrollTop = state.lastScrollTop ?? scrollTop;

    state.lastScrollTop = scrollTop;
    state.ignoreScrollToTop = null;

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

      let isScrollingDown = scrollTop > lastScrollTop;
      let isScrollingUp = scrollTop < lastScrollTop;

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
    let state = this.#state;
    state.resizeObserver?.disconnect();

    if (!el) {
      this.#contentEl = null;
      return;
    }

    this.#contentEl = el;

    let previousHeight: number | null = null;

    state.resizeObserver = new ResizeObserver((entries) => {
      let entry = entries[0];
      if (!entry) return;
      let { height } = entry.contentRect;
      let difference = height - (previousHeight ?? height);

      state.resizeDifference = difference;

      if (state.scrollTop > state.targetScrollTop) {
        state.scrollTop = state.targetScrollTop;
      }

      untrack(() => {
        this.#isNearBottom = state.isNearBottom;
      });

      if (difference >= 0) {
        let animation = mergeAnimations(
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
