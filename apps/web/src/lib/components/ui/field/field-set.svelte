<script lang="ts">
  import type { HTMLFieldsetAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLFieldsetAttributes> = $props();
</script>

<fieldset
  bind:this={ref}
  data-slot="field-set"
  class={cn(
    "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</fieldset>
