<script lang="ts">
  import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
  import type { ComponentProps } from "svelte";

  import { Button } from "../button/index.js";
  import { cn } from "../cn.js";
  import { getSidebar } from "./context.svelte.js";

  let {
    ref = $bindable(null),
    onclick,
    class: className,
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
  } = $props();

  let sidebar = getSidebar();
</script>

<Button
  {ref}
  type="button"
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  variant="ghost"
  size="icon"
  class={cn("size-7", className)}
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  {...restProps}
>
  <PanelLeftIcon />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
