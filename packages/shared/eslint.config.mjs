import react from '@actiontech/dms-eslint-config/react';
import { globalIgnores } from 'eslint/config';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...react,
  {
    files: ['lib/**/*.{ts,tsx,js,jsx}']
  },
  globalIgnores(['lib/api/**', 'lib/testUtil/**'])
];
