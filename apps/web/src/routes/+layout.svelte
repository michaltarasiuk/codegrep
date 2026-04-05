<script lang="ts">
  import "$styles/global.css";

  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";

  import { dev } from "$app/environment";
  import AppCommand from "$lib/components/app-command.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";

  let { children, data } = $props();

  onMount(() => {
    if (dev) {
      void import("react-grab");
    }
  });
</script>

<AppSidebar chatList={data.chatList}>
  {@render children()}
</AppSidebar>
<AppCommand />

<ModeWatcher />
