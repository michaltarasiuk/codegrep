<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { cn, type WithElementRef } from "$lib/utils/cn.js";

  import {
    SIDEBAR_COOKIE_MAX_AGE,
    SIDEBAR_COOKIE_NAME,
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
  } from "./constants.js";
  import { setSidebar } from "./context.svelte.js";

  function noopOpenChange() {
    return undefined;
  }

  let {
    ref = $bindable(null),
    open = $bindable(true),
    onopenchange = noopOpenChange,
    children,
    class: className,
    style,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    open?: boolean;
    onopenchange?: (open: boolean) => void;
  } = $props();

  function readOpen() {
    return open;
  }

  function setOpen(value: boolean) {
    open = value;
    onopenchange(value);

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }

  const sidebar = setSidebar({
    open: readOpen,
    setOpen,
  });
</script>

<svelte:window onkeydown={sidebar.handleShortcutKeydown} />

<Tooltip.Provider delayDuration={0}>
  <div
    data-slot="sidebar-wrapper"
    style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style}"
    class={cn(
      "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-svh w-full",
      className
    )}
    bind:this={ref}
    {...restProps}
  >
    {@render children?.()}
  </div>
</Tooltip.Provider>
