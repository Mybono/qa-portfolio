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
      globals: {
        node: true,
        es2020: true,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      playwright: playwrightPlugin,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "playwright/no-skipped-test": "warn",
      "playwright/no-focused-test": "error",
      "playwright/valid-expect": "error",
      "playwright/prefer-web-first-assertions": "warn",
      "playwright/no-conditional-in-test": "warn",
      "playwright/expect-expect": "warn",
    },
    overrides: [
      {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        rules: {
          "no-console": "off",
          "@typescript-eslint/no-explicit-any": "off",
        },
      },
      {
        files: ["playwright_ts/**/*.ts"],
        languageOptions: {
          parserOptions: {
            project: "./playwright_ts/tsconfig.json",
          },
        },
      },
    ],
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "playwright-report/",
      "test-results/",
      "allure-results/",
      "allure-report/",
      "*.js",
      "playwright_py/**/*",
      "mongo/**/*",
      ".git/",
      "*.config.js",
    ],
  },
];
