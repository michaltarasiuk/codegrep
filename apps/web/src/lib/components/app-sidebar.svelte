<script lang="ts">
  import PlusIcon from "@lucide/svelte/icons/plus";
  import type { Snippet } from "svelte";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { groupChatsByPeriod } from "$lib/utils/group-chats-by-period";
  import { isDefined } from "$lib/utils/is-defined";

  import ChatDeleteDialog from "./chat-delete-dialog.svelte";
  import ChatSidebarItem from "./chat-sidebar-item.svelte";
  import ChatTitleDialog from "./chat-title-dialog.svelte";
  import ThemeToggle from "./theme-toggle.svelte";
  import UserAccountMenu from "./user-account-menu.svelte";

  interface Props {
    children: Snippet;
    chatList?: {
      id: string;
      title: string;
      updatedAt: Date;
    }[];
  }

  const { children, chatList = [] }: Props = $props();

  const groupedChats = $derived(groupChatsByPeriod(chatList));

  let renamingChat = $state<{ id: string; title: string } | null>(null);
  let deletingChat = $state<{ id: string } | null>(null);
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <Sidebar.Root variant="inset">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton onclick={() => goto(resolve("/chat"))}>
            <PlusIcon />
            New chat
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
      {#each groupedChats.filter((group) => !!group.chats.length) as group (group.period)}
        <Sidebar.Group>
          <Sidebar.GroupLabel>{group.period}</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each group.chats as chat (chat.id)}
                <ChatSidebarItem
                  {chat}
                  onRename={() => (renamingChat = chat)}
                  onDelete={() => (deletingChat = chat)}
                />
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      {/each}
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <UserAccountMenu />
        <ThemeToggle />
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header
      class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Sidebar.Trigger class="-ms-1" />
      </div>
    </header>
    <div class="flex min-h-0 flex-1 flex-col">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

{#if isDefined(renamingChat)}
  <ChatTitleDialog
    id={renamingChat.id}
    title={renamingChat.title}
    onClose={() => (renamingChat = null)}
  />
{/if}

{#if isDefined(deletingChat)}
  <ChatDeleteDialog
    id={deletingChat.id}
    onClose={() => (deletingChat = null)}
  />
{/if}
