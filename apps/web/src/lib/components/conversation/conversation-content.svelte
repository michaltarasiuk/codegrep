<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { StickToBottomContent } from "$lib/components/stick-to-bottom/index.js";
  import { cn } from "$lib/utils/cn.js";

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
