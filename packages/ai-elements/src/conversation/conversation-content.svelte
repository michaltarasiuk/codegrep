<script lang="ts">
  import { StickToBottomContent } from "@workspace/stick-to-bottom/index.js";
  import { cn } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children, class: className, ...restProps }: Props = $props();
</script>

<StickToBottomContent
  class={cn("flex flex-1 flex-col gap-3 p-4", className)}
  {...restProps}
>
  {@render children()}
</StickToBottomContent>
