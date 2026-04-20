import { isDefined } from "@workspace/shared/is-defined.js";
import type { LanguageModelUsage } from "ai";
import { getContext, setContext } from "svelte";

const USAGE_PANEL_STATE_CONTEXT_KEY = Symbol.for("usage-panel-state");

type ModelId = string;

export interface ContextState {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
}

export function getUsagePanelState() {
  let value = getContext<ContextState | undefined>(
    USAGE_PANEL_STATE_CONTEXT_KEY
  );
  if (!isDefined(value)) {
    throw new Error("Missing usage panel state context value");
  }
  return value;
}

export function setUsagePanelState(value: ContextState) {
  return setContext(USAGE_PANEL_STATE_CONTEXT_KEY, value);
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
