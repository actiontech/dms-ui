process.env.TZ = 'Asia/Shanghai';
const commonJestConfig = require('../shared/jest.config');
const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');
const path = require('path');

compilerOptions.paths['~/*'][0] = path.resolve(compilerOptions.paths['~/*'][0]);

module.exports = {
  ...commonJestConfig,
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(compilerOptions.paths)
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/*.{ts,tsx}',
    '!src/api/**/*.{ts,tsx}',
    '!src/**/*.d.{ts,tsx}',
    '!src/**/*.type.{ts,tsx}',
    '!src/locale/**/*.{ts,tsx}',
    '!src/data/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/router/router.tsx',
    '!src/demo/**/*.{ts,tsx}',
    '!src/testUtils/**/*.{ts,tsx}',
    '!src/jest-setup.ts',
    '!src/theme/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts']
};
