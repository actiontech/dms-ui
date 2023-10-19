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
    '!src/reportWebVitals.ts',
    '!src/index.tsx',
    '!src/router/config.tsx',
    '!src/components/BackendForm/index.ts',
    '!src/components/EditText/index.ts',
    '!src/hooks/useOperation/index.tsx',
    '!src/page/AuditPlan/PlanForm/AuditTaskType/index.tsx',
    '!src/exposes.tsx',
    '!src/page/Member',
    '!src/setupTests.ts',
    '!src/page/ProjectManage/ProjectOverview/Chats/CommonGauge/registerShape.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '@ant-design/plots': '<rootDir>/src/testUtils/mockAntDesignPlots.jsx',
    '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
    'monaco-editor': '<rootDir>/src/testUtils/mockEditor.jsx',
    '@monaco-editor/react': '<rootDir>/src/testUtils/mockEditor.jsx'
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
