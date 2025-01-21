import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: '.' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/tests/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(config);
