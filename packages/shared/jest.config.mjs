import { createJestConfig } from '@actiontech/tooling-config/jest/create-jest-config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms', 'sqle-ce'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'api/common/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!lib/**/*.test.{ts,tsx}',
    '!src/**/*.type.ts',
    '!src/**/*.enum.ts',
    '!lib/**/*.type.ts',
    '!lib/**/*.enum.ts',
    '!lib/hooks/usePrompt/index.tsx',
    '!src/**/demo/**',
    '!src/**/demos/**',
    '!lib/**/demo/**',
    '!lib/**/demos/**'
  ]
});
