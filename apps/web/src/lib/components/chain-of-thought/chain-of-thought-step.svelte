<script lang="ts">
  import DotIcon from "@lucide/svelte/icons/dot";
  import type { Component, Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { tv, type VariantProps } from "tailwind-variants";

  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  let stepVariants = tv({
    base: "fade-in-0 slide-in-from-top-2 animate-in flex gap-2 text-sm",
    variants: {
      status: {
        active: "text-foreground",
        complete: "text-muted-foreground",
        pending: "text-muted-foreground/50",
      },
    },
    defaultVariants: {
      status: "complete",
    },
  });

  type Status = VariantProps<typeof stepVariants>["status"];

  let {
    ref = $bindable(null),
    icon: Icon = DotIcon,
    label,
    description,
    status = "complete",
    children,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    icon?: Component<{ class?: string }>;
    label: Snippet;
    description?: Snippet;
    status?: Status;
    children?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  class={cn(stepVariants({ status }), className)}
  {...restProps}
>
  <div class="relative mt-0.5">
    <Icon class="size-4" />
    <div class="bg-border absolute top-7 bottom-0 left-1/2 -mx-px w-px"></div>
  </div>
  <div class="flex-1 space-y-2 overflow-hidden">
    <div>{@render label()}</div>
    {#if description}
      <div class="text-muted-foreground text-xs">
        {@render description()}
      </div>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
