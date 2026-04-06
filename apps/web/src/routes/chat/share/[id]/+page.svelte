<script lang="ts">
  import ChatPanel from "$lib/components/chat-panel.svelte";

  let { data } = $props();
</script>

<ChatPanel shared messages={data.messages} />
