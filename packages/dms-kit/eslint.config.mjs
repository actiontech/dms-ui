import react from '@actiontech/dms-eslint-config/react';
import { globalIgnores } from 'eslint/config';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...react,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}']
  },
  globalIgnores(['src/**/demo/**', 'src/**/demos/**'])
];
