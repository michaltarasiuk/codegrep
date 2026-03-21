<script lang="ts">
  let {
    tokens,
    costText,
  }: {
    tokens?: number;
    costText?: string;
  } = $props();

  const formatted = $derived(
    tokens === undefined
      ? "—"
      : new Intl.NumberFormat("en-US", { notation: "compact" }).format(tokens)
  );
</script>

<span>
  {formatted}
  {#if costText}
    <span class="ml-2 text-muted-foreground">• {costText}</span>
  {/if}
</span>
