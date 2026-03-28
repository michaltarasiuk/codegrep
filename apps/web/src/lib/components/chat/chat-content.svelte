<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="relative mx-auto flex w-full max-w-3xl flex-1 flex-col">
  {@render children()}
</div>
