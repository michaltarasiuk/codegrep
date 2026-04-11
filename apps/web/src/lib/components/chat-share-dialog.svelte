<script lang="ts">
  import LockOpenIcon from "@lucide/svelte/icons/lock-open";

  import { invalidate } from "$app/navigation";
  import { PUBLIC_WEB_URL } from "$env/static/public";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { client } from "$lib/utils/client.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys.js";
  import { isDefined } from "$lib/utils/is-defined.js";

  import Button from "./ui/button/button.svelte";

  let {
    chat,
    open,
    onClose,
  }: {
    chat: {
      id: string;
      shareId: string | null;
    };
    open: boolean;
    onClose: () => void;
  } = $props();

  let shareId = $derived(chat.shareId);
  let shareLink = $derived(`${PUBLIC_WEB_URL}/chat/share/${shareId}`);

  let sharing = $state(false);
  let unsharing = $state(false);
  let confirmingUnshare = $state(false);

  let loadingMessage = $derived(
    sharing ? "Sharing chat..." : unsharing ? "Unsharing chat..." : null
  );

  async function share() {
    try {
      sharing = true;
      const result = await client.api
        .chat({
          id: chat.id,
        })
        .share.put();
      if (!isDefined(result.error)) {
        await invalidate(CHAT_LIST_KEY);
      }
    } finally {
      sharing = false;
    }
  }

  async function unshare() {
    try {
      unsharing = true;
      const result = await client.api
        .chat({
          id: chat.id,
        })
        .unshare.put();
      if (!isDefined(result.error)) {
        onClose();
        await invalidate(CHAT_LIST_KEY);
      }
    } finally {
      unsharing = false;
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareLink);
  }
</script>

<Dialog.Root
  open={open && !isDefined(shareId)}
  onOpenChange={(open) => {
    if (!open) {
      onClose();
    }
  }}
  onOpenChangeComplete={(open) => {
    if (!open) {
      sharing = false;
      unsharing = false;
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Share chat</Dialog.Title>
      <Dialog.Description>
        When shared, this chat and future messages will be visible to anyone
        with the link. If private repository content is included, repository
        access is required to view.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer
      class="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {#if isDefined(loadingMessage)}
        <div class="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner variant="arcs" class="size-4 shrink-0" />
          <span>{loadingMessage}</span>
        </div>
      {:else}
        <div></div>
      {/if}

      <Button disabled={sharing || unsharing} onclick={share}>Share</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root
  open={open && isDefined(shareId)}
  onOpenChange={(open) => {
    if (!open) {
      onClose();
    }
  }}
  onOpenChangeComplete={(open) => {
    if (!open) {
      sharing = false;
      unsharing = false;
      confirmingUnshare = false;
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Chat shared</Dialog.Title>
      <Dialog.Description>
        This chat and future messages are visible to anyone with the link. If
        private repository content is included, repository access is required to
        view.
      </Dialog.Description>
    </Dialog.Header>

    <div class="py-4">
      <Label for="share-link-{chat.id}">Share link</Label>
      <Input
        id="share-link-{chat.id}"
        value={shareLink}
        class="mt-2"
        readonly
        tabindex={-1}
      />
    </div>

    <Dialog.Footer
      class="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {#if isDefined(loadingMessage)}
        <div class="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner variant="arcs" class="size-4 shrink-0" />
          <span>{loadingMessage}</span>
        </div>
      {:else if confirmingUnshare}
        <div class="text-destructive text-sm">Confirm unsharing this chat?</div>
      {:else}
        <div class="text-muted-foreground flex items-center gap-2 text-sm">
          <LockOpenIcon class="size-4 shrink-0" />
          <span>Visible to anyone with the link</span>
        </div>
      {/if}

      <div class="flex flex-col gap-2 sm:flex-row-reverse">
        {#if !confirmingUnshare}
          <Button disabled={sharing || unsharing} onclick={copyLink}>
            Copy link
          </Button>
        {/if}
        <Button
          variant="destructive"
          disabled={sharing || unsharing}
          onclick={() => {
            if (confirmingUnshare) {
              unshare();
            } else {
              confirmingUnshare = true;
            }
          }}
        >
          Unshare
        </Button>
        {#if confirmingUnshare}
          <Button
            variant="outline"
            disabled={unsharing}
            onclick={() => (confirmingUnshare = false)}
          >
            Cancel
          </Button>
        {/if}
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
