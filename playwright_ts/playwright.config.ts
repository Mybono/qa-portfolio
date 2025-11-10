import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "test-results/allure-results",
      },
    ],
  ],
  use: {
    baseURL: "https://www.saucedemo.com",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  outputDir: "test-results",
});
