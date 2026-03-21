<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  type CheckpointTriggerProps = ComponentProps<typeof Button> & {
    tooltip?: string;
  };

  let {
    children,
    variant = "ghost",
    size = "sm",
    tooltip,
    ...restProps
  }: CheckpointTriggerProps = $props();
</script>

{#if tooltip}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button
            type="button"
            data-slot="checkpoint-trigger"
            {size}
            {variant}
            {...props}
            {...restProps}
          >
            {@render children?.()}
          </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content align="start" side="bottom">
        {tooltip}
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{:else}
  <Button
    data-slot="checkpoint-trigger"
    {size}
    type="button"
    {variant}
    {...restProps}
  >
    {@render children?.()}
  </Button>
{/if}
