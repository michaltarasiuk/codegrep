<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Select from "$lib/components/ui/select/index.js";

  let props: ComponentProps<typeof Select.Content> = $props();
</script>

<Select.Content {...props} />
