<script lang="ts">
  import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import XIcon from "@lucide/svelte/icons/x";
  import dedent from "dedent";
  import { cn } from "tailwind-variants";

  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { authClient } from "$lib/utils/client.js";
  import { ensureTrailingNewlines } from "$lib/utils/ensure-trailing-newlines.js";
  import { isDefined } from "$lib/utils/is-defined.js";

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

  let value = $derived(getInitialValue());
  let textarea = $state<HTMLTextAreaElement | null>(null);

  let loading = $state(false);
  let showTemplates = $state(false);

  const charCount = $derived(value.length);
  const invalid = $derived(charCount > MAX_LENGTH);

  function getInitialValue() {
    return $session.data?.user.personalInstructions ?? "";
  }

  function appendTemplate(text: string) {
    if (value.length > 0) {
      value = ensureTrailingNewlines(value);
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
      value = getInitialValue();
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

      <Field.Field class="py-4">
        <div class="relative">
          <Textarea
            bind:ref={textarea}
            bind:value
            placeholder="Your instructions"
            aria-invalid={invalid}
            disabled={loading}
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
                    disabled={loading}
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
              disabled={loading}
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

      <Dialog.Footer>
        <Button variant="outline" onclick={() => onClose()}>Cancel</Button>
        <Button type="submit" disabled={loading || invalid}>Save</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
