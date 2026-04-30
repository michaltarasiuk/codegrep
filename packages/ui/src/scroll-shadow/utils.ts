import { assertNever } from "@workspace/shared/assert-never.js";

export type ScrollShadowVisibility = "auto" | "both" | "start" | "end" | "none";

const SCROLL_DATASET_KEYS = [
  "startScroll",
  "endScroll",
  "startEndScroll",
] as const;

/** Removes scroll-shadow mask keys written imperatively during overflow measurement. */
export function clearScrollDataset(el: HTMLElement) {
  for (let key of SCROLL_DATASET_KEYS) delete el.dataset[key];
}

/**
 * Static viewport `data-*` for SSR / first paint and controlled visibility.
 *
 * For `"auto"`, returns a forward-overflow hint (`data-end-scroll`) so the mask
 * is correct on first paint before `useScrollShadow` measures real overflow.
 * Once mounted, the hook overrides these with measured values.
 */
export function getScrollShadowViewportAttrs(
  visibility: ScrollShadowVisibility,
  isEnabled: boolean
): Record<string, string> {
  if (!isEnabled) return {};
  switch (visibility) {
    case "none":
      return {};
    case "auto":
    case "end":
      return { "data-end-scroll": "true" };
    case "start":
      return { "data-start-scroll": "true" };
    case "both":
      return { "data-start-end-scroll": "true" };
    default:
      assertNever(visibility);
  }
}
