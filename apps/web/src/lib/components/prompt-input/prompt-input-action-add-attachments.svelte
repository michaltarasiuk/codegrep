<script lang="ts">
  import ImageIcon from "@lucide/svelte/icons/image";
  import type { ComponentProps } from "svelte";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  import { getPromptInputAttachments } from "./prompt-input-context.svelte.js";

  let {
    label = "Add photos or files",
    onSelect,
    ...restProps
  }: ComponentProps<typeof DropdownMenu.Item> & {
    label?: string;
  } = $props();

  let attachments = getPromptInputAttachments();

  function handleSelect(e: Event) {
    e.preventDefault();
    attachments.openFileDialog();
    onSelect?.(e);
  }
</script>

<DropdownMenu.Item onSelect={handleSelect} {...restProps}>
  <ImageIcon class="mr-2 size-4" />
  {label}
</DropdownMenu.Item>
