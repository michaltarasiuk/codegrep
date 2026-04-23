import { isDefined } from "@workspace/shared/is-defined.js";
import { getContext, setContext } from "svelte";

import type { StickToBottomInstance } from "./use-stick-to-bottom.svelte.js";

const STICK_TO_BOTTOM_KEY = Symbol.for("stick-to-bottom");

export function getStickToBottom() {
  let value = getContext<StickToBottomInstance | undefined>(
    STICK_TO_BOTTOM_KEY
  );
  if (!isDefined(value)) {
    throw new Error("Missing stick to bottom context value");
  }
  return value;
}

export function setStickToBottom(value: StickToBottomInstance) {
  return setContext(STICK_TO_BOTTOM_KEY, value);
}
