import type { CSSObject } from "@emotion/serialize";
import type {
  FileContents,
  FileOptions,
  GetHoveredLineResult,
  LineAnnotation,
  SelectedLineRange,
  VirtualFileMetrics,
} from "@pierre/diffs";
import type { Snippet } from "svelte";

type HoveredLineGetter = () => GetHoveredLineResult<"file"> | undefined;

export interface FileProps<LAnnotation> {
  file: FileContents;
  options?: FileOptions<LAnnotation>;
  metrics?: VirtualFileMetrics;
  lineAnnotations?: LineAnnotation<LAnnotation>[];
  /** When omitted, the instance does not call `setSelectedLines`. */
  selectedLines?: SelectedLineRange | null;
  renderAnnotation?: Snippet<[LineAnnotation<LAnnotation>]>;
  renderCustomHeader?: Snippet<[FileContents]>;
  renderHeaderPrefix?: Snippet<[FileContents]>;
  renderHeaderMetadata?: Snippet<[FileContents]>;
  renderGutterUtility?: Snippet<[HoveredLineGetter]>;
  /**
   * @deprecated Use `renderGutterUtility` instead.
   */
  renderHoverUtility?: Snippet<[HoveredLineGetter]>;
  prerenderedHTML?: string;
  disableWorkerPool?: boolean;
  style?: CSSObject;
  className?: string;
}
