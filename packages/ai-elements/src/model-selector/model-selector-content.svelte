<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import * as Command from "@workspace/ui/command/index.js";
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import type { ComponentProps, Snippet } from "svelte";

  let {
    title = "Model Selector",
    children,
    class: className,
    ...restProps
  }: Omit<ComponentProps<typeof Dialog.Content>, "title"> & {
    title?: Snippet | string;
  } = $props();
</script>

<Dialog.Content
  aria-describedby={undefined}
  class={cn(
    "outline-border! border-none! p-0 outline! outline-solid!",
    className
  )}
  {...restProps}
>
  <Dialog.Title class="sr-only">
    {#if typeof title === "string"}
      {title}
    {:else}
      {@render title?.()}
    {/if}
  </Dialog.Title>
  <Command.Root class="**:data-[slot=command-input-wrapper]:h-auto">
    {@render children?.()}
  </Command.Root>
</Dialog.Content>
