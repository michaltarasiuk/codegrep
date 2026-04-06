<script lang="ts">
  import * as PromptInput from "$lib/components/prompt-input/index.js";

  import { getChat } from "./chat-context";
  import ModelSelector from "./chat-model-selector.svelte";
  import ChatPromptAddFilesButton from "./chat-prompt-add-files-button.svelte";
  import { MODELS } from "./consts";

  let {
    selectedModel = $bindable(MODELS[0].id),
    handleSubmit,
  }: {
    selectedModel: string;
    handleSubmit: (message: PromptInput.PromptInputMessage) => void;
  } = $props();

  const chat = $derived(getChat());
</script>

<PromptInput.Provider>
  <PromptInput.Root globalDrop multiple onsubmit={handleSubmit}>
    <PromptInput.Body>
      <PromptInput.Textarea
        placeholder="Ask about the codebase..."
        class="max-h-72"
        autofocus
      />
    </PromptInput.Body>
    <PromptInput.Footer class="pr-2">
      <PromptInput.Tools>
        <ChatPromptAddFilesButton />
      </PromptInput.Tools>

      <div class="flex shrink-0 items-center gap-3">
        <ModelSelector bind:selectedModel models={MODELS} />
        <PromptInput.Submit
          status={chat.status}
          size="icon-sm"
          onStop={() => chat.stop()}
        />
      </div>
    </PromptInput.Footer>
  </PromptInput.Root>
</PromptInput.Provider>
