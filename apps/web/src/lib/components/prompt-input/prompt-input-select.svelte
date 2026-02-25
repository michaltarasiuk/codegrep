<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Select from "$lib/components/ui/select/index.js";

  let props: ComponentProps<typeof Select.Root> = $props();
</script>

<Select.Root {...props} />
