import { createJestConfig } from '@actiontech/tooling-config/jest/create-jest-config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms'],
  collectCoverageFrom: [
    'src/{components,features,utils}/**/*.{ts,tsx}',
    '!src/components/**/demo/**',
    '!src/components/**/demos/**',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}'
  ]
});
