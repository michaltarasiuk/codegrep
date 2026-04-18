<script lang="ts">
  import { page } from "$app/state";
  import ChatView from "$lib/components/chat-view.svelte";

  let { data } = $props();
</script>

<ChatView id={page.params.id} messages={data.messages} />
