import type { LanguageModelUsage } from "ai";
import { getContext, setContext } from "svelte";

import { isDefined } from "$lib/utils/is-defined.js";

const CONTEXT_KEY = Symbol.for("scn-context");

type ModelId = string;

export interface ContextState {
  readonly usedTokens: number;
  readonly maxTokens: number;
  readonly usage?: LanguageModelUsage;
  readonly modelId?: ModelId;
}

export function getContextState(): ContextState {
  const value = getContext<ContextState | null>(CONTEXT_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing context context");
  }
  return value;
}

export function setContextState(value: ContextState) {
  return setContext(CONTEXT_KEY, value);
}

export const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  style: "percent",
});
