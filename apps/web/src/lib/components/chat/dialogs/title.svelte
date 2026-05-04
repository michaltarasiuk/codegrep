<script lang="ts">
  import { isDefined } from "@workspace/shared/is-defined.js";
  import { Button } from "@workspace/ui/button/index.js";
  import * as Dialog from "@workspace/ui/dialog/index.js";
  import * as Field from "@workspace/ui/field/index.js";
  import { Input } from "@workspace/ui/input/index.js";
  import { useId } from "bits-ui";

  import { invalidate } from "$app/navigation";
  import { client } from "$lib/utils/client.js";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation.js";

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

  let titleFieldId = useId();

  let loading = $state(false);

  let value = $derived(chat.title);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    try {
      loading = true;
      let result = await client.api
        .chat({
          id: chat.id,
        })
        .put({
          title: value,
        });
      if (!isDefined(result.error)) {
        onClose();
        await invalidate(CHAT_LIST_KEY);
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
          <Field.Label for={titleFieldId} class="sr-only">Title</Field.Label>
          <Input id={titleFieldId} bind:value />
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
