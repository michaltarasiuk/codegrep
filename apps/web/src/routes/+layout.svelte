<script lang="ts">
  import "$styles/global.css";

  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";

  import { dev } from "$app/environment";
  import ChatShell from "$lib/components/chat-shell.svelte";
  import CommandPalette from "$lib/components/command-palette.svelte";

  let { children, data } = $props();

  onMount(() => {
    if (dev) {
      void import("react-grab");
    }
  });
</script>

<CommandPalette />
<ChatShell chatList={data.chatList}>
  {@render children()}
</ChatShell>
<ModeWatcher />
