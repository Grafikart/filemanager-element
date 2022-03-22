import { devices } from "@playwright/test";

const config = {
  testDir: "./tests",
  timeout: 5_000,
  expect: {
    timeout: 5_000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    timeout: 5_000,
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:3000/index.html",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
};
export default config;
