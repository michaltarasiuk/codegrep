<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Suggestion from "../suggestion";
  import { SUGGESTIONS } from "./consts";

  const props: Pick<
    ComponentProps<typeof Suggestion.Item>,
    "onpick"
  > = $props();
</script>

<Suggestion.Root>
  {#each SUGGESTIONS as suggestion (suggestion)}
    <Suggestion.Item {suggestion} {...props} />
  {/each}
</Suggestion.Root>
