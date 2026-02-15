import { MarkGithubIcon } from "@primer/octicons-react";
import { Button, Header, Stack } from "@primer/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppearanceSettings } from "@/components/appearance-settings";
import { signIn } from "@/lib/auth-client";

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
          <Button
            onClick={() =>
              signIn.social({
                provider: "github",
                callbackURL: `${window.location.origin}/`,
              })
            }
          >
            Sign in
          </Button>
        </Header.Item>
        <Header.Item>
          <AppearanceSettings />
        </Header.Item>
      </Header>
      <Outlet />
    </>
  );
}
