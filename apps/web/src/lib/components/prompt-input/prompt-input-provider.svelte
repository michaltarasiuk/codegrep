<script lang="ts">
  import type { Snippet } from "svelte";
  import { onDestroy, untrack } from "svelte";

  import {
    PromptInputControllerState,
    setPromptInputController,
    setProviderAttachments,
  } from "./prompt-input-context.svelte.js";

  let {
    initialInput = "",
    children,
  }: {
    initialInput?: string;
    children?: Snippet;
  } = $props();

  let controller = new PromptInputControllerState(untrack(() => initialInput));
  setPromptInputController(controller);
  setProviderAttachments(controller.attachments);

  onDestroy(() => {
    controller.attachments.cleanup();
  });
</script>

{@render children?.()}
