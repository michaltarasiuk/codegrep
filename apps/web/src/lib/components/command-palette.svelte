<script lang="ts">
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import SunIcon from "@lucide/svelte/icons/sun";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserCircleIcon from "@tabler/icons-svelte/icons/user-circle";
  import { mode, toggleMode } from "mode-watcher";

  import * as Command from "$lib/components/ui/command/index.js";
  import { authClient } from "$lib/utils/auth-client";

  const session = authClient.useSession();

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

  async function signInWithGithub() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.href,
    });
  }

  async function signOut() {
    await authClient.signOut();
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    {#if $session.data?.user}
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
    {/if}
    <Command.Group heading="Account">
      {#if $session.data?.user}
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
          onSelect={() => run(() => signOut())}
        >
          <LogoutIcon />
          <span>Log out</span>
        </Command.Item>
      {:else}
        <Command.Item
          value="sign-in"
          keywords={["login", "log in", "sign in", "github"]}
          onSelect={() => run(() => signInWithGithub())}
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
