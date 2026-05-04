<script lang="ts">
  import ChatView from "$lib/components/chat/view.svelte";

  let { data } = $props();
</script>

<ChatView messages={data.messages} shared />
