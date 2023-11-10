process.env.TZ = 'Asia/Shanghai';
const commonJestConfig = require('../shared/jest.config');

module.exports = {
  ...commonJestConfig,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/api/**/*.{ts,tsx}',
    '!src/**/*.d.{ts,tsx}',
    '!src/**/*.type.{ts,tsx}',
    '!src/locale/**/*.{ts,tsx}',
    '!src/testUtils/**/*.{ts,tsx}',
    '!src/data/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!src/router/router.tsx'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy'
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  // resetMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  }
};
