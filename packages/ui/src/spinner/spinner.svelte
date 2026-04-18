<script lang="ts">
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import Loader2Icon from "@lucide/svelte/icons/loader-2";
  import type { ComponentProps } from "svelte";

  import { cn } from "../cn.js";

  type SpinnerVariant = "default" | "classic";

  let {
    class: className,
    variant = "default",
    ...restProps
  }: ComponentProps<typeof Loader2Icon> & {
    variant?: SpinnerVariant;
  } = $props();

  let Icon = $derived(variant === "classic" ? LoaderIcon : Loader2Icon);
</script>

<Icon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
