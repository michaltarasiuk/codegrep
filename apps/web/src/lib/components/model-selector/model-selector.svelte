<script lang="ts">
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import type { ComponentProps } from "svelte";

  let {
    open = $bindable(false),
    ...restProps
  }: ComponentProps<typeof Dialog.Root> = $props();
</script>

<Dialog.Root {open} {...restProps} />
