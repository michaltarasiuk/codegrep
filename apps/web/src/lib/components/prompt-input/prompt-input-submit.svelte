<script lang="ts">
  import CornerDownLeftIcon from "@lucide/svelte/icons/corner-down-left";
  import SquareIcon from "@lucide/svelte/icons/square";
  import XIcon from "@lucide/svelte/icons/x";
  import type { ChatStatus } from "ai";
  import type { ComponentProps } from "svelte";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { isDefined } from "$lib/utils/is-defined";

  import { getPromptInputController } from "./prompt-input-context.svelte";

  let {
    variant = "default",
    size = "icon-sm",
    status,
    onstop,
    onclick,
    children,
    ...restProps
  }: ComponentProps<typeof InputGroup.Button> & {
    status?: ChatStatus;
    onstop?: () => void;
    onclick?: (e: MouseEvent) => void;
  } = $props();

  const controller = getPromptInputController();

  const isGenerating = $derived(
    status === "submitted" || status === "streaming"
  );
  const isDisabled = $derived(
    isDefined(controller)
      ? !controller.textInput.value.trim().length &&
          !controller.attachments.files.length
      : false
  );

  function handleClick(e: MouseEvent) {
    onclick?.(e);
    if (isGenerating) {
      e.preventDefault();
      onstop?.();
    }
  }
</script>

<InputGroup.Button
  type={isGenerating && onstop ? "button" : "submit"}
  aria-label={isGenerating ? "Stop" : "Submit"}
  {variant}
  {size}
  disabled={isDisabled}
  onclick={handleClick}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else if status === "submitted"}
    <Spinner />
  {:else if status === "streaming"}
    <SquareIcon class="size-4" />
  {:else if status === "error"}
    <XIcon class="size-4" />
  {:else}
    <CornerDownLeftIcon class="size-4" />
  {/if}
</InputGroup.Button>
