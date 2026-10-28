import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Test config is separate from vite.config.ts so the production build never
 * carries test-only plugins or settings, and so Tailwind's Vite plugin does not
 * run during unit tests (styles are not asserted on).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    /**
     * These are integration-style tests: each one mounts the entire application,
     * resolves a lazily-imported route chunk and waits for effects. Six files
     * doing that in parallel can exceed the 5s default on a loaded machine, which
     * showed up as intermittent failures that passed in isolation. The app's own
     * behaviour is verified against a real browser by the Playwright suite.
     */
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})
