<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import MinusIcon from "@lucide/svelte/icons/minus";
  import { Checkbox as CheckboxPrimitive } from "bits-ui";

  import { cn, type WithoutChildrenOrChild } from "../cn.js";

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
  bind:ref
  bind:checked
  bind:indeterminate
  data-slot="checkbox"
  class={cn(
    "border-input dark:bg-input-muted data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 peer relative flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
    className
  )}
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <div
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none [&>svg]:size-3"
    >
      {#if checked}
        <CheckIcon class="text-current" />
      {:else if indeterminate}
        <MinusIcon class="text-current" />
      {/if}
    </div>
  {/snippet}
</CheckboxPrimitive.Root>
