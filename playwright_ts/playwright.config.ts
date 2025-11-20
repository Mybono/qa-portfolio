import { defineConfig, devices } from '@playwright/test';
import { url } from 'sdk_automation';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  workers: process.env.CI ? 2 : 8,
  retries: process.env.CI ? 2 : 0,

  timeout: 10000,
  expect: {
    timeout: 5000,
  },

  reporter: [
    ['html', { open: 'always' }],
    ['allure-playwright'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: url.baseUrl,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'login-tests',
      testMatch: /tests\/login\.test\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'tests',
      testMatch: /tests\/(?!login).*\.test\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
