<script lang="ts">
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";
  import { mode, toggleMode } from "mode-watcher";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  let isDark = $state(false);

  $effect(() => {
    const unsub = mode.subscribe((value) => {
      isDark = value === "dark";
    });
    return unsub;
  });
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton onclick={toggleMode}>
      {#if isDark}
        <SunIcon />
        Light mode
      {:else}
        <MoonIcon />
        Dark mode
      {/if}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
