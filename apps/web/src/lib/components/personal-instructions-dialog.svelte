<script lang="ts">
  import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import XIcon from "@lucide/svelte/icons/x";
  import dedent from "dedent";

  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { authClient } from "$lib/utils/client";
  import { isDefined } from "$lib/utils/is-defined";

  const TEMPLATES: { key: string; label: string; text: string }[] = [
    {
      key: "role",
      label: "Role",
      text: dedent`
        Your role:
        - {role_type} expert in {domain}
        - Focus on {key_skill_area}
      `,
    },
    {
      key: "communication",
      label: "Communication",
      text: dedent`
        Communication:
        - Write in {tone/language}
        - Reference {source_type} documentation
        - Structure responses as {format}
      `,
    },
    {
      key: "code",
      label: "Code preferences",
      text: dedent`
        Code guidelines:
        - Use {language} conventions
        - Follow {pattern/code_guidelines}
        - Optimize for {goal}
      `,
    },
  ];

  const MAX_LENGTH = 4_000;

  let { open, onClose }: { open: boolean; onClose: () => void } = $props();

  const session = authClient.useSession();
  const initialValue = $session.data?.user.personalInstructions ?? "";

  let value = $state(initialValue);
  let textarea = $state<HTMLTextAreaElement | null>(null);

  let loading = $state(false);
  let showTemplates = $state(false);

  const charCount = $derived(value.length);

  function appendTemplate(text: string) {
    value += text;
  }

  async function handleSubmit() {
    try {
      loading = true;
      const result = await authClient.updateUser({
        personalInstructions: value,
      });
      if (!isDefined(result.error)) {
        onClose();
      }
    } finally {
      loading = false;
    }
  }
</script>

<Dialog.Root
  {open}
  onOpenChange={(open) => {
    if (!open) {
      onClose();
    }
  }}
  onOpenChangeComplete={(open) => {
    if (!open) {
      value = initialValue;
      showTemplates = false;
      loading = false;
    }
  }}
>
  <Dialog.Content class="sm:max-w-lg">
    <form class="space-y-4" onsubmit={handleSubmit}>
      <Dialog.Header>
        <Dialog.Title>Personal instructions</Dialog.Title>
        <Dialog.Description>
          Set up your assistant to align with your workflows and preferences.
          These instructions will only impact your personal conversation.
        </Dialog.Description>
      </Dialog.Header>

      <div class="relative">
        <Textarea
          bind:ref={textarea}
          bind:value
          placeholder="Your instructions"
          disabled={loading}
          maxlength={MAX_LENGTH}
          cols={30}
          rows={7}
          class="h-52 resize-none pb-12"
        />
        <div class="absolute bottom-0 flex w-full items-center px-3 py-2">
          {#if showTemplates}
            <div class="flex gap-1">
              {#each TEMPLATES as template (template.key)}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  class="h-7 gap-1 px-2 text-xs"
                  onclick={() => appendTemplate(template.text)}
                >
                  <PlusIcon class="size-3" />
                  {template.label}
                </Button>
              {/each}
            </div>
          {/if}

          <Button
            variant="ghost"
            size="icon-sm"
            disabled={loading}
            class="ms-auto"
            onclick={() => (showTemplates = !showTemplates)}
          >
            {#if showTemplates}
              <XIcon class="size-3.5" />
            {:else}
              <LightbulbIcon class="size-3.5" />
            {/if}
          </Button>
        </div>
      </div>

      <p class="text-muted-foreground text-xs tabular-nums">
        {charCount} / {MAX_LENGTH} characters
      </p>

      <Dialog.Footer>
        <Button variant="outline" onclick={() => onClose()}>Cancel</Button>
        <Button type="submit" disabled={loading}>Save</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
