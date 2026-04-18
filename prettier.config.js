/** @type {import("prettier").Config} */
let config = {
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  tailwindFunctions: ["tv", "cn", "clsx", "cva"],
  trailingComma: "es5",
  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
    {
      files: ["*.json", "*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],
};
export default config;
