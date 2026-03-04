<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let props: ComponentProps<typeof Dialog.Trigger> = $props();
</script>

<Dialog.Trigger {...props} />
