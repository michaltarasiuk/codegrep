<script lang="ts">
  import type { Snippet } from "svelte";
  import { onDestroy } from "svelte";

  let {
    text,
    resetMs = 2_000,
    children,
  }: {
    text: string;
    resetMs?: number;
    children: Snippet<[copy: () => void, copied: boolean]>;
  } = $props();

  let copied = $state(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function copy() {
    void (async () => {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          copied = false;
        }, resetMs);
      } catch {
        // Clipboard may be blocked or permission denied; leave UI unchanged
      }
    })();
  }

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });
</script>

{@render children(copy, copied)}
