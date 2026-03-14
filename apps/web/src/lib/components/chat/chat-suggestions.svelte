<script lang="ts">
  import * as Suggestion from "../suggestion";
  import { SUGGESTIONS } from "./consts";

  let { onpick }: { onpick: (text: string) => void } = $props();
</script>

<Suggestion.Root>
  {#each SUGGESTIONS as suggestion (suggestion)}
    <Suggestion.Item {suggestion} {onpick} />
  {/each}
</Suggestion.Root>
