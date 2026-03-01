<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Command from "$lib/components/ui/command/index.js";
  let props: ComponentProps<typeof Command.List> = $props();
</script>

<Command.List {...props} />
