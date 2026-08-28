import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // e2e/ runs under Playwright (playwright.config.ts), not vitest — its
    // spec files call playwright's own test(), which vitest's default
    // *.spec.ts glob would otherwise try to collect and fail to run.
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', 'e2e/**'],
  },
})
