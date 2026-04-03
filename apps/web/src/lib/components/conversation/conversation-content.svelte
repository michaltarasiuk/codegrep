<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { cn } from "$lib/utils/cn.js";
  import { StickToBottomContent } from "$lib/vendor/stick-to-bottom/index.js";

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
