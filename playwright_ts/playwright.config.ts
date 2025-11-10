import { defineConfig, devices } from "@playwright/test";
import { env } from "./config";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,
  workers: process.env.CI ? 2 : 8,
  retries: process.env.CI ? 2 : 0,

  timeout: env.TIMEOUT,
  expect: {
    timeout: 5000,
  },

  reporter: [
    ["html", { open: "always" }],
    ["allure-playwright"],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  use: {
    baseURL: env.BASE_URL,

    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    actionTimeout: 10000,
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "login-tests",
      testMatch: /tests\/login\.test\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "tests",
      testMatch: /tests\/(?!login).*\.test\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
