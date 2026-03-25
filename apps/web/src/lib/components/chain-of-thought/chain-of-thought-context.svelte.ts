import { getContext, setContext } from "svelte";

import { isDefined } from "$lib/utils/is-defined.js";

const CHAIN_OF_THOUGHT_KEY = Symbol.for("scn-chain-of-thought");

export interface ChainOfThoughtState {
  readonly open: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export function getChainOfThought(): ChainOfThoughtState {
  const value = getContext<ChainOfThoughtState | undefined>(
    CHAIN_OF_THOUGHT_KEY
  );
  if (!isDefined(value)) {
    throw new Error("Missing chain of thought context");
  }
  return value;
}

export function setChainOfThought(value: ChainOfThoughtState) {
  return setContext(CHAIN_OF_THOUGHT_KEY, value);
}
