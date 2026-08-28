import { defineConfig, devices } from '@playwright/test'

// Route-level a11y gate (CLAUDE.md Verify §UI, T3). Runs against the built
// Next server — the jsdom-based packages/datum-ui/src/a11y.test.tsx checks
// isolated component stories and explicitly cannot assert color-contrast
// (no paint layer); this is the composition + real-paint layer on top of it.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list']] : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx next start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
