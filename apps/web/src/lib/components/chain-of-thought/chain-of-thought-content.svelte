<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import {
    Collapsible,
    CollapsibleContent,
  } from "@workspace/ui/collapsible/index.js";
  import type { ComponentProps } from "svelte";

  import { getChainOfThought } from "./chain-of-thought-context.svelte.js";

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleContent> = $props();

  let context = getChainOfThought();
</script>

<Collapsible open={context.open}>
  <CollapsibleContent
    class={cn(
      "mt-2 space-y-3",
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
      className
    )}
    {...restProps}
  />
</Collapsible>
