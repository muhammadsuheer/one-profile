import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Native tsconfig `paths` resolution (the @/* alias) — no plugin needed.
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
