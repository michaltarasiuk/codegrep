import { isDefined } from "@workspace/shared/is-defined.js";
import type { FileUIPart, SourceDocumentUIPart } from "ai";
import { getContext, setContext } from "svelte";

export interface PromptInputMessage {
  text: string;
  files?: FileUIPart[];
}

export interface PromptInputError {
  code: "accept" | "max_file_size" | "max_files";
  message: string;
}

export class PromptInputControllerState {
  textInput: TextInputState;
  attachments: AttachmentsState;

  constructor(initialInput = "") {
    this.textInput = new TextInputState(initialInput);
    this.attachments = new AttachmentsState();
  }

  registerFileInput = (ref: HTMLInputElement | null, open: () => void) => {
    this.attachments.setFileInput(ref, open);
  };
}

export class TextInputState {
  value = $state("");

  constructor(initialValue = "") {
    this.value = initialValue;
  }

  setInput = (value: string) => {
    this.value = value;
  };

  clear = () => {
    this.value = "";
  };
}

export class AttachmentsState {
  files = $state<(FileUIPart & { id: string })[]>([]);
  fileInputRef = $state<HTMLInputElement | null>(null);
  #open: () => void = function openNoop() {};

  setFileInput = (ref: HTMLInputElement | null, open: () => void) => {
    this.fileInputRef = ref;
    this.#open = open;
  };

  openFileDialog = () => {
    this.#open();
  };

  add = (files: File[] | FileList) => {
    const incoming = toFileUIParts(files);
    if (incoming.length === 0) {
      return;
    }
    this.files = [...this.files, ...incoming];
  };

  remove = (id: string) => {
    const file = this.files.find((f) => f.id === id);
    if (isDefined(file)) {
      URL.revokeObjectURL(file.url);
    }
    this.files = this.files.filter((f) => f.id !== id);
  };

  clear = () => {
    this.files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    this.files = [];
  };

  cleanup = () => {
    this.clear();
  };
}

export class ReferencedSourcesState {
  sources = $state<(SourceDocumentUIPart & { id: string })[]>([]);

  add = (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
    const incoming = Array.isArray(sources) ? sources : [sources];
    this.sources = [
      ...this.sources,
      ...incoming.map((s) => ({ ...s, id: createId() })),
    ];
  };

  remove = (id: string) => {
    this.sources = this.sources.filter((s) => s.id !== id);
  };

  clear = () => {
    this.sources = [];
  };
}

const CONTROLLER_KEY = Symbol.for("scn-prompt-input-controller");
const PROVIDER_ATTACHMENTS_KEY = Symbol.for(
  "scn-prompt-input-provider-attachments"
);
const LOCAL_ATTACHMENTS_KEY = Symbol.for("scn-prompt-input-local-attachments");
const REFERENCED_SOURCES_KEY = Symbol.for(
  "scn-prompt-input-referenced-sources"
);

export function getPromptInputAttachments() {
  const local = getContext<AttachmentsState | null>(LOCAL_ATTACHMENTS_KEY);
  const provider = getProviderAttachments();
  return local ?? provider;
}

export function setLocalAttachments(value: AttachmentsState) {
  return setContext(LOCAL_ATTACHMENTS_KEY, value);
}

export function getProviderAttachments() {
  const value = getContext<AttachmentsState | null>(PROVIDER_ATTACHMENTS_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing provider attachments context");
  }
  return value;
}

export function setProviderAttachments(value: AttachmentsState) {
  return setContext(PROVIDER_ATTACHMENTS_KEY, value);
}

export function getPromptInputController() {
  return getContext<PromptInputControllerState | null>(CONTROLLER_KEY);
}

export function setPromptInputController(value: PromptInputControllerState) {
  return setContext(CONTROLLER_KEY, value);
}

export function getPromptInputReferencedSources() {
  const value = getContext<ReferencedSourcesState | null>(
    REFERENCED_SOURCES_KEY
  );
  if (!isDefined(value)) {
    throw new Error("Missing prompt input referenced sources context");
  }
  return value;
}

export function setReferencedSourcesState(value: ReferencedSourcesState) {
  return setContext(REFERENCED_SOURCES_KEY, value);
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function toFileUIParts(
  files: File[] | FileList
): (FileUIPart & { id: string })[] {
  return [...files].map((file) => ({
    type: "file",
    id: createId(),
    filename: file.name,
    mediaType: file.type,
    url: URL.createObjectURL(file),
  }));
}
