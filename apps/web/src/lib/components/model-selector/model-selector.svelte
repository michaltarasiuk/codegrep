<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let {
    open = $bindable(false),
    ...restProps
  }: ComponentProps<typeof Dialog.Root> = $props();
</script>

<Dialog.Root {open} {...restProps} />
