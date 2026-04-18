<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { cn } from "@workspace/ui/cn.js";
  import * as InputGroup from "@workspace/ui/input-group/index.js";
  import type { ComponentProps } from "svelte";
  import type {
    ClipboardEventHandler,
    FormEventHandler,
    KeyboardEventHandler,
  } from "svelte/elements";

  import {
    getPromptInputAttachments,
    getPromptInputController,
  } from "./prompt-input-context.svelte.js";

  let {
    value = $bindable(""),
    placeholder = "What would you like to know?",
    onkeydown,
    oninput,
    class: className,
    ...restProps
  }: ComponentProps<typeof InputGroup.Textarea> = $props();

  let controller = getPromptInputController();
  let attachments = getPromptInputAttachments();

  let isComposing = $state(false);

  let boundToController = $derived(isDefined(controller));
  let effectiveValue = $derived(
    boundToController ? controller!.textInput.value : value
  );

  function handleKeyDown(
    e: Parameters<KeyboardEventHandler<HTMLTextAreaElement>>[0]
  ) {
    // Call the external onkeydown handler first
    onkeydown?.(e);
    // If the external handler prevented default, don't run internal logic
    if (e.defaultPrevented) {
      return;
    }
    if (e.key === "Enter") {
      if (isComposing || e.isComposing) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      // Check if the submit button is disabled before submitting
      let { form } = e.currentTarget;
      let submitButton = form?.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (submitButton?.disabled) {
        return;
      }
      form?.requestSubmit();
    }
    // Remove last attachment when Backspace is pressed and textarea is empty
    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      attachments.files.length > 0
    ) {
      e.preventDefault();
      let lastAttachment = attachments.files.at(-1);
      if (isDefined(lastAttachment)) {
        attachments.remove(lastAttachment.id);
      }
    }
  }

  function handleInput(
    e: Parameters<FormEventHandler<HTMLTextAreaElement>>[0]
  ) {
    let newValue = e.currentTarget.value;
    if (boundToController) {
      controller!.textInput.setInput(newValue);
    } else {
      value = newValue;
    }
    oninput?.(e);
  }

  function handlePaste(
    e: Parameters<ClipboardEventHandler<HTMLTextAreaElement>>[0]
  ) {
    let items = e.clipboardData?.items ?? [];
    let files: File[] = [];
    for (let item of items) {
      if (item.kind === "file") {
        let file = item.getAsFile();
        if (isDefined(file)) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      e.preventDefault();
      attachments.add(files);
    }
  }

  function handleCompositionEnd() {
    isComposing = true;
  }

  function handleCompositionStart() {
    isComposing = false;
  }
</script>

<InputGroup.Textarea
  name="message"
  value={effectiveValue}
  {placeholder}
  class={cn("field-sizing-content max-h-48 min-h-16", className)}
  onkeydown={handleKeyDown}
  oninput={handleInput}
  onpaste={handlePaste}
  oncompositionend={handleCompositionStart}
  oncompositionstart={handleCompositionEnd}
  {...restProps}
/>
