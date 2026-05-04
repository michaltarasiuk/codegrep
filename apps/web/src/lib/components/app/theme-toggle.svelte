<script lang="ts">
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";
  import * as Sidebar from "@workspace/ui/sidebar/index.js";
  import { toggleMode } from "mode-watcher";
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
