<script lang="ts">
  import type { ComponentProps } from "svelte";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  type PromptInputButtonTooltip =
    | string
    | {
        content: string;
        shortcut?: string;
        side?: ComponentProps<typeof Tooltip.Content>["side"];
      };

  let {
    variant = "ghost",
    size = "icon-sm",
    tooltip,
    children,
    ...restProps
  }: ComponentProps<typeof InputGroup.Button> & {
    tooltip?: PromptInputButtonTooltip;
  } = $props();
</script>

{#if !tooltip}
  <InputGroup.Button {variant} {size} {...restProps}>
    {@render children?.()}
  </InputGroup.Button>
{:else}
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <InputGroup.Button {variant} {size} {...props} {...restProps}>
          {@render children?.()}
        </InputGroup.Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content
      side={typeof tooltip === "string" ? "top" : (tooltip.side ?? "top")}
    >
      {typeof tooltip === "string" ? tooltip : tooltip.content}
      {#if typeof tooltip !== "string" && tooltip.shortcut}
        <span class="text-muted-foreground ml-2">{tooltip.shortcut}</span>
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>
{/if}
