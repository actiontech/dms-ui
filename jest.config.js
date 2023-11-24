process.env.TZ = 'Asia/Shanghai';

const path = require('path');
const baseJestConfig = require('./packages/base/jest.config');
const sharedJestConfig = require('./packages/shared/jest.config');
const sqleJestConfig = require('./packages/sqle/jest.config');
const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

compilerOptions.paths['~/*'][0] = path.resolve(compilerOptions.paths['~/*'][0]);

const addPrefix = (paths, prefix) => {
  return paths.map((v) => {
    if (v.startsWith('!')) {
      return `!${path.join(`./packages/${prefix}`, v.slice(1))}`;
    }
    return path.join(`./packages/${prefix}`, v);
  });
};

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': '<rootDir>/scripts/jest/babelTransform.js',
    '^.+\\.(png|jpg|jpeg|css|json)$': '<rootDir>/scripts/jest/fileTransform.js'
  },
  transformIgnorePatterns: [
    '/dist/',
    // Ignore modules without es dir.
    // Update: @babel/runtime should also be transformed
    'node_modules/(?!(?:.pnpm/)?(.+/es))(?!.*@(babel|ant-design))(?!array-move)[^/]+?/(?!(es|node_modules)/)'
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx', 'node'],
  testEnvironment: '<rootDir>/scripts/jest/customJestEnvironment.js',
  resetMocks: true,
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
    '@ant-design/plots':
      '<rootDir>/packages/sqle/src/testUtils/mockAntDesignPlots.jsx',
    'monaco-editor': '<rootDir>/packages/sqle/src/testUtils/mockEditor.jsx',
    '@monaco-editor/react':
      '<rootDir>/packages/sqle/src/testUtils/mockEditor.jsx',
    '@actiontech/(.*)': '<rootDir>/packages/$1',
    ...pathsToModuleNameMapper(compilerOptions.paths)
  },
  collectCoverageFrom: [
    ...addPrefix(baseJestConfig.collectCoverageFrom, 'base'),
    ...addPrefix(sharedJestConfig.collectCoverageFrom, 'shared'),
    ...addPrefix(sqleJestConfig.collectCoverageFrom, 'sqle')
  ],

  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};
