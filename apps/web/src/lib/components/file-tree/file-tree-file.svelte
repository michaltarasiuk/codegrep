<script lang="ts">
  import FileIcon from "@lucide/svelte/icons/file";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { getFileTree } from "./file-tree-context.svelte.js";
  import FileTreeIcon from "./file-tree-icon.svelte";
  import FileTreeName from "./file-tree-name.svelte";

  type FileTreeFileProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    name: string;
    path: string;
    icon?: Snippet;
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    name,
    path,
    icon,
    children,
    class: className,
    ...restProps
  }: FileTreeFileProps = $props();

  const fileTree = getFileTree();
  const isSelected = $derived(fileTree.isSelected(path));

  function handleClick() {
    fileTree.selectPath(path);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileTree.selectPath(path);
    }
  }
</script>

<div
  bind:this={ref}
  data-slot="file-tree-file"
  role="treeitem"
  tabindex={0}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  class={cn(
    "hover:bg-muted/50 flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors",
    isSelected && "bg-muted",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    <span class="size-4 shrink-0"></span>
    <FileTreeIcon>
      {#if icon}
        {@render icon?.()}
      {:else}
        <FileIcon class="text-muted-foreground size-4" />
      {/if}
    </FileTreeIcon>
    <FileTreeName>{name}</FileTreeName>
  {/if}
</div>
