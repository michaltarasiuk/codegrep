import path from "node:path";

import adapter from "@sveltejs/adapter-vercel";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $api: path.resolve("./../api/src"),
      $styles: path.resolve("./src/styles"),
    },
  },
};
export default config;
