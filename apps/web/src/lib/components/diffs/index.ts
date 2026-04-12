/*!---------------------------------------------------------------------------------------------
 * Portions derived from Pierre (https://github.com/pierrecomputer/pierre), packages/diffs.
 * Copyright 2025 Pierre Computer Company
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License at
 * https://github.com/pierrecomputer/pierre/blob/main/packages/diffs/LICENSE.md
 *
 * Svelte integration components in this directory build on the @pierre/diffs package.
 *--------------------------------------------------------------------------------------------*/

export { default as File } from "./file.svelte";
export { default as Virtualizer } from "./virtualizer.svelte";
export { default as WorkerPool } from "./worker-pool.svelte";

export { noopRender } from "./constants.js";
export type { FileProps } from "./types.js";

export { getWorkerPool, setWorkerPool } from "./worker-pool.context.js";
export {
  getOptionalVirtualizer,
  getVirtualizer,
  setVirtualizer,
} from "./virtualizer.context.js";

export { useFileInstance } from "./utils/use-file-instance.svelte.js";
