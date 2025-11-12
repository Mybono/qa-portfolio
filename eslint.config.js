// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import playwrightPlugin from "eslint-plugin-playwright";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: ["./playwright_ts/tsconfig.json", "./sdk/tsconfig.json"],
      },
      globals: { node: true, es2020: true },
    },
    plugins: { "@typescript-eslint": tsPlugin, playwright: playwrightPlugin },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "playwright/no-skipped-test": "warn",
      "playwright/no-focused-test": "error",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];
