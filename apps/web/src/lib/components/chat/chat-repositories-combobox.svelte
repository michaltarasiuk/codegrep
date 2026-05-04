<script lang="ts">
  import BookIcon from "@lucide/svelte/icons/book";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
  import { Checkbox } from "@workspace/ui/checkbox/index.js";
  import * as Command from "@workspace/ui/command/index.js";
  import * as Popover from "@workspace/ui/popover/index.js";

  interface Repository {
    label: string;
    value: string;
    private: boolean;
  }

  let { selected = $bindable<string[]>([]) }: { selected?: string[] } =
    $props();

  let open = $state(false);
  let search = $state("");
  let repositories = $state<Repository[]>([]);

  let triggerLabel = $derived.by(() => {
    if (selected.length === 0) return "Select a repository";
    if (selected.length === 1) return selected[0]!;
    return `${selected.length} repositories`;
  });

  function toggleRepository(value: string) {
    selected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
  }

  function onPopoverOpenChange(next: boolean) {
    if (!next) {
      search = "";
    }
  }
</script>

<Popover.Root bind:open onOpenChange={onPopoverOpenChange}>
  <Popover.Trigger>
    {#snippet child({ props })}
      <PromptInput.Button
        class="px-0! hover:bg-transparent! aria-expanded:bg-transparent! dark:aria-expanded:bg-transparent!"
        {...props}
      >
        <BookIcon class="shrink-0" />
        <span class="truncate">{triggerLabel}</span>
      </PromptInput.Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content
    align="start"
    side="bottom"
    avoidCollisions={false}
    class="flex max-h-80 min-h-0 w-72 flex-col overflow-hidden p-0"
  >
    <Command.Root
      shouldFilter={false}
      class="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain"
    >
      <Command.Input bind:value={search} placeholder="Search GitHub…" />
      <Command.List class="max-h-64 min-h-0 flex-1 scroll-py-1 overflow-y-auto">
        {#if repositories.length === 0}
          <Command.Empty>No repository found.</Command.Empty>
        {:else}
          <Command.Group>
            {#each repositories as repo (repo.value)}
              {@const isChecked = selected.includes(repo.value)}
              <Command.Item
                value={repo.value}
                onSelect={() => toggleRepository(repo.value)}
              >
                <Checkbox
                  checked={isChecked}
                  tabindex={-1}
                  aria-hidden="true"
                />
                <span class="truncate">{repo.label}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        {/if}
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
