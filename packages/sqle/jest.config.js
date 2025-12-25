process.env.TZ = 'Asia/Shanghai';

const path = require('path');
const reactConfig = require('@actiontech/dms-jest-config/react');
const {
  compilerOptions
} = require('@actiontech/dms-typescript-config/react-lib');
const { pathsToModuleNameMapper } = require('ts-jest');

// 处理包的路径别名
const tsPaths = { ...compilerOptions.paths };
if (tsPaths['~/*']) {
  tsPaths['~/*'][0] = path.resolve(
    __dirname,
    tsPaths['~/*'][0].replace('./packages/provision/src/*', './src/*')
  );
}

module.exports = {
  ...reactConfig,
  rootDir: __dirname,
  displayName: 'sqle',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/{page,components,hooks,global,store,utils}/**/*.{ts,tsx}',
    'src/App.tsx',
    '!src/**/index.type.ts',
    '!src/**/index.enum.ts',
    '!src/page/SqlAnalyze/SqlAnalyze/ProcessListCom/**',
    '!src/page/Knowledge/Graph/components/**',
    '!src/**/demo/**',
    '!src/**/demos/**'
  ],
  moduleNameMapper: {
    ...reactConfig.moduleNameMapper,
    ...pathsToModuleNameMapper(tsPaths)
  },
  testPathIgnorePatterns: [
    ...reactConfig.testPathIgnorePatterns,
    '/dist/',
    '/node_modules/'
  ]
};
