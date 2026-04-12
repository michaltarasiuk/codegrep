<script lang="ts" module>
  let instanceCount = 0;
</script>

<script lang="ts">
  import {
    getOrCreateWorkerPoolSingleton,
    type SetupWorkerPoolProps,
    terminateWorkerPoolSingleton,
  } from "@pierre/diffs/worker";
  import type { Snippet } from "svelte";

  import { isDefined } from "$lib/utils/is-defined";

  import { setWorkerPool } from "./worker-pool.context.js";

  interface WorkerPoolContextProps extends SetupWorkerPoolProps {
    children: Snippet;
  }

  let { children, poolOptions, highlighterOptions }: WorkerPoolContextProps =
    $props();

  let poolManager = $derived(
    typeof window !== "undefined"
      ? getOrCreateWorkerPoolSingleton({
          poolOptions,
          highlighterOptions,
        })
      : null
  );

  $effect(function trackWorkerPoolInstance() {
    if (isDefined(poolManager)) {
      instanceCount++;
      return () => {
        instanceCount--;
      };
    }
  });

  $effect(function registerWorkerPoolTeardown() {
    return () => {
      if (instanceCount === 0) {
        terminateWorkerPoolSingleton();
      }
    };
  });

  setWorkerPool(() => poolManager);
</script>

{@render children()}
