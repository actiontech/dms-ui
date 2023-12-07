/* eslint-disable @typescript-eslint/no-var-requires */
process.env.TZ = 'Asia/Shanghai';

const path = require('path');

const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

compilerOptions.paths['~/*'][0] = path.resolve(compilerOptions.paths['~/*'][0]);

module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': '<rootDir>/scripts/jest/custom-transform.js',
    '^.+\\.(png|jpg|jpeg|css|json)$': '<rootDir>/scripts/jest/file-transform.js'
  },
  transformIgnorePatterns: [
    '/dist/',
    // Ignore modules without es dir.
    'node_modules/(?!(?:.pnpm/)?(.+/es))[^/]+?/(?!(es|node_modules)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testEnvironment: 'jest-environment-jsdom',
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
    'packages/**/{src,lib}/{page,components,hooks,global,store,utils}/**/*.{ts,tsx}',
    'packages/**/src/App.tsx'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  reporters: [
    'default',
    [
      'jest-slow-test-reporter',
      {
        numTests: 8,
        outputDirectory: 'reports',
        outputName: 'report.xml',
        color: true,
        warnSlowerThan: 300
      }
    ]
  ]
};
