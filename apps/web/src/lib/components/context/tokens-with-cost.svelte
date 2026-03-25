<script lang="ts">
  import { isDefined } from "$lib/utils/is-defined.js";

  import { compactFormatter } from "./context-context.svelte.js";

  let {
    tokens,
    costText,
  }: {
    tokens?: number;
    costText?: string;
  } = $props();

  const formatted = $derived(
    isDefined(tokens) ? compactFormatter.format(tokens) : "—"
  );
</script>

<span>
  {formatted}
  {#if costText}
    <span class="text-muted-foreground ml-2">• {costText}</span>
  {/if}
</span>
