<script lang="ts">
  import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import XIcon from "@lucide/svelte/icons/x";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { Button } from "@workspace/ui/button/index.js";
  import { cn } from "@workspace/ui/cn.js";
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import * as Field from "@workspace/ui/field/index.js";
  import { Textarea } from "@workspace/ui/textarea/index.js";
  import { useId } from "bits-ui";
  import dedent from "dedent";

  import { authClient } from "$lib/utils/client.js";

  let TEMPLATES: { key: string; label: string; text: string }[] = [
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

  let MAX_LENGTH = 4_000;

  let { open, onClose }: { open: boolean; onClose: () => void } = $props();

  let session = authClient.useSession();
  let instructionsFieldId = useId();

  let textarea = $state<HTMLTextAreaElement | null>(null);
  let loading = $state(false);
  let showTemplates = $state(false);

  let initialValue = $derived($session.data?.user.personalInstructions ?? "");
  let value = $derived(initialValue);
  let charCount = $derived(value.length);
  let invalid = $derived(charCount > MAX_LENGTH);

  function appendTemplate(text: string) {
    if (value.length > 0) {
      if (!value.endsWith("\n")) {
        value += "\n";
      }
      if (!value.endsWith("\n\n")) {
        value += "\n";
      }
    }
    value += text;

    requestAnimationFrame(() => {
      if (isDefined(textarea)) {
        textarea.focus();
        textarea.setSelectionRange(value.length, value.length);
        textarea.scrollTop = textarea.scrollHeight;
      }
    });
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    try {
      loading = true;
      let result = await authClient.updateUser({
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
  <Dialog.Content>
    <form onsubmit={handleSubmit}>
      <Dialog.Header>
        <Dialog.Title>Personal instructions</Dialog.Title>
        <Dialog.Description>
          Set up your assistant to align with your workflows and preferences.
          These instructions will only impact your personal conversation.
        </Dialog.Description>
      </Dialog.Header>

      <div class="py-4">
        <Field.Field>
          <Field.Label for={instructionsFieldId} class="sr-only">
            Instructions
          </Field.Label>

          <div class="relative">
            <Textarea
              bind:ref={textarea}
              bind:value
              id={instructionsFieldId}
              placeholder="Your instructions"
              cols={30}
              rows={7}
              class="scrollbar-hide h-52 resize-none pb-12"
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
                      <PlusIcon class="size-4" />
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
                  <XIcon class="size-4" />
                {:else}
                  <LightbulbIcon class="size-4" />
                {/if}
              </Button>
            </div>
          </div>

          <p
            class={cn("text-muted-foreground text-xs tabular-nums", {
              "text-destructive": invalid,
            })}
          >
            {charCount} / {MAX_LENGTH} characters
          </p>
        </Field.Field>
      </div>

      <Dialog.Footer>
        <Button variant="outline" onclick={() => onClose()}>Cancel</Button>
        <Button type="submit" disabled={loading || invalid}>Save</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
