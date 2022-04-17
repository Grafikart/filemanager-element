import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 5_000,
  expect: {
    timeout: 5_000,
  },
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    actionTimeout: 0,
    trace: process.env.CI ? "off" : "on-first-retry",
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
