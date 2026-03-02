<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Streamdown } from "svelte-streamdown";
  import Code from "svelte-streamdown/code";
  import Math from "svelte-streamdown/math";
  import Mermaid from "svelte-streamdown/mermaid";

  import { CollapsibleContent } from "$lib/components/ui/collapsible/index.js";
  import { cn } from "$lib/utils/cn.js";

  let {
    content = "",
    class: className,
    ...restProps
  }: ComponentProps<typeof CollapsibleContent> & {
    content?: string;
  } = $props();
</script>

<CollapsibleContent
  class={cn(
    "mt-4 text-sm",
    "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
    className
  )}
  {...restProps}
>
  <Streamdown
    baseTheme="shadcn"
    components={{ code: Code, math: Math, mermaid: Mermaid }}
    class="size-full overflow-hidden [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
    {content}
  />
</CollapsibleContent>
