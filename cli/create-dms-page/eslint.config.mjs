import node from '@actiontech/dms-eslint-config/node';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...node,
  {
    files: ['src/**/*.{ts,js}']
    // 可以在此处添加本包特有的覆盖规则
  }
];
