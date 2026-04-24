<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import * as AlertDialog from "@workspace/ui/alert-dialog/index.js";
  import { buttonVariants } from "@workspace/ui/button/index.js";
  import type { Snippet } from "svelte";

  import { invalidate } from "$app/navigation";
  import { client } from "$lib/utils/client.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

  let {
    chat,
    onUnshare,
    children,
  }: {
    chat: {
      id: string;
      title: string;
    };
    onUnshare: () => void;
    children: Snippet<[() => void]>;
  } = $props();

  let open = $state(false);
  let loading = $state(false);

  function openDialog() {
    open = true;
  }

  async function handleUnshare() {
    try {
      loading = true;
      let result = await client.api
        .chat({
          id: chat.id,
        })
        .unshare.put();
      if (!isDefined(result.error)) {
        open = false;
        onUnshare();
        await invalidate(CHAT_LIST_KEY);
      }
    } finally {
      loading = false;
    }
  }
</script>

{@render children(openDialog)}

<AlertDialog.Root
  {open}
  onOpenChange={(value) => {
    if (!value) {
      open = false;
    }
  }}
  onOpenChangeComplete={(value) => {
    if (!value) {
      loading = false;
    }
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Unshare conversation</AlertDialog.Title>
      <AlertDialog.Description>
        You're about to unshare the link for the following conversation:
      </AlertDialog.Description>
    </AlertDialog.Header>

    <div class="bg-muted rounded-md border px-3 py-2 text-sm font-medium">
      {chat.title}
    </div>

    <p class="text-muted-foreground text-sm">
      Once unshared, the link will no longer be accessible.
    </p>

    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        disabled={loading}
        class={buttonVariants({ variant: "destructive" })}
        onclick={handleUnshare}
      >
        Unshare
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
