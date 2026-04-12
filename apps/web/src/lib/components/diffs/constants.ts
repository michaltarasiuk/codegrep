import type { CSSObject } from "@emotion/serialize";

export const GUTTER_UTILITY_SLOT_STYLES: CSSObject = {
  position: "absolute",
  top: 0,
  bottom: 0,
  textAlign: "center",
};

export function noopRender() {
  return null;
}
