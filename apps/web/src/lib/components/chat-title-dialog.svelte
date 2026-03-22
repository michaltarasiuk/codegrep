<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { client } from "$lib/utils/client";
  import { CHAT_LIST_KEY } from "$lib/utils/invalidation-keys";

  let {
    id,
    title,
    onClose,
  }: {
    id: string;
    title: string;
    onClose: () => void;
  } = $props();

  let value = $derived(title);
  let loading = $state(false);

  async function handleSubmit() {
    loading = true;
    try {
      const result = await client.api.chat({ id }).put({
        title: value,
      });
      if (!result.error) {
        await invalidate(CHAT_LIST_KEY);
        onClose();
      }
    } finally {
      loading = false;
    }
  }
</script>

<Dialog.Root open onOpenChange={(o) => !o && onClose()}>
  <Dialog.Content>
    <form onsubmit={handleSubmit}>
      <Dialog.Header>
        <Dialog.Title>Chat title</Dialog.Title>
      </Dialog.Header>
      <div class="py-4">
        <Label for="title" class="sr-only">Title</Label>
        <Input id="title" bind:value disabled={loading} />
      </div>
      <Dialog.Footer>
        <Button variant="outline" disabled={loading} onclick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!value || loading}>Update</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
