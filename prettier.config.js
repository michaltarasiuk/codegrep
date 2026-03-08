/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  trailingComma: "es5",
  overrides: [
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
