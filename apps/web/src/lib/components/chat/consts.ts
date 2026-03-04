import type { SourceDocumentUIPart } from "ai";

export interface ChatModel {
  chef: string;
  chefSlug: string;
  id: string;
  name: string;
  providers: string[];
}

export interface ChatTabs {
  active: ChatTab[];
  recents: ChatTab[];
}

interface ChatTab {
  path: string;
}

export const MODELS: ChatModel[] = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o",
    name: "GPT-4o",
    providers: ["openai", "azure"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    providers: ["openai", "azure"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    providers: ["anthropic", "google", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    providers: ["anthropic", "google", "amazon-bedrock"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    providers: ["google"],
  },
];

export const SOURCES: SourceDocumentUIPart[] = [
  {
    filename: "packages/elements/src",
    mediaType: "text/plain",
    sourceId: "1",
    title: "prompt-input.tsx",
    type: "source-document",
  },
  {
    filename: "apps/test/app/examples",
    mediaType: "text/plain",
    sourceId: "2",
    title: "queue.tsx",
    type: "source-document",
  },
  {
    filename: "packages/elements/src",
    mediaType: "text/plain",
    sourceId: "3",
    title: "task-queue-panel.tsx",
    type: "source-document",
  },
];

export const TABS: ChatTabs = {
  active: [{ path: "packages/elements/src/task-queue-panel.tsx" }],
  recents: [
    { path: "apps/test/app/examples/task-queue-panel.tsx" },
    { path: "apps/test/app/page.tsx" },
    { path: "packages/elements/src/task.tsx" },
    { path: "apps/test/app/examples/prompt-input.tsx" },
    { path: "packages/elements/src/queue.tsx" },
    { path: "apps/test/app/examples/queue.tsx" },
  ],
};
