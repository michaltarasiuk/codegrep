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
    chef: "Meta",
    chefSlug: "meta",
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    providers: ["groq"],
  },
] as const satisfies ChatModel[];
