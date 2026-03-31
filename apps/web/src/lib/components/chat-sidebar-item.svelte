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

  interface Props {
    chat: {
      id: string;
      title: string;
      shareId: string | null;
    };
    onRename: () => void;
    onShare: () => void;
    onDelete: () => void;
  }

  const { chat, onRename, onShare, onDelete }: Props = $props();

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
      <DropdownMenu.Item onSelect={() => onRename()}>
        <PencilIcon />
        Rename
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={() => onShare()}>
        {#if isDefined(chat.shareId)}
          <LockOpenIcon />
        {:else}
          <LockIcon />
        {/if}
        Share
      </DropdownMenu.Item>
      <DropdownMenu.Item variant="destructive" onSelect={() => onDelete()}>
        <TrashIcon />
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>
