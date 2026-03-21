/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  tailwindFunctions: ["tv", "cn", "clsx", "cva"],
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
