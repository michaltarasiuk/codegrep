<script lang="ts">
  import { Streamdown, type StreamdownProps } from "svelte-streamdown";
  import Code from "svelte-streamdown/code";
  import Math from "svelte-streamdown/math";
  import Mermaid from "svelte-streamdown/mermaid";

  import { cn } from "$lib/utils/cn.js";

  let { class: className, ...props }: StreamdownProps = $props();
</script>

<Streamdown
  components={{ code: Code, math: Math, mermaid: Mermaid }}
  class={cn(
    "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
    className
  )}
  {...props}
/>
