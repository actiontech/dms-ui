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
    tsPaths['~/*'][0].replace('./packages/provision/src/*', './lib/*')
  );
}

module.exports = {
  ...reactConfig,
  rootDir: __dirname,
  displayName: 'shared',
  testMatch: [
    '<rootDir>/lib/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/lib/**/*.{test,spec}.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'lib/{page,components,hooks,global,store,utils}/**/*.{ts,tsx}',
    'api/common/**/*.{ts,tsx}',
    '!lib/**/index.type.ts',
    '!lib/**/index.enum.ts',
    '!lib/hooks/usePrompt/index.tsx',
    '!lib/**/demo/**',
    '!lib/**/demos/**'
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
