<script lang="ts">
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Dialog.Trigger> = $props();
</script>

<Dialog.Trigger {...props} />
