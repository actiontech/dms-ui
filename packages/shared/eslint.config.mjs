import react from '@actiontech/dms-eslint-config/react';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...react,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}']
  }
];
