<script lang="ts">
  import * as InputGroup from "@workspace/ui/input-group/index.js";
  import * as Tooltip from "@workspace/ui/tooltip/index.js";
  import type { ComponentProps } from "svelte";

  type PromptInputButtonTooltip =
    | string
    | {
        content: string;
        shortcut?: string;
        side?: ComponentProps<typeof Tooltip.Content>["side"];
      };

  let {
    variant = "ghost",
    tooltip,
    children,
    ...restProps
  }: ComponentProps<typeof InputGroup.Button> & {
    tooltip?: PromptInputButtonTooltip;
  } = $props();
</script>

{#if !tooltip}
  <InputGroup.Button {variant} {...restProps}>
    {@render children?.()}
  </InputGroup.Button>
{:else}
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <InputGroup.Button {variant} {...props} {...restProps}>
          {@render children?.()}
        </InputGroup.Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content
      side={typeof tooltip === "string" ? "top" : (tooltip.side ?? "top")}
    >
      {typeof tooltip === "string" ? tooltip : tooltip.content}
      {#if typeof tooltip !== "string" && tooltip.shortcut}
        <span class="text-muted-foreground ms-2">{tooltip.shortcut}</span>
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>
{/if}
