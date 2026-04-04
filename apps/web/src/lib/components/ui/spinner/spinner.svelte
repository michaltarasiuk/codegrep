<script lang="ts">
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import Loader2Icon from "@lucide/svelte/icons/loader-2";
  import type { ComponentProps } from "svelte";

  import { cn } from "$lib/utils/cn.js";

  type SpinnerVariant = "lines" | "arcs";

  let {
    class: className,
    variant = "lines",
    ...restProps
  }: ComponentProps<typeof LoaderIcon> & {
    variant?: SpinnerVariant;
  } = $props();

  const Icon = $derived(variant === "arcs" ? Loader2Icon : LoaderIcon);
</script>

<Icon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
