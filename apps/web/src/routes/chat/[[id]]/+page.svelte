<script lang="ts">
  import ChatPanel from "$lib/components/chat-panel.svelte";

  let { data } = $props();
</script>

<ChatPanel messages={data.messages} />
