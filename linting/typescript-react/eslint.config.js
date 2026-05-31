import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "vitest.config.ts",
    "vite.config.ts",
    "eslint.config.js",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    rules: {
      "prefer-spread": "error",
      "react/no-danger": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": "error",
      "react/jsx-no-script-url": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/destructuring-assignment": "error",
      "react/jsx-props-no-spreading": "off",
      "react-hooks/exhaustive-deps": "error",
      "react/default-props-match-prop-types": "error",
      "react/no-unused-prop-types": "error",
      "react/no-unused-class-component-methods": "error",
      "react/no-unknown-property": "error",
      "react/sort-prop-types": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-curly-newline": "error",
      "react/no-array-index-key": "error",
      "react/jsx-no-constructed-context-values": "error",
    },
    settings: {
      react: {
        version: "19.2.6",
      },
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ["**/test/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "**/setup.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
]);
