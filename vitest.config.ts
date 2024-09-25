import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      }
    },
    reporters: ['json'],
    outputFile: './test_out.json',
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
      exclude: ['src/**/logging.ts', 'src/index.ts'],
      reportsDirectory: './coverage',
      reporter: 'text',
      reportOnFailure: true,
    },
    environment: 'node',
    globals: true,
  },
});
