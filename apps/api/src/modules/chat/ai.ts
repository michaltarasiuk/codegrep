import { createGroq } from "@ai-sdk/groq";

export const ai = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
