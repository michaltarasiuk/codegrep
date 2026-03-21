import type { LanguageModelUsage } from "ai";
import { getContext, setContext } from "svelte";

const CONTEXT_KEY = Symbol.for("scn-context");

type ModelId = string;

export interface ContextState {
  readonly usedTokens: number;
  readonly maxTokens: number;
  readonly usage?: LanguageModelUsage;
  readonly modelId?: ModelId;
}

export function getContextState(): ContextState {
  const value = getContext<ContextState | undefined>(CONTEXT_KEY);
  if (!value) {
    throw new Error("Context components must be used within Context");
  }
  return value;
}

export function setContextState(value: ContextState) {
  return setContext(CONTEXT_KEY, value);
}
