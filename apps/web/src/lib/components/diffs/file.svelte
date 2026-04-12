<script lang="ts" generics="LAnnotation">
  import { serializeStyles } from "@emotion/serialize";
  import {
    CUSTOM_HEADER_SLOT_ID,
    DIFFS_TAG_NAME,
    getLineAnnotationName,
    HEADER_METADATA_SLOT_ID,
    HEADER_PREFIX_SLOT_ID,
  } from "@pierre/diffs";

  import { isDefined } from "$lib/utils/is-defined.js";

  import { GUTTER_UTILITY_SLOT_STYLES } from "./constants.js";
  import type { FileProps } from "./types.js";
  import { useFileInstance } from "./utils/use-file-instance.svelte.js";

  let {
    file,
    lineAnnotations,
    selectedLines,
    options,
    metrics,
    className,
    style,
    renderAnnotation,
    renderCustomHeader,
    renderHeaderPrefix,
    renderHeaderMetadata,
    prerenderedHTML,
    renderGutterUtility,
    renderHoverUtility,
    disableWorkerPool = false,
  }: FileProps<LAnnotation> = $props();

  const { ref, getHoveredLine } = useFileInstance(() => ({
    file,
    options,
    metrics,
    lineAnnotations,
    selectedLines,
    prerenderedHTML,
    hasGutterRenderUtility:
      isDefined(renderGutterUtility) || isDefined(renderHoverUtility),
    hasCustomHeader: isDefined(renderCustomHeader),
    disableWorkerPool,
  }));

  const gutterUtility = $derived(renderGutterUtility ?? renderHoverUtility);
</script>

<svelte:element this={DIFFS_TAG_NAME} use:ref class={className} {style}>
  {#if typeof window === "undefined" && isDefined(prerenderedHTML)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- prerenderedHTML is generated server-side by @pierre/diffs, not user input -->
    {@html prerenderedHTML}
  {/if}

  {#if isDefined(renderCustomHeader)}
    <template data-slot={CUSTOM_HEADER_SLOT_ID}>
      {@render renderCustomHeader(file)}
    </template>
  {:else}
    {#if isDefined(renderHeaderPrefix)}
      <template data-slot={HEADER_PREFIX_SLOT_ID}>
        {@render renderHeaderPrefix(file)}
      </template>
    {/if}
    {#if isDefined(renderHeaderMetadata)}
      <template data-slot={HEADER_METADATA_SLOT_ID}>
        {@render renderHeaderMetadata(file)}
      </template>
    {/if}
  {/if}

  {#if isDefined(renderAnnotation) && isDefined(lineAnnotations)}
    {#each lineAnnotations as annotation, index (index)}
      <template data-slot={getLineAnnotationName(annotation)}>
        {@render renderAnnotation(annotation)}
      </template>
    {/each}
  {/if}

  {#if isDefined(gutterUtility)}
    <template
      data-slot="gutter-utility"
      style={serializeStyles([GUTTER_UTILITY_SLOT_STYLES]).styles}
    >
      {@render gutterUtility(getHoveredLine)}
    </template>
  {/if}
</svelte:element>
