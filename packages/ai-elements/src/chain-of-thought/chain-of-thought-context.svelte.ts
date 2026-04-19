import { isDefined } from "@workspace/shared/is-defined.js";
import { getContext, setContext } from "svelte";

let CHAIN_OF_THOUGHT_KEY = Symbol.for("chain-of-thought");

export interface ChainOfThoughtState {
  open: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export function getChainOfThought() {
  let value = getContext<ChainOfThoughtState | undefined>(CHAIN_OF_THOUGHT_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing chain of thought context value");
  }
  return value;
}

export function setChainOfThought(value: ChainOfThoughtState) {
  return setContext(CHAIN_OF_THOUGHT_KEY, value);
}
