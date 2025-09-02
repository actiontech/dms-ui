process.env.TZ = 'Asia/Shanghai';
const commonJestConfig = require('../shared/jest.config');

module.exports = {
  ...commonJestConfig,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/*.{ts,tsx}',
    '!src/api/**/*.{ts,tsx}',
    '!src/**/*.d.{ts,tsx}',
    '!src/**/*.type.{ts,tsx}',
    '!src/locale/**/*.{ts,tsx}',
    '!src/testUtil/**/*.{ts,tsx}',
    '!src/data/**/*.{ts,tsx}',
    '!src/reportWebVitals.ts',
    '!src/main.tsx',
    '!src/router/router.tsx',
    '!src/exposes.tsx',
    '!src/jest-setup.ts ',
    '!src/theme/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
    '^~(.*)': '<rootDir>/src$1',
    '@monaco-editor/react': '<rootDir>/src/testUtil/mockEditor.tsx',
    'monaco-editor': '<rootDir>/src/testUtil/mockEditor.tsx'
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  }
};
