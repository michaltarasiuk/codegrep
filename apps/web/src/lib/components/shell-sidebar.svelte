<script lang="ts">
  import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import TrashIcon from "@lucide/svelte/icons/trash-2";
  import type { Snippet } from "svelte";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import ThemeToggle from "./theme-toggle.svelte";
  import UserAccountMenu from "./user-account-menu.svelte";

  interface Props {
    children: Snippet;
    chatList?: {
      id: string;
      title: string;
    }[];
  }

  const { children, chatList }: Props = $props();
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
      <Sidebar.Menu>
        {#each chatList as chat (chat.id)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              tooltipContent={chat.title}
              isActive={page.params.id === chat.id}
              onclick={() => goto(resolve(`/chat/${chat.id}`))}
            >
              <span class="truncate">{chat.title}</span>
            </Sidebar.MenuButton>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuAction {...props} showOnHover>
                    <MoreHorizontalIcon />
                  </Sidebar.MenuAction>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="right" align="end" sideOffset={4}>
                <DropdownMenu.Item>
                  <PencilIcon />
                  Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item variant="destructive">
                  <TrashIcon />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
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
