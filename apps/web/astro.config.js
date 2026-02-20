import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/** @type {import("astro").AstroUserConfig} */
const config = defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
export default config;
