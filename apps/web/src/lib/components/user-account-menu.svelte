<script lang="ts">
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import DotsVerticalIcon from "@tabler/icons-svelte/icons/dots-vertical";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserCircleIcon from "@tabler/icons-svelte/icons/user-circle";

  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { authClient } from "$lib/utils/auth-client";

  const session = authClient.useSession();
  const sidebar = Sidebar.useSidebar();

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

{#if $session.data?.user}
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Sidebar.MenuButton
          size="lg"
          class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar.Root class="size-8 rounded-lg grayscale">
            <Avatar.Image
              src={$session.data.user.image}
              alt={$session.data.user.name}
            />
            <Avatar.Fallback class="rounded-lg" />
          </Avatar.Root>
          <div class="grid flex-1 text-start text-sm leading-tight">
            <span class="truncate font-medium">{$session.data.user.name}</span>
            <span class="text-muted-foreground truncate text-xs">
              {$session.data.user.email}
            </span>
          </div>
          <DotsVerticalIcon class="ms-auto size-4" />
        </Sidebar.MenuButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        side={sidebar.isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image
                src={$session.data.user.image}
                alt={$session.data.user.name}
              />
              <Avatar.Fallback class="rounded-lg" />
            </Avatar.Root>
            <div class="grid flex-1 text-start text-sm leading-tight">
              <span class="truncate font-medium">
                {$session.data.user.name}
              </span>
              <span class="text-muted-foreground truncate text-xs">
                {$session.data.user.email}
              </span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <UserCircleIcon />
            Account
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={signOut}>
          <LogoutIcon />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
{:else}
  <Sidebar.MenuItem>
    <Sidebar.MenuButton size="lg" onclick={signInWithGithub}>
      <LogInIcon />
      <div class="grid flex-1 text-start text-sm leading-tight">
        <span class="truncate font-medium">Sign in to save chats</span>
        <span class="text-muted-foreground truncate text-xs">
          Keep your history across devices
        </span>
      </div>
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
{/if}
