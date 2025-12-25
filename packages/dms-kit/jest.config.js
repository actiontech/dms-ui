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
// dms-kit 有自己的路径别名
if (tsPaths['@actiontech/dms-kit']) {
  tsPaths['@actiontech/dms-kit'][0] = path.resolve(__dirname, './src');
}

module.exports = {
  ...reactConfig,
  rootDir: __dirname,
  displayName: 'dms-kit',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/{components,features,hooks,utils}/**/*.{ts,tsx}',
    '!src/**/index.type.ts',
    '!src/**/index.enum.ts',
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
    '/es/',
    '/lib/',
    '/node_modules/'
  ]
};
