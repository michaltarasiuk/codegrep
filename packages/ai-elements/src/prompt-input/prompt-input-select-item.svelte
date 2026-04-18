<script lang="ts">
  import * as Select from "@workspace/ui/select/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Select.Item> = $props();
</script>

<Select.Item {...props} />
