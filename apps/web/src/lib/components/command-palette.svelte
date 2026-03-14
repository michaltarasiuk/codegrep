<script lang="ts">
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import SunIcon from "@lucide/svelte/icons/sun";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserCircleIcon from "@tabler/icons-svelte/icons/user-circle";
  import { mode, toggleMode } from "mode-watcher";

  import { goto, invalidate } from "$app/navigation";
  import { resolve } from "$app/paths";
  import * as Command from "$lib/components/ui/command/index.js";
  import { authClient } from "$lib/utils/client";

  const session = authClient.useSession();

  let isOpen = $state(false);
  let isDarkMode = $state(false);

  $effect(() => {
    const unsubscribe = mode.subscribe((value) => {
      isDarkMode = value === "dark";
    });
    return unsubscribe;
  });

  function handleCommandShortcut(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      isOpen = !isOpen;
    }
  }

  function executeAndClose(command: () => void) {
    command();
    isOpen = false;
  }

  async function signInWithGitHub() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.href,
    });
  }

  async function signOut() {
    await authClient.signOut();
    await invalidate("app:chat-list");
    await goto(resolve("/chat"));
  }
</script>

<svelte:document onkeydown={handleCommandShortcut} />

<Command.Dialog bind:open={isOpen}>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Navigation">
      <Command.Item
        value="new-chat"
        keywords={["chat", "new"]}
        onSelect={() => executeAndClose(() => void goto(resolve("/chat")))}
      >
        <PlusIcon />
        <span>New chat</span>
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Account">
      {#if $session.data}
        <Command.Item
          value="account"
          keywords={["account", "profile", "user"]}
          onSelect={() => executeAndClose(() => {})}
        >
          <UserCircleIcon />
          <span>Account</span>
        </Command.Item>
        <Command.Item
          value="log-out"
          keywords={["logout", "log out", "sign out"]}
          onSelect={() => executeAndClose(() => signOut())}
        >
          <LogoutIcon />
          <span>Log out</span>
        </Command.Item>
      {:else}
        <Command.Item
          value="sign-in"
          keywords={["login", "log in", "sign in", "github"]}
          onSelect={() => executeAndClose(() => signInWithGitHub())}
        >
          <LogInIcon />
          <span>Sign in</span>
        </Command.Item>
      {/if}
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="View">
      <Command.Item
        value="toggle-theme"
        keywords={["theme", "dark", "light", "mode"]}
        onSelect={() => executeAndClose(() => toggleMode())}
      >
        {#if isDarkMode}
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
