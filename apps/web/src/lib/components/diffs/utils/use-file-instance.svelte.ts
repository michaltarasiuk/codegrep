import {
  areOptionsEqual,
  File,
  type FileContents,
  type FileOptions,
  type GetHoveredLineResult,
  type LineAnnotation,
  type SelectedLineRange,
  type VirtualFileMetrics,
  VirtualizedFile,
} from "@pierre/diffs";

import { isDefined } from "$lib/utils/is-defined.js";

import { noopRender } from "../constants.js";
import { getOptionalVirtualizer } from "../virtualizer.context.js";
import { getWorkerPool } from "../worker-pool.context.js";

interface UseFileInstanceProps<LAnnotation> {
  file: FileContents;
  options: FileOptions<LAnnotation> | undefined;
  lineAnnotations: LineAnnotation<LAnnotation>[] | undefined;
  selectedLines: SelectedLineRange | null | undefined;
  prerenderedHTML: string | undefined;
  metrics?: VirtualFileMetrics;
  hasGutterRenderUtility: boolean;
  hasCustomHeader: boolean;
  disableWorkerPool: boolean;
}

export function useFileInstance<LAnnotation>(
  getProps: () => UseFileInstanceProps<LAnnotation>
) {
  const virtualizer = getOptionalVirtualizer();
  const poolManager = getWorkerPool();

  let instance = $state<
    File<LAnnotation> | VirtualizedFile<LAnnotation> | null
  >(null);

  function ref(node: HTMLElement | null) {
    const props = getProps();

    if (isDefined(node)) {
      if (isDefined(instance)) {
        throw new Error(
          "File: An instance should not already exist when a node is created"
        );
      }

      const mergedOptions = mergeFileOptions({
        hasCustomHeader: props.hasCustomHeader,
        hasGutterRenderUtility: props.hasGutterRenderUtility,
        options: props.options,
      });

      if (isDefined(virtualizer)) {
        instance = new VirtualizedFile(
          mergedOptions,
          virtualizer,
          props.metrics,
          !props.disableWorkerPool ? poolManager : undefined,
          true
        );
      } else {
        instance = new File(
          mergedOptions,
          !props.disableWorkerPool ? poolManager : undefined,
          true
        );
      }

      void instance.hydrate({
        file: props.file,
        fileContainer: node,
        lineAnnotations: props.lineAnnotations,
        prerenderedHTML: props.prerenderedHTML,
      });
    } else {
      if (!isDefined(instance)) {
        throw new Error("File: A File instance should exist when unmounting");
      }
      instance.cleanUp();
      instance = null;
    }
  }

  $effect(() => {
    const props = getProps();

    if (!isDefined(instance)) {
      return;
    }

    const newOptions = mergeFileOptions({
      hasCustomHeader: props.hasCustomHeader,
      hasGutterRenderUtility: props.hasGutterRenderUtility,
      options: props.options,
    });

    const forceRender = !areOptionsEqual(instance.options, newOptions);
    instance.setOptions(newOptions);

    void instance.render({
      file: props.file,
      lineAnnotations: props.lineAnnotations,
      forceRender,
    });

    if (isDefined(props.selectedLines)) {
      instance.setSelectedLines(props.selectedLines);
    }
  });

  function getHoveredLine(): GetHoveredLineResult<"file"> | undefined {
    return instance?.getHoveredLine();
  }

  return { ref, getHoveredLine };
}

interface MergeFileOptionsProps<LAnnotation> {
  options: FileOptions<LAnnotation> | undefined;
  hasGutterRenderUtility: boolean;
  hasCustomHeader: boolean;
}

function mergeFileOptions<LAnnotation>({
  options,
  hasCustomHeader,
  hasGutterRenderUtility,
}: MergeFileOptionsProps<LAnnotation>): FileOptions<LAnnotation> | undefined {
  if (hasGutterRenderUtility || hasCustomHeader) {
    return {
      ...options,
      ...(hasCustomHeader && { renderCustomHeader: noopRender }),
      ...(hasGutterRenderUtility && { renderGutterUtility: noopRender }),
    };
  }
  return options;
}
