<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import { Streamdown, type StreamdownProps } from "svelte-streamdown";
  import Code from "svelte-streamdown/code";
  import Math from "svelte-streamdown/math";
  import Mermaid from "svelte-streamdown/mermaid";

  let { class: className, ...props }: StreamdownProps = $props();
</script>

<Streamdown
  baseTheme="shadcn"
  components={{ code: Code, math: Math, mermaid: Mermaid }}
  class={cn(
    "size-full overflow-hidden [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
    className
  )}
  {...props}
/>
