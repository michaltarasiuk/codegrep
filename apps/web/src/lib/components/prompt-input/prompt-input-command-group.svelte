<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils/cn.js";

  let { class: className, ...restProps }: ComponentProps<typeof Command.Group> =
    $props();
</script>

<Command.Group class={cn(className)} {...restProps} />
