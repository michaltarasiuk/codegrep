<script lang="ts">
  import ImageIcon from "@lucide/svelte/icons/image";

  import * as PromptInput from "$lib/components/prompt-input/index.js";

  import { getChat } from "./chat-context";
  import ChatModelSelector from "./chat-model-selector.svelte";
  import { MODELS } from "./consts";

  let {
    selectedModel = $bindable(MODELS[0].id),
    handleSubmit,
  }: {
    selectedModel: string;
    handleSubmit: (message: PromptInput.PromptInputMessage) => void;
  } = $props();

  const chat = getChat();
</script>

<PromptInput.Provider>
  <PromptInput.Root globalDrop multiple onsubmit={handleSubmit}>
    <PromptInput.Body>
      <PromptInput.Textarea
        placeholder="Ask about the codebase..."
        class="max-h-72"
      />
    </PromptInput.Body>
    <PromptInput.Footer>
      <PromptInput.Tools>
        <ChatModelSelector bind:selectedModel models={MODELS} />
      </PromptInput.Tools>

      <div class="flex items-center gap-2">
        <PromptInput.ActionMenu>
          <PromptInput.ActionMenuTrigger variant="ghost" size="icon-sm">
            <ImageIcon size={16} class="text-muted-foreground" />
          </PromptInput.ActionMenuTrigger>
          <PromptInput.ActionMenuContent>
            <PromptInput.ActionAddAttachments label="Add image or file" />
          </PromptInput.ActionMenuContent>
        </PromptInput.ActionMenu>
        <PromptInput.Submit
          status={chat.status}
          size="icon-sm"
          onstop={() => chat.stop()}
        />
      </div>
    </PromptInput.Footer>
  </PromptInput.Root>
</PromptInput.Provider>
