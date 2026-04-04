import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
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
  ...svelte.configs["flat/recommended"],
  {
    files: ["apps/web/**/*.svelte", "apps/web/**/*.svelte.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        parser: tseslint.parser,
        svelteConfig,
        projectService: true,
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,svelte}"],
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
      "no-undef-init": "error",
      "no-console": [
        "error",
        { allow: ["error", "warn", "info", "debug", "trace"] },
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
];
export default config;
