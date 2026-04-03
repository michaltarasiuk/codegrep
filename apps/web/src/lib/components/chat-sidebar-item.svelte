<script lang="ts">
  import LockIcon from "@lucide/svelte/icons/lock";
  import LockOpenIcon from "@lucide/svelte/icons/lock-open";
  import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import TrashIcon from "@lucide/svelte/icons/trash-2";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { isDefined } from "$lib/utils/is-defined";

  import ChatDeleteDialog from "./chat-delete-dialog.svelte";
  import ChatTitleDialog from "./chat-title-dialog.svelte";

  interface Props {
    chat: {
      id: string;
      title: string;
      shareId: string | null;
    };
  }

  const { chat }: Props = $props();

  let chatTitleDialogOpen = $state(false);
  let chatDeleteDialogOpen = $state(false);

  const route = $derived(`/chat/${chat.id}` as const);
  const isActive = $derived(page.url.pathname === route);
</script>

<Sidebar.MenuItem>
  <Sidebar.MenuButton
    tooltipContent={chat.title}
    {isActive}
    onclick={() => goto(resolve(route))}
  >
    <span class="truncate">{chat.title}</span>
  </Sidebar.MenuButton>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Sidebar.MenuAction {...props} showOnHover={!isActive}>
          <MoreHorizontalIcon />
        </Sidebar.MenuAction>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right" align="end" sideOffset={4}>
      <DropdownMenu.Item onclick={() => (chatTitleDialogOpen = true)}>
        <PencilIcon />
        Rename
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        {#if isDefined(chat.shareId)}
          <LockOpenIcon />
        {:else}
          <LockIcon />
        {/if}
        Share
      </DropdownMenu.Item>
      <DropdownMenu.Item
        variant="destructive"
        onclick={() => (chatDeleteDialogOpen = true)}
      >
        <TrashIcon />
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>

<ChatTitleDialog
  {chat}
  open={chatTitleDialogOpen}
  onClose={() => (chatTitleDialogOpen = false)}
/>

<ChatDeleteDialog
  {chat}
  open={chatDeleteDialogOpen}
  onClose={() => (chatDeleteDialogOpen = false)}
/>
