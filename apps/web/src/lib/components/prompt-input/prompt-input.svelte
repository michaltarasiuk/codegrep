<script lang="ts">
  import type { FileUIPart } from "ai";
  import type { Snippet } from "svelte";
  import { onDestroy } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { cn } from "$lib/utils/cn.js";
  import { convertBlobUrlToDataUrl } from "$lib/utils/url.js";

  import {
    AttachmentsState,
    getPromptInputController,
    type PromptInputError,
    type PromptInputMessage,
    ReferencedSourcesState,
    setLocalAttachments,
    setReferencedSourcesState,
  } from "./prompt-input-context.svelte.js";

  type PromptInputProps = Omit<HTMLFormAttributes, "onsubmit" | "onerror"> & {
    accept?: string;
    multiple?: boolean;
    globalDrop?: boolean;
    syncHiddenInput?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    onError?: (error: PromptInputError) => void;
    onSubmit: (
      message: PromptInputMessage,
      event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
    ) => void | Promise<void>;
    children?: Snippet;
  };

  let {
    class: className,
    accept,
    multiple,
    globalDrop = false,
    syncHiddenInput = false,
    maxFiles,
    maxFileSize,
    onError,
    onSubmit,
    children,
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

  const clearAll = () => {
    attachments.clear();
    referencedSources.clear();
  };

  const matchesAccept = (file: File) => {
    if (!accept || accept.trim() === "") {
      return true;
    }

    const patterns = accept
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return patterns.some((pattern) => {
      if (pattern.endsWith("/*")) {
        return file.type.startsWith(pattern.slice(0, -1));
      }
      return file.type === pattern;
    });
  };

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

    const withinSize = (file: File) =>
      maxFileSize ? file.size <= maxFileSize : true;
    const sized = accepted.filter(withinSize);

    if (accepted.length > 0 && sized.length === 0) {
      onError?.({
        code: "max_file_size",
        message: "All files exceed the maximum size.",
      });
      return;
    }

    const capacity =
      typeof maxFiles === "number"
        ? Math.max(0, maxFiles - attachments.files.length)
        : undefined;
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

  const handleFileChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    if (input.files) {
      addWithValidation(input.files);
    }
    input.value = "";
  };

  const handleOpenDialog = () => {
    fileInputRef?.click();
  };

  const handleSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const text = usingProvider
      ? controller.textInput.value
      : ((new FormData(form).get("message") as string) ?? "");

    if (!usingProvider) {
      form.reset();
    }

    try {
      const convertedFiles: FileUIPart[] = await Promise.all(
        attachments.files.map(async (attachment) => {
          const { id, ...item } = attachment;
          void id;
          if (item.url?.startsWith("blob:")) {
            const dataUrl = await convertBlobUrlToDataUrl(item.url);
            return { ...item, url: dataUrl ?? item.url };
          }
          return item;
        })
      );

      const result = onSubmit({ files: convertedFiles, text }, event);
      if (result && typeof (result as Promise<void>).then === "function") {
        try {
          await result;
          clearAll();
          if (usingProvider) {
            controller.textInput.clear();
          }
        } catch {
          // Keep values to support retry.
        }
      } else {
        clearAll();
        if (usingProvider) {
          controller.textInput.clear();
        }
      }
    } catch {
      // Keep values to support retry.
    }
  };

  $effect(() => {
    if (!usingProvider) {
      return;
    }

    controller.registerFileInput(fileInputRef, handleOpenDialog);
  });

  $effect(() => {
    if (!syncHiddenInput || !fileInputRef || !!attachmentsCount) {
      return;
    }
    fileInputRef.value = "";
  });

  $effect(() => {
    if (!formRef || globalDrop) {
      return;
    }

    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
      }
    };

    const onDrop = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
      }
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        addWithValidation(event.dataTransfer.files);
      }
    };

    formRef.addEventListener("dragover", onDragOver);
    formRef.addEventListener("drop", onDrop);

    return () => {
      formRef?.removeEventListener("drop", onDrop);
      formRef?.removeEventListener("dragover", onDragOver);
    };
  });

  $effect(() => {
    if (!globalDrop) {
      return;
    }

    const onDrop = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
      }
      const files = event.dataTransfer?.files ?? [];

      if (files.length > 0) {
        addWithValidation(files);
      }
    };

    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
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
