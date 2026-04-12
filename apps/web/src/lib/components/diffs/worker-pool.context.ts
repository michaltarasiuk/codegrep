import type { WorkerPoolManager } from "@pierre/diffs/worker";
import { getContext, setContext } from "svelte";

import { isDefined } from "$lib/utils/is-defined.js";

type ContextValue = () => WorkerPoolManager | null;

const WORKER_POOL_KEY = Symbol.for("scn-diffs-worker-pool");

export function getWorkerPool() {
  const value = getContext<ContextValue>(WORKER_POOL_KEY)();
  if (!isDefined(value)) {
    return undefined;
  }
  return value;
}

export function setWorkerPool(value: ContextValue) {
  return setContext(WORKER_POOL_KEY, value);
}
