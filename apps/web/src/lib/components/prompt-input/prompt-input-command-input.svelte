<script lang="ts">
  import * as Command from "@workspace/ui/command/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Command.Input> = $props();
</script>

<Command.Input {...props} />
