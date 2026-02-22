<script lang="ts">
  import PlusIcon from "@lucide/svelte/icons/plus";
  import type { Snippet } from "svelte";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import ThemeToggle from "./theme-toggle.svelte";
  import UserAccountMenu from "./user-account-menu.svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <Sidebar.Root variant="inset">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <PlusIcon />
            New chat
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content />
    <Sidebar.Footer>
      <Sidebar.Menu>
        <UserAccountMenu />
        <ThemeToggle />
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header
      class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Sidebar.Trigger class="-ms-1" />
      </div>
    </header>
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
