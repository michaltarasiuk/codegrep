/*!---------------------------------------------------------------------------------------------
 * Copyright (c) StackBlitz. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Ported from https://github.com/stackblitz-labs/use-stick-to-bottom to Svelte 5.
 *--------------------------------------------------------------------------------------------*/

export { default as StickToBottom } from "./stick-to-bottom.svelte";
export { default as StickToBottomContent } from "./stick-to-bottom-content.svelte";
export {
  getStickToBottomContext,
  setStickToBottom,
  type StickToBottomContext,
} from "./stick-to-bottom-context.svelte.js";
export {
  type Animation,
  type GetTargetScrollTop,
  type ScrollElements,
  type ScrollToBottom,
  type ScrollToBottomOptions,
  type SpringAnimation,
  type StickToBottomInstance,
  type StickToBottomOptions,
  type StickToBottomState,
  type StopScroll,
  UseStickToBottom,
} from "./use-stick-to-bottom.svelte.js";
