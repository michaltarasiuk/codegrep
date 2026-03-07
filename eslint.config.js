import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

import svelteConfig from "./apps/web/svelte.config.js";

const ignoreFilePath = fileURLToPath(
  new globalThis.URL("./.gitignore", import.meta.url)
);

/** @type {import("eslint").Linter.Config[]} */
const config = [
  includeIgnoreFile(ignoreFilePath),
  {
    ignores: [".agent/**", ".agents/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...svelte.configs["flat/recommended"],
  {
    files: ["apps/web/**/*.svelte", "apps/web/**/*.svelte.{js,ts}"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        svelteConfig,
      },
    },
    rules: {
      "no-useless-assignment": "off",
    },
  },
  {
    files: ["apps/web/**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,svelte,astro}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  {
    files: ["**/components/**/index.ts"],
    rules: {
      "simple-import-sort/exports": "off",
    },
  },
  {
    files: ["apps/web/**/*.{js,mjs,cjs,ts,mts,cts,svelte,astro}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
  },
  {
    files: ["apps/api/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
  },
];
export default config;
