import { isDefined } from "@workspace/shared/is-defined.js";
import type { LanguageModelUsage } from "ai";
import { getContext, setContext } from "svelte";

let CONTEXT_KEY = Symbol.for("scn-context");

type ModelId = string;

export interface ContextState {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
}

export function getUsagePanelState() {
  let context = getContext<ContextState | undefined>(CONTEXT_KEY);
  if (!isDefined(context)) {
    throw new Error("Missing model usage panel context");
  }
  return context;
}

export function setUsagePanelState(value: ContextState) {
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
