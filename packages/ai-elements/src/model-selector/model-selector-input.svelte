<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as Command from "@workspace/ui/command/index.js";
  import type { ComponentProps } from "svelte";

  let { class: className, ...restProps }: ComponentProps<typeof Command.Input> =
    $props();
</script>

<Command.Input class={cn("h-auto py-3.5", className)} {...restProps} />
