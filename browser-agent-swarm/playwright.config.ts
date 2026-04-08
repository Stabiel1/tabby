import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

const storageStatePath = "/data/storageState.json";

export default defineConfig({
  testDir: ".",
  testMatch: ["swarm.spec.ts"],
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [["list"]],
  use: {
    headless: true,
    baseURL: process.env.GROK_WEB_URL ?? "https://grok.x.ai",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    storageState: fs.existsSync(storageStatePath) ? storageStatePath : undefined,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
