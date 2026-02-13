import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element (#root) not found. " +
      'Ensure your HTML includes an element with id="root"'
  );
}

createRoot(rootElement).render(<StrictMode />);
