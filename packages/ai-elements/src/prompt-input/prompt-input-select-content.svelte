<script lang="ts">
  import * as Select from "@workspace/ui/select/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Select.Content> = $props();
</script>

<Select.Content {...props} />
