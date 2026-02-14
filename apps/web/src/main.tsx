import "@primer/react-brand/lib/css/main.css";

import { AnimationProvider, ThemeProvider } from "@primer/react-brand";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element (#root) not found. " +
      'Ensure your HTML includes an element with id="root"'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AnimationProvider>
        <RouterProvider router={router} />
      </AnimationProvider>
    </ThemeProvider>
  </StrictMode>
);
