<script lang="ts">
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import NotebookPenIcon from "@lucide/svelte/icons/notebook-pen";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import SunIcon from "@lucide/svelte/icons/sun";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import { mode, toggleMode } from "mode-watcher";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import * as Command from "$lib/components/ui/command/index.js";
  import { authClient } from "$lib/utils/client";

  import PersonalInstructionsDialog from "./personal-instructions-dialog.svelte";

  const session = authClient.useSession();

  let open = $state(false);
  let personalInstructionsOpen = $state(false);
  let darkMode = $state(false);

  $effect(() => {
    const unsubscribe = mode.subscribe((value) => {
      darkMode = value === "dark";
    });
    return unsubscribe;
  });

  function handleCommandShortcut(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }

  function executeAndClose(command: () => void) {
    command();
    open = false;
  }

  function gotoChat() {
    goto(resolve("/chat"));
  }

  function openPersonalInstructions() {
    personalInstructionsOpen = true;
  }

  function signInWithGitHub() {
    authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.href,
    });
  }

  async function signOut() {
    await authClient.signOut();
    await goto(resolve("/chat"), { invalidateAll: true });
  }
</script>

<svelte:document onkeydown={handleCommandShortcut} />

<Command.Dialog bind:open>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Navigation">
      <Command.Item
        value="new-chat"
        keywords={["chat", "new"]}
        onSelect={() => executeAndClose(() => gotoChat())}
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
          onSelect={() => executeAndClose(() => openPersonalInstructions())}
        >
          <NotebookPenIcon />
          <span>Personal instructions </span>
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
        {#if darkMode}
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

<PersonalInstructionsDialog
  open={personalInstructionsOpen}
  onClose={() => (personalInstructionsOpen = false)}
/>
