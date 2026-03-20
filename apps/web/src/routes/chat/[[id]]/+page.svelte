<script lang="ts">
  import ChatPanel from "$lib/components/chat-panel.svelte";

  let { data } = $props();
</script>

<div class="mx-auto size-full max-w-3xl px-4 py-6">
  <ChatPanel messages={data.messages} />
</div>
