<script lang="ts">
  import { useId } from "bits-ui";

  import { invalidate } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { client } from "$lib/utils/client.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys.js";
  import { isDefined } from "$lib/utils/is-defined.js";

  let {
    chat,
    open,
    onClose,
  }: {
    chat: {
      id: string;
      title: string;
    };
    open: boolean;
    onClose: () => void;
  } = $props();

  let value = $derived(chat.title);
  let loading = $state(false);

  const titleId = useId("chat-title");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    try {
      loading = true;
      const result = await client.api
        .chat({
          id: chat.id,
        })
        .put({
          title: value,
        });
      if (!isDefined(result.error)) {
        await invalidate(CHAT_LIST_KEY);
        onClose();
      }
    } finally {
      loading = false;
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
      value = chat.title;
      loading = false;
    }
  }}
>
  <Dialog.Content>
    <form onsubmit={handleSubmit}>
      <Dialog.Header>
        <Dialog.Title>Chat title</Dialog.Title>
      </Dialog.Header>

      <div class="py-4">
        <Field.Field>
          <Field.Label for={titleId} class="sr-only">Title</Field.Label>
          <Input id={titleId} bind:value disabled={loading} />
        </Field.Field>
      </div>

      <Dialog.Footer>
        <Button variant="outline" type="button" onclick={() => onClose()}>
          Cancel
        </Button>
        <Button type="submit" disabled={!value || loading}>Update</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
