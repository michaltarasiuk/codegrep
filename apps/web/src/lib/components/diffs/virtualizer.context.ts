import type { Virtualizer } from "@pierre/diffs";
import { getContext, hasContext, setContext } from "svelte";

import { isDefined } from "$lib/utils/is-defined.js";

type ContextValue = () => Virtualizer | null;

const VIRTUALIZER_KEY = Symbol.for("scn-diffs-virtualizer");

export function getVirtualizer() {
  const value = getContext<ContextValue>(VIRTUALIZER_KEY)();
  if (!isDefined(value)) {
    throw new Error("Missing virtualizer context");
  }
  return value;
}

export function getOptionalVirtualizer(): Virtualizer | null {
  let value: ReturnType<ContextValue> = null;
  if (hasContext(VIRTUALIZER_KEY)) {
    value = getContext<ContextValue>(VIRTUALIZER_KEY)();
  }
  return value;
}

export function setVirtualizer(value: ContextValue) {
  return setContext(VIRTUALIZER_KEY, value);
}
