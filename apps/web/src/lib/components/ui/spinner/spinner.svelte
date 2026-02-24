<script lang="ts">
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import type { ComponentProps } from "svelte";

  import { cn } from "$lib/utils/cn.js";

  let { class: className, ...restProps }: ComponentProps<typeof LoaderIcon> =
    $props();
</script>

<LoaderIcon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
