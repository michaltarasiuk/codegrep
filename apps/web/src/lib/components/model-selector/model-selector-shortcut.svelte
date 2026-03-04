<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Command from "$lib/components/ui/command/index.js";

  let props: ComponentProps<typeof Command.Shortcut> = $props();
</script>

<Command.Shortcut {...props} />
