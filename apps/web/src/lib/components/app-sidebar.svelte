<script lang="ts">
  import PlusIcon from "@lucide/svelte/icons/plus";
  import type { Snippet } from "svelte";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { groupChatsByPeriod } from "$lib/utils/group-chats-by-period.js";

  import ChatSidebarItem from "./chat-sidebar-item.svelte";
  import ThemeToggle from "./theme-toggle.svelte";
  import UserAccountMenu from "./user-account-menu.svelte";

  interface Props {
    children: Snippet;
    chatList?: {
      id: string;
      title: string;
      shareId: string | null;
      updatedAt: Date;
    }[];
  }

  const { children, chatList = [] }: Props = $props();

  const groupedChats = $derived(groupChatsByPeriod(chatList));
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
      {#each groupedChats as group (group.period)}
        {#if !!group.chats.length}
          <Sidebar.Group>
            <Sidebar.GroupLabel>{group.period}</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {#each group.chats as chat (chat.id)}
                  <ChatSidebarItem {chat} />
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        {/if}
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
