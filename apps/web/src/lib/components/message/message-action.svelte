<script lang="ts">
  import { Button } from "@workspace/ui/button/index.js";
  import * as Tooltip from "@workspace/ui/tooltip/index.js";
  import type { ComponentProps } from "svelte";

  let {
    tooltip,
    label,
    variant = "ghost",
    size = "icon-sm",
    children,
    ...restProps
  }: ComponentProps<typeof Button> & {
    tooltip?: string;
    label?: string;
  } = $props();
</script>

{#if tooltip}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button type="button" {size} {variant} {...props} {...restProps}>
            {@render children?.()}
            <span class="sr-only">{label || tooltip}</span>
          </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <p>{tooltip}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{:else}
  <Button type="button" {size} {variant} {...restProps}>
    {@render children?.()}
    {#if label}
      <span class="sr-only">{label}</span>
    {/if}
  </Button>
{/if}
