import { defineConfig, devices } from "@playwright/test";
import { env } from "./config";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,

  timeout: env.TIMEOUT,
  expect: {
    timeout: 5000,
  },

  reporter: [
    ["html", { open: "never" }],
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
    // {
    //   name: "firefox",
    //   testMatch: /tests\/(inventory|cart|checkout)\.test\.ts/,
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     storageState: ".auth/user.json",
    //   },
    //   dependencies: ["setup"],
    // },
    //     {
    //   name: "chromium",
    //   testMatch: /tests\/(inventory|cart|checkout)\.test\.ts/,
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     storageState: ".auth/user.json",
    //   },
    //   dependencies: ["setup"],
    // },
  ],
});
