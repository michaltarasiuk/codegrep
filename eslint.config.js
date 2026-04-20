import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

import svelteConfig from "./apps/web/svelte.config.js";

let ignoreFilePath = fileURLToPath(
  new globalThis.URL("./.gitignore", import.meta.url)
);

/** @type {import("eslint").Linter.Config[]} */
let config = [
  includeIgnoreFile(ignoreFilePath),
  {
    ignores: [".agent/**", ".agents/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    files: [
      "apps/**/*.svelte",
      "apps/**/*.svelte.{js,ts}",
      "packages/**/*.svelte",
      "packages/**/*.svelte.{js,ts}",
    ],
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
      "no-undef-init": "error",
      "no-console": [
        "error",
        { allow: ["error", "warn", "info", "debug", "trace"] },
      ],
      "prefer-const": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["const", "destructured"],
          format: null,
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["UPPER_CASE", "camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
  {
    files: [
      "./apps/web/src/lib/components/**/index.ts",
      "./packages/ai-elements/**/index.ts",
      "./packages/ui/**/index.ts",
    ],
    rules: {
      "simple-import-sort/exports": "off",
    },
  },
];
export default config;
