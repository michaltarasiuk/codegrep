<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { SvelteSet } from "svelte/reactivity";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import { setFileTree } from "./file-tree-context.svelte.js";

  type FileTreeProps = Omit<
    WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "onselect"
  > & {
    expanded?: Set<string>;
    defaultExpanded?: Set<string>;
    selectedPath?: string;
    onSelect?: (path: string) => void;
    onExpandedChange?: (expanded: Set<string>) => void;
  };

  let {
    ref = $bindable(null),
    defaultExpanded = new SvelteSet<string>(),
    expanded = $bindable(new SvelteSet(defaultExpanded)),
    selectedPath,
    onSelect,
    onExpandedChange,
    children,
    class: className,
    ...restProps
  }: FileTreeProps = $props();

  setFileTree({
    readExpandedPaths: () => expanded,
    writeExpandedPaths: (value) => {
      expanded = value;
    },
    readSelectedPath: () => selectedPath,
    readOnSelect: () => onSelect,
    readOnExpandedChange: () => onExpandedChange,
  });
</script>

<div
  bind:this={ref}
  data-slot="file-tree"
  role="tree"
  class={cn("bg-background rounded-lg border font-mono text-sm", className)}
  {...restProps}
>
  <div class="p-2">
    {@render children?.()}
  </div>
</div>
