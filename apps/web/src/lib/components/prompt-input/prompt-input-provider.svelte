<script lang="ts">
  import type { Snippet } from "svelte";
  import { onDestroy } from "svelte";

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

  const controller = new PromptInputControllerState(initialInput);
  setPromptInputController(controller);
  setProviderAttachments(controller.attachments);

  onDestroy(() => {
    controller.attachments.cleanup();
  });
</script>

{@render children?.()}
