<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";

  import * as ModelSelector from "$lib/components/model-selector/index.js";
  import * as PromptInput from "$lib/components/prompt-input/index.js";

  import type { ChatModel } from "./consts.js";

  let {
    models,
    selectedModel = $bindable(""),
    modelSelectorOpen = $bindable(false),
  }: {
    models: ChatModel[];
    selectedModel: string;
    modelSelectorOpen?: boolean;
  } = $props();

  const selectedModelData = $derived(
    models.find((model) => model.id === selectedModel) ?? models[0]!
  );
  const chefs = $derived([...new Set(models.map((model) => model.chef))]);

  function selectModel(id: string) {
    selectedModel = id;
    modelSelectorOpen = false;
  }
</script>

<ModelSelector.Root
  bind:open={modelSelectorOpen}
  onOpenChange={(open) => (modelSelectorOpen = open)}
>
  <ModelSelector.Trigger>
    {#snippet child({ props })}
      <PromptInput.Button class="w-full hover:bg-transparent!" {...props}>
        <ModelSelector.Logo provider={selectedModelData.chefSlug} />
        <ModelSelector.Name>{selectedModelData.name}</ModelSelector.Name>
      </PromptInput.Button>
    {/snippet}
  </ModelSelector.Trigger>
  <ModelSelector.Content>
    <ModelSelector.Input placeholder="Search models..." />
    <ModelSelector.List>
      <ModelSelector.Empty>No models found.</ModelSelector.Empty>
      {#each chefs as chef (chef)}
        <ModelSelector.Group heading={chef}>
          {#each models.filter((model) => model.chef === chef) as model (model.id)}
            <ModelSelector.Item
              value={model.id}
              onSelect={() => selectModel(model.id)}
            >
              <ModelSelector.Logo provider={model.chefSlug} />
              <ModelSelector.Name>{model.name}</ModelSelector.Name>
              <ModelSelector.LogoGroup>
                {#each model.providers as provider (provider)}
                  <ModelSelector.Logo {provider} />
                {/each}
              </ModelSelector.LogoGroup>
              {#if selectedModel === model.id}
                <CheckIcon class="ml-auto size-4" />
              {:else}
                <span class="ml-auto size-4"></span>
              {/if}
            </ModelSelector.Item>
          {/each}
        </ModelSelector.Group>
      {/each}
    </ModelSelector.List>
  </ModelSelector.Content>
</ModelSelector.Root>
