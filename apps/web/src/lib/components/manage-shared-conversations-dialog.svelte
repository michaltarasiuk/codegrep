<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import LinkIcon from "@lucide/svelte/icons/link";
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { Button } from "@workspace/ui/button/index.js";
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import * as Empty from "@workspace/ui/empty/index.js";
  import { Spinner } from "@workspace/ui/spinner/index.js";
  import * as Table from "@workspace/ui/table/index.js";

  import { invalidate } from "$app/navigation";
  import CopyToClipboard from "$lib/components/copy-to-clipboard.svelte";
  import { client } from "$lib/utils/client.js";
  import { formatDate } from "$lib/utils/format-date.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";
  import { getShareLink } from "$lib/utils/share-link.js";

  interface SharedChat {
    id: string;
    title: string;
    shareId: string;
    updatedAt: Date;
  }

  let { open, onClose }: { open: boolean; onClose: () => void } = $props();

  let sharedChats = $state<SharedChat[]>([]);
  let confirmingUnshareAll = $state(false);
  let loading = $state(true);
  let unsharing = $state(false);

  $effect(() => {
    if (open) {
      fetchSharedChats();
    }
  });

  async function fetchSharedChats() {
    try {
      loading = true;
      let result = await client.api.chat.get();
      if (isDefined(result.data)) {
        sharedChats = result.data.filter((chat): chat is SharedChat =>
          isDefined(chat.shareId)
        );
      }
    } finally {
      loading = false;
    }
  }

  async function unshareAll() {
    try {
      unsharing = true;
      let result = await client.api.chat["unshare-all"].put();
      if (!isDefined(result.error)) {
        sharedChats = [];
        confirmingUnshareAll = false;
        await invalidate(CHAT_LIST_KEY);
      }
    } finally {
      unsharing = false;
    }
  }
</script>

<Dialog.Root
  {open}
  onOpenChange={(open) => {
    if (!open) {
      onClose();
    }
  }}
  onOpenChangeComplete={(open) => {
    if (!open) {
      loading = true;
      confirmingUnshareAll = false;
    }
  }}
>
  <Dialog.Content class="sm:max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>Manage shared conversations</Dialog.Title>
    </Dialog.Header>

    {#if loading}
      <Empty.Root>
        <Empty.Media>
          <Spinner class="size-4.5" />
        </Empty.Media>
        <Empty.Title>Loading shared conversations</Empty.Title>
        <Empty.Description>
          Your shared conversations will appear here.
        </Empty.Description>
      </Empty.Root>
    {:else if sharedChats.length === 0}
      <Empty.Root>
        <Empty.Media>
          <LinkIcon class="size-4.5" />
        </Empty.Media>
        <Empty.Title>No shared conversations</Empty.Title>
        <Empty.Description>
          Your shared conversations will appear here.
        </Empty.Description>
      </Empty.Root>
    {:else}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Chat</Table.Head>
            <Table.Head>Last updated</Table.Head>
            <Table.Head class="w-20"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each sharedChats as chat (chat.id)}
            <Table.Row>
              <Table.Cell class="font-medium">{chat.title}</Table.Cell>
              <Table.Cell class="text-muted-foreground">
                {formatDate(chat.updatedAt)}
              </Table.Cell>
              <Table.Cell>
                <div class="flex items-center justify-end gap-1">
                  <CopyToClipboard text={getShareLink(chat.shareId!)}>
                    {#snippet children(copy, copied)}
                      <Button variant="ghost" size="icon-xs" onclick={copy}>
                        {#if copied}
                          <CheckIcon class="size-3.5" />
                        {:else}
                          <CopyIcon class="size-3.5" />
                        {/if}
                        <span class="sr-only">Copy link</span>
                      </Button>
                    {/snippet}
                  </CopyToClipboard>
                </div>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>

      <Dialog.Footer
        class="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        {#if confirmingUnshareAll}
          <div class="text-destructive text-sm">
            {#if sharedChats.length > 1}
              Are you sure you want to unshare all {sharedChats.length} conversations?
            {:else}
              Are you sure you want to unshare this conversation?
            {/if}
          </div>
        {:else}
          <div></div>
        {/if}

        <div class="flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            disabled={unsharing}
            onclick={() => {
              if (confirmingUnshareAll) {
                unshareAll();
              } else {
                confirmingUnshareAll = true;
              }
            }}
          >
            Unshare all
          </Button>
          {#if confirmingUnshareAll}
            <Button
              variant="outline"
              disabled={unsharing}
              onclick={() => (confirmingUnshareAll = false)}
            >
              Cancel
            </Button>
          {/if}
        </div>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>
