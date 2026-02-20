import { vitePreprocess } from "@astrojs/svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
const config = {
  preprocess: vitePreprocess(),
};
export default config;
