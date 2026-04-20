<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children, class: className, ...restProps }: Props = $props();
</script>

<div
  role="log"
  class={cn("relative flex-1 overflow-y-hidden", className)}
  {...restProps}
>
  {@render children()}
</div>
