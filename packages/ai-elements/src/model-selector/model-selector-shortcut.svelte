<script lang="ts">
  import * as Command from "@workspace/ui/command/index.js";
  import type { ComponentProps } from "svelte";

  let props: ComponentProps<typeof Command.Shortcut> = $props();
</script>

<Command.Shortcut {...props} />
