<script lang="ts">
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";
  import { toggleMode } from "mode-watcher";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>

<Sidebar.MenuItem>
  <Sidebar.MenuButton onclick={toggleMode}>
    <span class="hidden items-center gap-2 dark:inline-flex">
      <SunIcon class="size-4" />
      Light mode
    </span>
    <span class="inline-flex items-center gap-2 dark:hidden">
      <MoonIcon class="size-4" />
      Dark mode
    </span>
  </Sidebar.MenuButton>
</Sidebar.MenuItem>
