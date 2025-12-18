import react from '@actiontech/dms-eslint-config/react';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...react,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}']
    // 本包可以在此处追加或覆盖规则
  }
];
