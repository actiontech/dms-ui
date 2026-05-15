import { createJestConfig } from '@actiontech/tooling-config/jest/create-jest-config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms', 'sqle-ce', 'sqle-ee'],
  collectCoverageFrom: [
    'lib/{components,hooks,features}/**/*.{ts,tsx}',
    '!lib/hooks/usePrompt/index.tsx',
    '!lib/{components,hooks,features}/**/__tests__/**',
    '!lib/{components,hooks,features}/**/*.test.{ts,tsx}'
  ]
});
