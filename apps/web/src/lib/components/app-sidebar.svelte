<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  import NavUser from "./nav-user.svelte";
  import ThemeToggle from "./theme-toggle.svelte";

  let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
  <Sidebar.Header />
  <Sidebar.Content />
  <Sidebar.Footer>
    <NavUser
      user={{
                name: "John Doe",
                email: "john.doe@gmail.com",
                avatar: "https://avatars.githubusercontent.com/u/69385846",
            }}
    />
    <ThemeToggle />
  </Sidebar.Footer>
</Sidebar.Root>
