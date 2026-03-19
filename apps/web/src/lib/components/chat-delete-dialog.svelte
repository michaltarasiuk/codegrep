<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { client } from "$lib/utils/client";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys";

  let {
    id,
    onClose,
  }: {
    id: string;
    onClose: () => void;
  } = $props();

  let loading = $state(false);

  async function handleDelete() {
    loading = true;
    try {
      const result = await client.api.chat({ id }).delete();
      if (!result.error) {
        // Captured before onClose unmounts the component
        const isViewingChat =
          page.route.id === "/chat/[[id]]" && page.params.id === id;
        onClose();
        if (isViewingChat) {
          await goto(resolve("/chat"), { invalidate: [CHAT_LIST_KEY] });
        } else {
          await invalidate(CHAT_LIST_KEY);
        }
      }
    } finally {
      loading = false;
    }
  }
</script>

<AlertDialog.Root open={true} onOpenChange={(o) => !o && onClose()}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete chat</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to delete this chat?<br />
        This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={loading}>Cancel</AlertDialog.Cancel>
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
