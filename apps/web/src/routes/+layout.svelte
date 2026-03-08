<script lang="ts">
  import "$styles/global.css";

  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";

  import { dev } from "$app/environment";
  import CommandPalette from "$lib/components/command-palette.svelte";
  import ShellSidebar from "$lib/components/shell-sidebar.svelte";

  let { children } = $props();

  onMount(() => {
    if (dev) {
      void import("react-grab");
    }
  });
</script>

<CommandPalette />
<ShellSidebar>
  {@render children()}
</ShellSidebar>
<ModeWatcher />
