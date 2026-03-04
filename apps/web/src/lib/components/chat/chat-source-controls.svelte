<script lang="ts">
  import AtSignIcon from "@lucide/svelte/icons/at-sign";
  import FilesIcon from "@lucide/svelte/icons/files";
  import GlobeIcon from "@lucide/svelte/icons/globe";
  import RulerIcon from "@lucide/svelte/icons/ruler";
  import XIcon from "@lucide/svelte/icons/x";
  import type { SourceDocumentUIPart } from "ai";

  import * as PromptInput from "$lib/components/prompt-input/index.js";

  import type { ChatTabs } from "./consts.js";

  let {
    tabs,
    sources,
    selectedSourceIds = $bindable<string[]>([]),
  }: {
    tabs: ChatTabs;
    sources: SourceDocumentUIPart[];
    selectedSourceIds: string[];
  } = $props();

  let selectedSources = $derived(
    sources.filter((source) => selectedSourceIds.includes(source.sourceId))
  );
  let unselectedSources = $derived(
    sources.filter((source) => !selectedSourceIds.includes(source.sourceId))
  );

  let validSelectedSourceIds = $derived.by(() => {
    const validIds = new Set(sources.map((s) => s.sourceId));
    return selectedSourceIds.filter((id) => validIds.has(id));
  });

  $effect(() => {
    if (validSelectedSourceIds.length !== selectedSourceIds.length) {
      selectedSourceIds = validSelectedSourceIds;
    }
  });

  function addSource(sourceId: string) {
    if (selectedSourceIds.includes(sourceId)) {
      return;
    }
    selectedSourceIds = [...selectedSourceIds, sourceId];
  }

  function removeSource(sourceId: string) {
    selectedSourceIds = selectedSourceIds.filter((id) => id !== sourceId);
  }
</script>

<PromptInput.HoverCard>
  <PromptInput.HoverCardTrigger>
    <PromptInput.Button variant="outline" size="icon-sm" class="h-8!">
      <AtSignIcon class="text-muted-foreground" size={12} />
    </PromptInput.Button>
  </PromptInput.HoverCardTrigger>
  <PromptInput.HoverCardContent class="w-100 p-0">
    <PromptInput.Command>
      <PromptInput.CommandInput
        placeholder="Ask about the codebase..."
        class="border-none focus-visible:ring-0"
      />
      <PromptInput.CommandList>
        <PromptInput.CommandEmpty class="text-muted-foreground p-3 text-sm">
          No results found.
        </PromptInput.CommandEmpty>
        <PromptInput.CommandGroup heading="Added">
          <PromptInput.CommandItem>
            <GlobeIcon />
            <span>Active Tabs</span>
            <span class="text-muted-foreground ml-auto">✓</span>
          </PromptInput.CommandItem>
        </PromptInput.CommandGroup>
        <PromptInput.CommandSeparator />
        <PromptInput.CommandGroup heading="Other Files">
          {#each unselectedSources as source, index (`${source.title}-${index}`)}
            <PromptInput.CommandItem
              onSelect={() => addSource(source.sourceId)}
            >
              <GlobeIcon class="text-primary" />
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium">{source.title}</span>
                <span class="text-muted-foreground truncate text-xs">
                  {source.filename}
                </span>
              </div>
            </PromptInput.CommandItem>
          {/each}
        </PromptInput.CommandGroup>
      </PromptInput.CommandList>
    </PromptInput.Command>
  </PromptInput.HoverCardContent>
</PromptInput.HoverCard>

<PromptInput.HoverCard>
  <PromptInput.HoverCardTrigger>
    <PromptInput.Button variant="outline" size="sm">
      <RulerIcon size={12} class="text-muted-foreground" />
      <span>1</span>
    </PromptInput.Button>
  </PromptInput.HoverCardTrigger>
  <PromptInput.HoverCardContent class="divide-y overflow-hidden p-0">
    <div class="space-y-2 p-3">
      <p class="text-muted-foreground text-sm font-medium">
        Attached Project Rules
      </p>
      <p class="text-muted-foreground ml-4 text-sm">Always Apply:</p>
      <p class="ml-8 text-sm">ultracite.mdc</p>
    </div>
    <p class="bg-sidebar text-muted-foreground px-4 py-3 text-sm">
      Click to manage
    </p>
  </PromptInput.HoverCardContent>
</PromptInput.HoverCard>

<PromptInput.HoverCard>
  <PromptInput.HoverCardTrigger>
    <PromptInput.Button variant="outline" size="sm">
      <FilesIcon size={12} class="text-muted-foreground" />
      <span>{tabs.active.length} Tab</span>
    </PromptInput.Button>
  </PromptInput.HoverCardTrigger>
  <PromptInput.HoverCardContent class="w-[320px] space-y-4 px-0 py-3">
    <PromptInput.Tab>
      <PromptInput.TabLabel>Active Tabs</PromptInput.TabLabel>
      <PromptInput.TabBody>
        {#each tabs.active as tab (tab.path)}
          <PromptInput.TabItem>
            <GlobeIcon size={16} class="text-primary" />
            <span class="truncate" dir="rtl">{tab.path}</span>
          </PromptInput.TabItem>
        {/each}
      </PromptInput.TabBody>
    </PromptInput.Tab>
    <PromptInput.Tab>
      <PromptInput.TabLabel>Recents</PromptInput.TabLabel>
      <PromptInput.TabBody>
        {#each tabs.recents as tab (tab.path)}
          <PromptInput.TabItem>
            <GlobeIcon size={16} class="text-primary" />
            <span dir="rtl" class="truncate">{tab.path}</span>
          </PromptInput.TabItem>
        {/each}
      </PromptInput.TabBody>
    </PromptInput.Tab>
    <div class="text-muted-foreground border-t px-3 pt-2 text-xs">
      Only file paths are included
    </div>
  </PromptInput.HoverCardContent>
</PromptInput.HoverCard>

{#if selectedSources.length > 0}
  <div class="flex min-w-0 items-center gap-1">
    {#each selectedSources as source (source.sourceId)}
      <div
        class="bg-muted/50 inline-flex max-w-55 items-center gap-1 rounded-md border px-2 py-1"
      >
        <GlobeIcon class="text-primary size-3" />
        <span class="truncate text-xs">{source.title}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
          onclick={() => removeSource(source.sourceId)}
        >
          <XIcon class="size-3" />
        </button>
      </div>
    {/each}
  </div>
{/if}
