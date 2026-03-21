<script lang="ts">
  import type { LanguageModelUsage } from "ai";
  import type { Snippet } from "svelte";

  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  import { setContextState } from "./context-context.svelte.js";

  interface ContextProps {
    usedTokens: number;
    maxTokens: number;
    usage?: LanguageModelUsage;
    modelId?: string;
    children?: Snippet;
  }

  let { usedTokens, maxTokens, usage, modelId, children }: ContextProps =
    $props();

  setContextState({
    get usedTokens() {
      return usedTokens;
    },
    get maxTokens() {
      return maxTokens;
    },
    get usage() {
      return usage;
    },
    get modelId() {
      return modelId;
    },
  });
</script>

<HoverCard.Root closeDelay={0} openDelay={0}>
  {@render children?.()}
</HoverCard.Root>
