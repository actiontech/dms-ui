process.env.TZ = 'Asia/Shanghai';
const commonJestConfig = {
  preset: 'ts-jest',
  transformIgnorePatterns: [
    '/dist/',
    // Ignore modules without es dir.
    // Update: @babel/runtime should also be transformed
    'node_modules/(?!(?:.pnpm/)?(.+/es))(?!.*@(babel|ant-design))(?!array-move)[^/]+?/(?!(es|node_modules)/)'
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx', 'node'],
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  resetMocks: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': '<rootDir>/scripts/jest/babelTransform.js',
    '^.+\\.(png|jpg|jpeg|css|json)$': '<rootDir>/scripts/jest/fileTransform.js'
  }
};
module.exports = {
  ...commonJestConfig,
  collectCoverageFrom: [
    'lib/components/**/*.{ts,tsx}',
    'lib/global/**/*.{ts,tsx}',
    'lib/hooks/**/*.{ts,tsx}',
    'lib/utils/**/*.{ts,tsx}',
    '!lib/components/MonacoEditor/monacoEditorConfig.ts',
    '!lib/hooks/usePrompt/index.tsx',
    '!lib/components/MonacoEditor/useMonacoEditor/regexLanguage.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};
