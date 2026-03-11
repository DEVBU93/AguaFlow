import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  coverageThresholds: { global: { lines: 60, functions: 60 } },
  clearMocks: true,
};
export default config;
