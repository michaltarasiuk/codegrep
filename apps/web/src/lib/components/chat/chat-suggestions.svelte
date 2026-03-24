<script lang="ts">
  import * as Suggestion from "../suggestion";
  import { SUGGESTIONS } from "./consts";

  let { onPick }: { onPick: (text: string) => void } = $props();
</script>

<Suggestion.Root>
  {#each SUGGESTIONS as suggestion (suggestion)}
    <Suggestion.Item {suggestion} {onPick} />
  {/each}
</Suggestion.Root>
