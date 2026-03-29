import { getContext, setContext } from "svelte";
import { SvelteSet } from "svelte/reactivity";

import { isDefined } from "$lib/utils/is-defined.js";

interface FileTreeStateProps {
  readExpandedPaths: () => Set<string>;
  writeExpandedPaths: (value: Set<string>) => void;
  readSelectedPath: () => string | null;
  readOnSelect: () => ((path: string) => void) | null;
  readOnExpandedChange: () => ((expanded: Set<string>) => void) | null;
}

class FileTreeState {
  readonly props: FileTreeStateProps;

  constructor(props: FileTreeStateProps) {
    this.props = props;
  }

  get expandedPaths() {
    return this.props.readExpandedPaths();
  }

  get selectedPath() {
    return this.props.readSelectedPath();
  }

  togglePath = (path: string) => {
    const next = new SvelteSet(this.expandedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    this.props.writeExpandedPaths(next);
    this.props.readOnExpandedChange()?.(next);
  };

  selectPath = (path: string) => {
    this.props.readOnSelect()?.(path);
  };

  isExpanded = (path: string) => {
    return this.expandedPaths.has(path);
  };

  isSelected = (path: string) => {
    return this.selectedPath === path;
  };
}

const FILE_TREE_KEY = Symbol.for("scn-file-tree");

export function getFileTree() {
  const value = getContext<FileTreeState | null>(FILE_TREE_KEY);
  if (!isDefined(value)) {
    throw new Error("Missing file tree context");
  }
  return value;
}

export function setFileTree(props: FileTreeStateProps) {
  return setContext(FILE_TREE_KEY, new FileTreeState(props));
}
