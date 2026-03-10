<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as Suggestion from "../suggestion";
  import { SUGGESTIONS } from "./consts";

  const {
    onpick,
  }: Pick<ComponentProps<typeof Suggestion.Item>, "onpick"> = $props();
</script>

<Suggestion.Root>
  {#each SUGGESTIONS as suggestion (suggestion)}
    <Suggestion.Item {suggestion} {onpick} />
  {/each}
</Suggestion.Root>
