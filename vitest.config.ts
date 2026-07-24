import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Native tsconfig `paths` resolution (the @/* alias) — no plugin needed.
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Minimal env so modules importing `@/env` (which validates at import) load.
    env: {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/test',
      AUTH_SECRET: 'test-auth-secret-value',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      CREEM_WEBHOOK_SECRET: 'whsec_test_secret',
    },
  },
})
