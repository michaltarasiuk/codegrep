<script lang="ts">
  import MoonIcon from "@lucide/svelte/icons/moon";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import SunIcon from "@lucide/svelte/icons/sun";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserCircleIcon from "@tabler/icons-svelte/icons/user-circle";
  import { mode, toggleMode } from "mode-watcher";
  import * as Command from "$lib/components/ui/command/index.js";

  let open = $state(false);
  let isDark = $state(false);

  $effect(() => {
    const unsub = mode.subscribe((value) => {
      isDark = value === "dark";
    });
    return unsub;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }

  function run(command: () => void) {
    command();
    open = false;
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Navigation">
      <Command.Item
        value="new-chat"
        keywords={["chat", "new"]}
        onSelect={() => run(() => {})}
      >
        <PlusIcon />
        <span>New chat</span>
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Account">
      <Command.Item
        value="account"
        keywords={["account", "profile", "user"]}
        onSelect={() => run(() => {})}
      >
        <UserCircleIcon />
        <span>Account</span>
      </Command.Item>
      <Command.Item
        value="log-out"
        keywords={["logout", "log out", "sign out"]}
        onSelect={() => run(() => {})}
      >
        <LogoutIcon />
        <span>Log out</span>
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="View">
      <Command.Item
        value="toggle-theme"
        keywords={["theme", "dark", "light", "mode"]}
        onSelect={() => run(toggleMode)}
      >
        {#if isDark}
          <SunIcon />
          <span>Switch to light mode</span>
        {:else}
          <MoonIcon />
          <span>Switch to dark mode</span>
        {/if}
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
