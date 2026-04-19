<script lang="ts">
  import { getUsagePanelState } from "./context-context.svelte.js";

  let ICON_RADIUS = 10;
  let ICON_VIEWBOX = 24;
  let ICON_CENTER = 12;
  let ICON_STROKE_WIDTH = 2;
  let circumference = 2 * Math.PI * ICON_RADIUS;

  let context = getUsagePanelState();

  let usedPercent = $derived(context.usedTokens / context.maxTokens);
  let dashOffset = $derived(circumference * (1 - usedPercent));
</script>

<svg
  aria-label="Model context usage"
  height="20"
  role="img"
  style:color="currentcolor"
  viewBox="0 0 {ICON_VIEWBOX} {ICON_VIEWBOX}"
  width="20"
>
  <circle
    cx={ICON_CENTER}
    cy={ICON_CENTER}
    fill="none"
    opacity="0.25"
    r={ICON_RADIUS}
    stroke="currentColor"
    stroke-width={ICON_STROKE_WIDTH}
  />
  <circle
    cx={ICON_CENTER}
    cy={ICON_CENTER}
    fill="none"
    opacity="0.7"
    r={ICON_RADIUS}
    stroke="currentColor"
    stroke-dasharray="{circumference} {circumference}"
    stroke-dashoffset={dashOffset}
    stroke-linecap="round"
    stroke-width={ICON_STROKE_WIDTH}
    style:transform="rotate(-90deg)"
    style:transform-origin="center"
  />
</svg>
