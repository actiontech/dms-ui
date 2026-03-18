process.env.TZ = 'Asia/Shanghai';

const path = require('path');

const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

compilerOptions.paths['~/*'][0] = path.resolve(compilerOptions.paths['~/*'][0]);

const sharedModuleNameMapper = {
  '.+\\.(css|style|less|sass|scss|ttf|woff|woff2)$': 'identity-obj-proxy',
  '@ant-design/plots':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockAntDesignPlots.jsx',
  'monaco-editor':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
  '@monaco-editor/react':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
  '@uiw/react-md-editor':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockEditor.jsx',
  '@actiontech/(.*)': '<rootDir>/packages/$1',
  '@react-sigma/core(.*)$':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockSigmaCore.tsx',
  '@react-sigma/graph-search$':
    '<rootDir>/packages/shared/lib/testUtil/mockModule/mockSigmaGraphSearch.tsx',
  ...pathsToModuleNameMapper(compilerOptions.paths)
};

const sharedIgnorePatterns = ['/node_modules/', '/demo/', '/demos/'];

// Naming conventions for condition-specific test files:
//   *.ce.test.{ts,tsx}       → CE project  (ee=false, ce=true, sqle=true)
//   *.ce.sqle.test.{ts,tsx}  → CE project  (ee=false, ce=true, sqle=true)
//   *.sqle.test.{ts,tsx}     → sqle project (ee=true,  ce=false, sqle=true, dms=false)
//   *.ee.test.{ts,tsx}       → ee project  (ee=true, dms=true)  [default]
//   *.test.{ts,tsx}          → ee project  (default)
const CE_TEST_PATTERN = '\\.ce\\.test\\.[jt]sx?$';
const CE_TEST_PATH_PATTERN = '/ce\\.test\\.[jt]sx?$';
const SQLE_TEST_PATTERN = '\\.sqle\\.test\\.[jt]sx?$';
const SQLE_TEST_PATH_PATTERN = '/sqle\\.test\\.[jt]sx?$';
const CE_SQLE_TEST_PATTERN = '\\.ce\\.sqle\\.test\\.[jt]sx?$';

const sharedProjectConfig = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': '<rootDir>/scripts/jest/custom-transform.js',
    '^.+\\.(png|jpg|jpeg|css|json)$': '<rootDir>/scripts/jest/file-transform.js'
  },
  transformIgnorePatterns: [
    '/dist/',
    'node_modules/(?!(?:.pnpm/)?(@react-sigma|.+/es))[^/]+?/(?!(es|node_modules)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testEnvironment: 'jest-environment-jsdom',
  resetMocks: true,
  moduleNameMapper: sharedModuleNameMapper,
  collectCoverageFrom: [
    'packages/**/{src,lib}/{page,components,hooks,global,store,utils}/**/*.{ts,tsx}',
    'packages/**/src/App.tsx',
    'packages/shared/api/common/**',
    '!packages/**/index.type.ts',
    '!packages/**/index.enum.ts',
    '!packages/sqle/src/page/SqlAnalyze/SqlAnalyze/ProcessListCom/**',
    '!packages/shared/lib/hooks/usePrompt/index.tsx',
    '!packages/sqle/src/page/Knowledge/Graph/components/**',
    '!packages/**/demo/**',
    '!packages/**/demos/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};

module.exports = {
  projects: [
    {
      ...sharedProjectConfig,
      displayName: 'ee',
      globals: {
        TEST_CONDITIONS: {
          ee: true,
          ce: false,
          sqle: true,
          provision: true,
          dms: true,
          demo: false
        }
      },
      // Exclude CE-named and sqle-named test files; they have dedicated projects
      testPathIgnorePatterns: [
        ...sharedIgnorePatterns,
        CE_TEST_PATTERN,
        CE_TEST_PATH_PATTERN,
        SQLE_TEST_PATTERN,
        SQLE_TEST_PATH_PATTERN
      ]
    },
    {
      ...sharedProjectConfig,
      displayName: 'ce',
      globals: {
        TEST_CONDITIONS: {
          ee: false,
          ce: true,
          sqle: true,
          provision: false,
          dms: false,
          demo: false
        }
      },
      // CE project: run ce-named and ce.sqle-named test files
      testMatch: [
        '**/*.ce.test.{ts,tsx}',
        '**/ce.test.{ts,tsx}',
        '**/*.ce.sqle.test.{ts,tsx}',
        '**/ce.sqle.test.{ts,tsx}'
      ],
      testPathIgnorePatterns: sharedIgnorePatterns
    },
    {
      ...sharedProjectConfig,
      displayName: 'sqle',
      globals: {
        TEST_CONDITIONS: {
          // EE + SQLE without DMS/PROVISION — covers [sqle && !dms] conditions
          ee: true,
          ce: false,
          sqle: true,
          provision: false,
          dms: false,
          demo: false
        }
      },
      // sqle project: run sqle-named files, but NOT ce.sqle files (those belong to CE project)
      testMatch: ['**/*.sqle.test.{ts,tsx}', '**/sqle.test.{ts,tsx}'],
      testPathIgnorePatterns: [
        ...sharedIgnorePatterns,
        CE_SQLE_TEST_PATTERN
      ]
    }
  ],
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
