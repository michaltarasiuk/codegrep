<script lang="ts">
  import * as Select from "@workspace/ui/select/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Select.Root> = $props();
</script>

<Select.Root {...props} />
