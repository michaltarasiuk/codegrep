<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import type { FileUIPart } from "ai";
  import type { Snippet } from "svelte";
  import { onDestroy } from "svelte";
  import type {
    ChangeEventHandler,
    EventHandler,
    HTMLFormAttributes,
  } from "svelte/elements";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { cn } from "$lib/utils/cn.js";
  import { blobUrlToDataUrl } from "$lib/utils/url.js";

  import {
    AttachmentsState,
    getPromptInputController,
    type PromptInputError,
    type PromptInputMessage,
    ReferencedSourcesState,
    setLocalAttachments,
    setReferencedSourcesState,
  } from "./prompt-input-context.svelte.js";

  interface PromptInputProps extends Omit<
    HTMLFormAttributes,
    "onsubmit" | "onerror"
  > {
    accept?: string;
    multiple?: boolean;
    globalDrop?: boolean;
    syncHiddenInput?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    children?: Snippet;
    onerror?: (error: PromptInputError) => void;
    onsubmit: (
      message: PromptInputMessage,
      e: SubmitEvent
    ) => void | Promise<void>;
  }

  let {
    globalDrop = false,
    syncHiddenInput = false,
    accept,
    multiple,
    maxFiles,
    maxFileSize,
    onerror,
    onsubmit,
    children,
    class: className,
    ...restProps
  }: PromptInputProps = $props();

  const controller = getPromptInputController();
  const usingProvider = isDefined(controller);

  const localAttachments = new AttachmentsState();
  const attachments = usingProvider ? controller.attachments : localAttachments;
  const referencedSources = new ReferencedSourcesState();

  setLocalAttachments(attachments);
  setReferencedSourcesState(referencedSources);

  let fileInputRef = $state<HTMLInputElement | null>(null);
  let formRef = $state<HTMLFormElement | null>(null);

  let attachmentsCount = $derived(attachments.files.length);

  function getAcceptPatterns() {
    return (accept ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function matchesPattern(file: File, pattern: string) {
    return pattern.endsWith("/*")
      ? file.type.startsWith(pattern.slice(0, -1))
      : file.type === pattern;
  }

  function matchesAccept(file: File) {
    const patterns = getAcceptPatterns();
    return (
      patterns.length === 0 ||
      patterns.some((pattern) => matchesPattern(file, pattern))
    );
  }

  function isWithinSizeLimit(file: File) {
    return typeof maxFileSize === "number" ? file.size <= maxFileSize : true;
  }

  function getCapacity() {
    return typeof maxFiles === "number"
      ? Math.max(0, maxFiles - attachments.files.length)
      : null;
  }

  function addWithValidation(fileList: File[] | FileList) {
    const incoming = [...fileList];
    const accepted = incoming.filter(matchesAccept);
    if (incoming.length > 0 && accepted.length === 0) {
      onerror?.({
        code: "accept",
        message: "No files match the accepted types.",
      });
      return;
    }
    const sized = accepted.filter(isWithinSizeLimit);
    if (accepted.length > 0 && sized.length === 0) {
      onerror?.({
        code: "max_file_size",
        message: "All files exceed the maximum size.",
      });
      return;
    }
    const capacity = getCapacity();
    const capped =
      typeof capacity === "number" ? sized.slice(0, capacity) : sized;
    if (typeof capacity === "number" && sized.length > capacity) {
      onerror?.({
        code: "max_files",
        message: "Too many files. Some were not added.",
      });
    }
    if (capped.length > 0) {
      attachments.add(capped);
    }
  }

  function clearAll() {
    attachments.clear();
    referencedSources.clear();
  }

  function clearAfterSuccessfulSubmit() {
    clearAll();
    if (usingProvider) {
      controller.textInput.clear();
    }
  }

  async function parseAttachment(
    attachment: (typeof attachments.files)[number]
  ): Promise<FileUIPart> {
    const { id: _id, ...item } = attachment;
    let url = item.url;
    if (url.startsWith("blob:")) {
      url = (await blobUrlToDataUrl(item.url)) ?? url;
    }
    return { ...item, url };
  }

  function handleFileChange(
    e: Parameters<ChangeEventHandler<HTMLInputElement>>[0]
  ) {
    const input = e.currentTarget;
    if (isDefined(input.files)) {
      addWithValidation(input.files);
    }
    input.value = "";
  }

  async function handleSubmit(e: Parameters<EventHandler<SubmitEvent>>[0]) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const text = usingProvider
      ? controller.textInput.value
      : ((new FormData(form).get("message") as string) ?? "");
    if (!usingProvider) {
      form.reset();
    }
    try {
      const files = await Promise.all(attachments.files.map(parseAttachment));
      await onsubmit({ text, files }, e);
      clearAfterSuccessfulSubmit();
    } catch {
      // Keep values to support retry.
    }
  }

  $effect(function registerPromptInputFileInputWithController() {
    if (!usingProvider) {
      return;
    }
    controller.registerFileInput(fileInputRef, () => {
      fileInputRef?.click();
    });
  });

  $effect(function clearSyncedHiddenFileInputWhenEmpty() {
    if (!syncHiddenInput || !isDefined(fileInputRef) || !!attachmentsCount) {
      return;
    }
    fileInputRef.value = "";
  });

  $effect(function attachLocalFormDragAndDropHandlers() {
    if (globalDrop || !isDefined(formRef)) {
      return;
    }
    function onDrop(e: DragEvent) {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
      const files = e.dataTransfer?.files ?? [];
      if (files.length > 0) {
        addWithValidation(files);
      }
    }
    function onDragOver(e: DragEvent) {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
    }
    formRef.addEventListener("drop", onDrop);
    formRef.addEventListener("dragover", onDragOver);
    return function detachLocalFormDragAndDropHandlers() {
      formRef?.removeEventListener("drop", onDrop);
      formRef?.removeEventListener("dragover", onDragOver);
    };
  });

  $effect(function attachGlobalDocumentDragAndDropHandlers() {
    if (!globalDrop) {
      return;
    }
    function onDrop(e: DragEvent) {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
      const files = e.dataTransfer?.files ?? [];
      if (files.length > 0) {
        addWithValidation(files);
      }
    }
    function onDragOver(e: DragEvent) {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
    }
    document.addEventListener("drop", onDrop);
    document.addEventListener("dragover", onDragOver);
    return function detachGlobalDocumentDragAndDropHandlers() {
      document.removeEventListener("drop", onDrop);
      document.removeEventListener("dragover", onDragOver);
    };
  });

  onDestroy(function cleanupLocalPromptInputAttachments() {
    if (!usingProvider) {
      attachments.cleanup();
    }
  });
</script>

<Tooltip.Provider>
  <input
    bind:this={fileInputRef}
    type="file"
    title="Upload files"
    aria-label="Upload files"
    class="hidden"
    {accept}
    {multiple}
    onchange={handleFileChange}
  />

  <form
    bind:this={formRef}
    class={cn("w-full", className)}
    onsubmit={handleSubmit}
    {...restProps}
  >
    <InputGroup.Root class="overflow-hidden">
      {@render children?.()}
    </InputGroup.Root>
  </form>
</Tooltip.Provider>
