<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import UserMenu from "./user-menu.svelte";
  import ThemeToggle from "./theme-toggle.svelte";
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <Sidebar.Root collapsible="offcanvas" variant="inset">
    <Sidebar.Header />
    <Sidebar.Content />
    <Sidebar.Footer>
      <UserMenu
        user={{
          name: "John Doe",
          email: "john.doe@gmail.com",
          avatar: "https://avatars.githubusercontent.com/u/69385846",
        }}
      />
      <ThemeToggle />
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
    <slot />
  </Sidebar.Inset>
</Sidebar.Provider>
