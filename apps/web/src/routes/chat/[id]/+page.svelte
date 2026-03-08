<script lang="ts">
  import ChatPanel from "$lib/components/chat-panel.svelte";

  let { data } = $props();
</script>

<div class="mx-auto flex size-full max-w-3xl flex-col justify-end px-4 py-6">
  <ChatPanel chatId={data.chatId} initialMessages={data.initialMessages} />
</div>
