<script lang="ts">
  import PaperclipIcon from "@lucide/svelte/icons/paperclip";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
</script>

<PromptInput.Button
  tooltip="Add files"
  variant="ghost"
  size="icon-sm"
  type="button"
>
  <PaperclipIcon size={16} class="text-muted-foreground" />
</PromptInput.Button>
