<script lang="ts">
  import BookIcon from "@lucide/svelte/icons/book";
  import * as PromptInput from "@workspace/ai-elements/prompt-input/index.js";
  import { Checkbox } from "@workspace/ui/checkbox/index.js";
  import * as Command from "@workspace/ui/command/index.js";
  import * as Popover from "@workspace/ui/popover/index.js";

  interface Repo {
    id: number;
    fullName: string;
  }

  let { selected = $bindable<Repo[]>([]) }: { selected?: Repo[] } = $props();

  let open = $state(false);
  let search = $state("");
  let repos = $state<Repo[]>([]);

  let selectedIds = $derived.by(() => {
    return new Set(selected.map((r) => r.id));
  });
  let triggerLabel = $derived.by(() => {
    if (selected.length === 0) return "Select a repository";
    if (selected.length === 1) return selected[0]!.fullName;
    return `${selected.length} repositories`;
  });

  function isSelected(repo: Repo) {
    return selectedIds.has(repo.id);
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
        class="px-0! hover:bg-transparent! aria-expanded:bg-transparent! dark:hover:bg-transparent!"
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
    class="flex max-h-60 min-h-0 flex-col overflow-hidden p-0"
  >
    <Command.Root
      shouldFilter={false}
      class="min-h-0 flex-1 overscroll-contain"
    >
      <Command.Input bind:value={search} placeholder="Search" />
      <Command.List class="min-h-0 flex-1">
        {#if repos.length === 0}
          <Command.Empty>No repository found.</Command.Empty>
        {:else}
          <Command.Group>
            {#each repos as repo (repo.id)}
              {@const value = String(repo.id)}
              <Command.Item {value}>
                <Checkbox
                  checked={isSelected(repo)}
                  tabindex={-1}
                  aria-hidden="true"
                />
                <span class="truncate">{repo.fullName}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        {/if}
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
