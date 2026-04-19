<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import * as AlertDialog from "@workspace/ui/alert-dialog/index.js";
  import { buttonVariants } from "@workspace/ui/button/index.js";

  import { goto, invalidate } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { client } from "$lib/utils/client.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

  let {
    chat,
    open,
    onClose,
  }: {
    chat: {
      id: string;
    };
    open: boolean;
    onClose: () => void;
  } = $props();

  let loading = $state(false);

  function isViewingChat() {
    return page.route.id === "/chat/[[id]]" && page.params.id === chat.id;
  }

  async function handleDelete() {
    try {
      loading = true;
      let result = await client.api
        .chat({
          id: chat.id,
        })
        .delete();
      if (!isDefined(result.error)) {
        if (isViewingChat()) {
          await goto(resolve("/chat"));
        }
        onClose();
        await invalidate(CHAT_LIST_KEY);
      }
    } finally {
      loading = false;
    }
  }
</script>

<AlertDialog.Root
  {open}
  onOpenChange={(open) => {
    if (!open) {
      onClose();
    }
  }}
  onOpenChangeComplete={(open) => {
    if (!open) {
      loading = false;
    }
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete chat</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to delete this chat?<br />
        This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        disabled={loading}
        class={buttonVariants({ variant: "destructive" })}
        onclick={handleDelete}
      >
        Delete
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
