<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import FolderOpenIcon from "@lucide/svelte/icons/folder-open";
  import { cn, type WithElementRef } from "@workspace/ui/cn.js";
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@workspace/ui/collapsible/index.js";
  import type { HTMLAttributes } from "svelte/elements";

  import { getFileTree } from "./file-tree-context.svelte.js";
  import FileTreeIcon from "./file-tree-icon.svelte";
  import FileTreeName from "./file-tree-name.svelte";

  type FileTreeFolderProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    name: string;
    path: string;
  };

  let {
    ref = $bindable(null),
    name,
    path,
    children,
    class: className,
    ...restProps
  }: FileTreeFolderProps = $props();

  let fileTree = getFileTree();

  let isExpanded = $derived(fileTree.isExpanded(path));
  let isSelected = $derived(fileTree.isSelected(path));

  function handleOpenChange() {
    fileTree.togglePath(path);
  }

  function handleSelect() {
    fileTree.selectPath(path);
  }
</script>

<Collapsible open={isExpanded} onOpenChange={handleOpenChange}>
  <div
    bind:this={ref}
    data-slot="file-tree-folder"
    role="treeitem"
    tabindex={0}
    class={cn(className)}
    {...restProps}
  >
    <div
      class={cn(
        "hover:bg-muted/50 flex w-full items-center gap-1 rounded px-2 py-1 text-left transition-colors",
        isSelected && "bg-muted"
      )}
    >
      <CollapsibleTrigger
        class="flex shrink-0 cursor-pointer items-center border-none bg-transparent p-0"
      >
        <ChevronRightIcon
          class={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform",
            isExpanded && "rotate-90"
          )}
        />
      </CollapsibleTrigger>
      <button
        type="button"
        class="flex min-w-0 flex-1 cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-left"
        onclick={handleSelect}
      >
        <FileTreeIcon>
          {#if isExpanded}
            <FolderOpenIcon class="size-4 text-blue-500" />
          {:else}
            <FolderIcon class="size-4 text-blue-500" />
          {/if}
        </FileTreeIcon>
        <FileTreeName>{name}</FileTreeName>
      </button>
    </div>
    <CollapsibleContent>
      <div class="ml-4 border-l pl-2">
        {@render children?.()}
      </div>
    </CollapsibleContent>
  </div>
</Collapsible>
