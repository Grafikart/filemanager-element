import { devices } from "@playwright/test";

const config = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
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
