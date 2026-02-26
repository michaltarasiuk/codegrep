<script lang="ts">
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
    onError?: (error: PromptInputError) => void;
    onSubmit: (
      message: PromptInputMessage,
      e: SubmitEvent
    ) => void | Promise<void>;
  }

  let {
    accept,
    multiple,
    globalDrop = false,
    syncHiddenInput = false,
    maxFiles,
    maxFileSize,
    children,
    class: className,
    onError,
    onSubmit,
    ...restProps
  }: PromptInputProps = $props();

  const controller = getPromptInputController();
  const usingProvider = !!controller;

  const localAttachments = new AttachmentsState();
  const attachments = usingProvider ? controller.attachments : localAttachments;
  const referencedSources = new ReferencedSourcesState();

  setLocalAttachments(attachments);
  setReferencedSourcesState(referencedSources);

  let fileInputRef = $state<HTMLInputElement | null>(null);
  let formRef = $state<HTMLFormElement | null>(null);
  let attachmentsCount = $derived(attachments.files.length);

  const getAcceptPatterns = () =>
    (accept ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  const matchesPattern = (file: File, pattern: string) =>
    pattern.endsWith("/*")
      ? file.type.startsWith(pattern.slice(0, -1))
      : file.type === pattern;

  const matchesAccept = (file: File) => {
    const patterns = getAcceptPatterns();
    return (
      patterns.length === 0 ||
      patterns.some((pattern) => matchesPattern(file, pattern))
    );
  };

  const isWithinSizeLimit = (file: File) =>
    typeof maxFileSize === "number" ? file.size <= maxFileSize : true;

  const getCapacity = () =>
    typeof maxFiles === "number"
      ? Math.max(0, maxFiles - attachments.files.length)
      : undefined;

  const addWithValidation = (fileList: File[] | FileList) => {
    const incoming = [...fileList];
    const accepted = incoming.filter(matchesAccept);
    if (incoming.length > 0 && accepted.length === 0) {
      onError?.({
        code: "accept",
        message: "No files match the accepted types.",
      });
      return;
    }
    const sized = accepted.filter(isWithinSizeLimit);
    if (accepted.length > 0 && sized.length === 0) {
      onError?.({
        code: "max_file_size",
        message: "All files exceed the maximum size.",
      });
      return;
    }
    const capacity = getCapacity();
    const capped =
      typeof capacity === "number" ? sized.slice(0, capacity) : sized;
    if (typeof capacity === "number" && sized.length > capacity) {
      onError?.({
        code: "max_files",
        message: "Too many files. Some were not added.",
      });
    }
    if (capped.length > 0) {
      attachments.add(capped);
    }
  };

  const clearAll = () => {
    attachments.clear();
    referencedSources.clear();
  };

  const clearAfterSuccessfulSubmit = () => {
    clearAll();
    if (usingProvider) {
      controller.textInput.clear();
    }
  };

  const parseAttachment = async (
    attachment: (typeof attachments.files)[number]
  ): Promise<FileUIPart> => {
    const { id: _id, ...item } = attachment;
    let url = item.url;
    if (url.startsWith("blob:")) {
      url = (await blobUrlToDataUrl(item.url)) ?? url;
    }
    return { ...item, url };
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = e.currentTarget;
    if (input.files) {
      addWithValidation(input.files);
    }
    input.value = "";
  };

  const handleSubmit: EventHandler<SubmitEvent> = async (e) => {
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
      await onSubmit({ text, files }, e);
      clearAfterSuccessfulSubmit();
    } catch {
      // Keep values to support retry.
    }
  };

  $effect(() => {
    if (!usingProvider) {
      return;
    }
    controller.registerFileInput(fileInputRef, () => {
      fileInputRef?.click();
    });
  });

  $effect(() => {
    if (!syncHiddenInput || !fileInputRef || !!attachmentsCount) {
      return;
    }
    fileInputRef.value = "";
  });

  $effect(() => {
    if (globalDrop || !formRef) {
      return;
    }
    const onDrop = (e: DragEvent) => {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
      const files = e.dataTransfer?.files ?? [];
      if (files.length > 0) {
        addWithValidation(files);
      }
    };
    const onDragOver = (e: DragEvent) => {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
    };
    formRef.addEventListener("drop", onDrop);
    formRef.addEventListener("dragover", onDragOver);
    return () => {
      formRef?.removeEventListener("drop", onDrop);
      formRef?.removeEventListener("dragover", onDragOver);
    };
  });

  $effect(() => {
    if (!globalDrop) {
      return;
    }
    const onDrop = (e: DragEvent) => {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
      const files = e.dataTransfer?.files ?? [];
      if (files.length > 0) {
        addWithValidation(files);
      }
    };
    const onDragOver = (e: DragEvent) => {
      const types = e.dataTransfer?.types ?? [];
      if (types.includes("Files")) {
        e.preventDefault();
      }
    };
    document.addEventListener("drop", onDrop);
    document.addEventListener("dragover", onDragOver);
    return () => {
      document.removeEventListener("drop", onDrop);
      document.removeEventListener("dragover", onDragOver);
    };
  });

  onDestroy(() => {
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
