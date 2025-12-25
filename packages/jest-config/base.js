const path = require('path');

/**
 * 基础 Jest 配置
 * 包含通用的 transform、moduleNameMapper、setupFilesAfterEnv 等配置
 */
module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': path.resolve(
      __dirname,
      '../../scripts/jest/custom-transform.js'
    ),
    '^.+\\.(png|jpg|jpeg|css|json)$': path.resolve(
      __dirname,
      '../../scripts/jest/file-transform.js'
    )
  },
  transformIgnorePatterns: [
    '/dist/',
    'node_modules/(?!(?:.pnpm/)?(@react-sigma|.+/es))[^/]+?/(?!(es|node_modules)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testEnvironment: 'jest-environment-jsdom',
  resetMocks: true,
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
    '@ant-design/plots':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockAntDesignPlots.jsx',
    'monaco-editor':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
    '@monaco-editor/react':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
    '@uiw/react-md-editor':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
    '@react-sigma/core(.*)$':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockSigmaCore.tsx',
    '@react-sigma/graph-search$':
      '<rootDir>/../../packages/shared/lib/testUtil/mockModule/mockSigmaGraphSearch.tsx'
  },
  setupFilesAfterEnv: [path.resolve(__dirname, '../../jest-setup.ts')],
  testPathIgnorePatterns: ['/node_modules/', '/demo/', '/demos/'],
  reporters: [
    'default',
    [
      'jest-slow-test-reporter',
      {
        numTests: 8,
        outputDirectory: 'reports',
        outputName: 'report.xml',
        color: true,
        warnSlowerThan: 6000
      }
    ]
  ]
};
