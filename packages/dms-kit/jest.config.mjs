import { createJestConfig } from '@actiontech/tooling-config/jest/create-jest-config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.type.ts',
    '!src/**/*.enum.ts',
    '!src/**/demo/**',
    '!src/**/demos/**'
  ]
});
