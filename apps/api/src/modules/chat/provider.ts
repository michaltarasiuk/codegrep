import { createGroq } from "@ai-sdk/groq";

export let groqProvider = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
