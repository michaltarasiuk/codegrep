<script lang="ts">
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Ask, Search or Chat..." />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text class="ms-auto">52% used</InputGroup.Text>
    <Separator orientation="vertical" />
    <InputGroup.Button
      variant="default"
      class="rounded-full"
      size="icon-xs"
      disabled
    >
      <ArrowUpIcon />
      <span class="sr-only">Send</span>
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
