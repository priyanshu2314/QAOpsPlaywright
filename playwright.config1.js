// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { trace } from "node:console";
import { permission } from "node:process";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: "./tests",
  retries: 1,
  workers: 2,
  timeout: 40 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: "html",
  projects: [
    {
      name: "headless",
      use: {
        browserName: "chromium",
        headless: true,
        screenshot: "off",
        trace: "on", //off,on
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      },
    },
    {
      name: "headed",
      use: {
        browserName: "chromium",
        headless: false,
        screenshot: "on",
        video: "retain-on-failure",
        ignoreHttpsErrors: true,
        permissions: ["geolocation"],
        trace: "on", //off,on

        //...devices["iPad (gen 11) landscape"],
        //viewport: { width: 720, height: 720 },

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      },
    },
  ],
};

module.exports = config;
