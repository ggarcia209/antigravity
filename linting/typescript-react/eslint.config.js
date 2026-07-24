import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import globals from "globals";
import validateJsxNesting from "eslint-plugin-validate-jsx-nesting";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: "19.2.6",
      },
    },
    plugins: {
      react,
      reactHooks,
      reactRefresh,
      "validate-jsx-nesting": validateJsxNesting,
    },
    rules: {
      "max-depth": ["error", { max: 4 }],
      "max-lines": [
        "error",
        {
          max: 500,
          skipComments: true,
          skipBlankLines: true,
        },
      ],
      complexity: ["error", { max: 8 }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: true,
        },
      ],
      "prefer-spread": "error",
      "react/no-danger": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": "error",
      "react/jsx-no-script-url": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/destructuring-assignment": "error",
      "react/jsx-props-no-spreading": "warn",
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
      "react/no-unstable-nested-components": "error",
      "validate-jsx-nesting/no-invalid-jsx-nesting": "error",
      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "span",
              message: "Use Text or Span from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "p",
              message:
                "Use BodyText, Muted, Paragraph or Text from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h1",
              message: "Use PageTitle from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h2",
              message: "Use SectionHeading from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h3",
              message:
                "Use CardHeading or SectionHeading as='h3' from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h4",
              message:
                "Use SectionHeading as='h4' from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h5",
              message:
                "Use SectionHeading as='h5' from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "h6",
              message:
                "Use SectionHeading as='h6' from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "div",
              message:
                "Use Stack, Group, Container, Box, or FormGrid from `${YOUR_NPM_PACKAGE}`",
            },
            {
              element: "button",
              message: "Use Button from `${YOUR_NPM_PACKAGE}`",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/test/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "**/setup.ts"],
    rules: {
      "max-depth": "off",
      "max-lines": "off",
      complexity: "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    ignores: [
      "out/**",
      "dist/**",
      "node_modules/**",
      "*.config.ts",
      "scripts/**",
      "__mocks__/**",
      "benchmark-models/**",
    ],
  },
);
