import { isDefined } from "@workspace/shared/is-defined.js";
import type { LanguageModelUsage } from "ai";
import { getContext, setContext } from "svelte";

let CONTEXT_KEY = Symbol.for("scn-context");

type ModelId = string;

export interface ContextState {
  readonly usedTokens: number;
  readonly maxTokens: number;
  readonly usage?: LanguageModelUsage;
  readonly modelId?: ModelId;
}

export function getContextState(): ContextState {
  let value = getContext<ContextState | null>(CONTEXT_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing context context");
  }
  return value;
}

export function setContextState(value: ContextState) {
  return setContext(CONTEXT_KEY, value);
}

export let compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

export let currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export let percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  style: "percent",
});
