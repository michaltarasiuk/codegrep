import { isDefined } from "@workspace/shared/is-defined.js";
import { getContext, setContext } from "svelte";

let CHAIN_OF_THOUGHT_KEY = Symbol.for("scn-chain-of-thought");

export interface ChainOfThoughtState {
  open: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export function getChainOfThought() {
  let context = getContext<ChainOfThoughtState | undefined>(
    CHAIN_OF_THOUGHT_KEY
  );
  if (!isDefined(context)) {
    throw new Error("Missing chain of thought context");
  }
  return context;
}

export function setChainOfThought(value: ChainOfThoughtState) {
  return setContext(CHAIN_OF_THOUGHT_KEY, value);
}
