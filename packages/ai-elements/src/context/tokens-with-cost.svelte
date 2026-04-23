<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";

  import { compactFormatter } from "./context-context.svelte.js";

  let {
    tokens,
    costText,
  }: {
    tokens?: number;
    costText?: string;
  } = $props();

  let formatted = $derived(
    isDefined(tokens) ? compactFormatter.format(tokens) : "—"
  );
</script>

<span>
  {formatted}
  {#if costText}
    <span class="text-muted-foreground ms-2">• {costText}</span>
  {/if}
</span>
