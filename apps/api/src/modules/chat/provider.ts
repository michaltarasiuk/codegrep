import { createAnthropic } from "@ai-sdk/anthropic";

let anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function getChatModel(modelId: string) {
  return anthropic(modelId);
}
