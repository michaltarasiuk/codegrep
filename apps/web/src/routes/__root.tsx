import { MarkGithubIcon, SlidersIcon } from "@primer/octicons-react";
import { Button, Header, IconButton, Stack } from "@primer/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header>
        <Header.Item full>
          <Header.Link href="#">
            <Stack align="center" direction="horizontal" gap="condensed">
              <MarkGithubIcon size={32} />
            </Stack>
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Button variant="invisible">Sign in</Button>
        </Header.Item>
        <Header.Item>
          <IconButton aria-label="Appearance settings" icon={SlidersIcon} />
        </Header.Item>
      </Header>
      <Outlet />
    </>
  );
}
