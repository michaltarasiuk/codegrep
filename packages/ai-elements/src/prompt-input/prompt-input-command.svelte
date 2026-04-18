<script lang="ts">
  import * as Command from "@workspace/ui/command/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Command.Root> = $props();
</script>

<Command.Root {...props} />
