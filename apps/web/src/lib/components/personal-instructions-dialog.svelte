<script lang="ts">
  import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import XIcon from "@lucide/svelte/icons/x";
  import dedent from "dedent";

  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  const MAX_LENGTH = 4000;

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

  let value = $state("");
  let showTemplates = $state(false);

  const charCount = $derived(value.length);

  function appendTemplate(text: string) {
    if (!!value.length && !value.endsWith("\n")) {
      value += "\n\n";
    }
    value += text;
  }
</script>

<Dialog.Root open>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Personal instructions</Dialog.Title>
      <Dialog.Description>
        Set up your assistant to align with your workflows and preferences.
        These instructions will only impact your personal conversation.
      </Dialog.Description>
    </Dialog.Header>

    <div class="relative">
      <Textarea
        bind:value
        placeholder="Your instructions"
        maxlength={MAX_LENGTH}
        cols={30}
        rows={7}
        class="h-52 pb-12"
      />
      <div class="absolute bottom-0 flex w-full items-center px-3 py-2">
        {#if showTemplates}
          <div class="flex gap-1">
            {#each TEMPLATES as template (template.key)}
              <Button
                variant="outline"
                size="sm"
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

    <p class="text-muted-foreground text-xs">
      {charCount} / {MAX_LENGTH} characters
    </p>

    <Dialog.Footer>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
