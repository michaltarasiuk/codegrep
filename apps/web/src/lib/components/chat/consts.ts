export interface ChatModel {
  chef: string;
  chefSlug: string;
  id: string;
  name: string;
  providers: string[];
}

export const SUGGESTIONS = [
  "What is the project structure?",
  "How does the main entry point work?",
  "What are the key abstractions?",
  "Show me the testing patterns",
] as const;

export const MODELS = [
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-5-20250929",
    name: "Claude 4.5 Sonnet",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-haiku-4-5-20251001",
    name: "Claude 4.5 Haiku",
    providers: ["anthropic", "azure", "google-vertex", "amazon-bedrock"],
  },
] as const satisfies ChatModel[];
