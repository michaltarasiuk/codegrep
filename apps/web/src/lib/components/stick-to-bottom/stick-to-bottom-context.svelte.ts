import { getContext, setContext } from "svelte";

import type {
  GetTargetScrollTop,
  ScrollToBottom,
  StickToBottomState,
  StopScroll,
  UseStickToBottom,
} from "./use-stick-to-bottom.svelte.js";

export interface StickToBottomContext {
  scrollRef: (el: HTMLElement | null) => void;
  contentRef: (el: HTMLElement | null) => void;
  scrollToBottom: ScrollToBottom;
  stopScroll: StopScroll;
  readonly isAtBottom: boolean;
  readonly escapedFromLock: boolean;
  targetScrollTop: GetTargetScrollTop | null;
  state: StickToBottomState;
}

const CONTEXT_KEY = Symbol.for("stick-to-bottom");

export function setStickToBottom(
  getInstance: () => UseStickToBottom
): StickToBottomContext {
  let customTargetScrollTop: GetTargetScrollTop | null = $state(null);

  const context: StickToBottomContext = {
    get scrollRef() {
      return getInstance().scrollRef;
    },
    get contentRef() {
      return getInstance().contentRef;
    },
    get scrollToBottom() {
      return getInstance().scrollToBottom;
    },
    get stopScroll() {
      return getInstance().stopScroll;
    },
    get isAtBottom() {
      return getInstance().isAtBottom;
    },
    get escapedFromLock() {
      return getInstance().escapedFromLock;
    },
    get targetScrollTop() {
      return customTargetScrollTop;
    },
    set targetScrollTop(value: GetTargetScrollTop | null) {
      customTargetScrollTop = value;
    },
    get state() {
      return getInstance().state;
    },
  };

  setContext(CONTEXT_KEY, context);
  return context;
}

export function getStickToBottomContext(): StickToBottomContext {
  const context = getContext<StickToBottomContext | undefined>(CONTEXT_KEY);
  if (!context) {
    throw new Error("Missing stick to bottom context");
  }
  return context;
}
