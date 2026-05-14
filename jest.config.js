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
//   *.ce.test.{ts,tsx}       → CE project  (ee=false, ce=true, sqle=true, dms=false) 不要强制匹配 ce.test， ce.[可选项].test.{ts,tsx}
//   *.sqle.test.{ts,tsx}     → EE project (ee=true,  ce=false, sqle=true, dms=false) 同上
//   *.provision.test.{ts,tsx} → PROVISION project (ee=true, ce=false, sqle=false, provision=true, dms=false) 同上
//   *.test.{ts,tsx}          → DMS project  (ee=true, ce=false, sqle=true, provision=true, dms=true)  [default] 同上
// 实现：`.ce.` / `.sqle.` / `.provision.` 与 `.test.` 之间可有零段或多段 `.xxx.`（正则见下方 *_TEST_FILE_RE）。
const CE_TEST_FILE_RE = '\\.ce(\\.[^./]+)*\\.test\\.[jt]sx?$';
const SQLE_TEST_FILE_RE = '\\.sqle(\\.[^./]+)*\\.test\\.[jt]sx?$';
const PROVISION_TEST_FILE_RE = '\\.provision(\\.[^./]+)*\\.test\\.[jt]sx?$';

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
      displayName: 'dms',
      globals: {
        TEST_CONDITIONS: {
          ee: true,
          ce: false,
          sqle: true,
          provision: true,
          dms: true
        }
      },
      // Default tests only: exclude CE / sqle / provision condition tests (dedicated projects)
      testPathIgnorePatterns: [
        ...sharedIgnorePatterns,
        CE_TEST_FILE_RE,
        SQLE_TEST_FILE_RE,
        PROVISION_TEST_FILE_RE
      ]
    },
    {
      ...sharedProjectConfig,
      displayName: 'sqle-ce',
      globals: {
        TEST_CONDITIONS: {
          ee: false,
          ce: true,
          sqle: true,
          provision: false,
          dms: false
        }
      },
      testRegex: CE_TEST_FILE_RE,
      testPathIgnorePatterns: sharedIgnorePatterns
    },
    {
      ...sharedProjectConfig,
      displayName: 'sqle-ee',
      globals: {
        TEST_CONDITIONS: {
          ee: true,
          ce: false,
          sqle: true,
          provision: false,
          dms: false
        }
      },
      testRegex: SQLE_TEST_FILE_RE,
      // e.g. *.ce.sqle.test.* belongs to CE, not EE
      testPathIgnorePatterns: [...sharedIgnorePatterns, CE_TEST_FILE_RE]
    },
    {
      ...sharedProjectConfig,
      displayName: 'provision',
      globals: {
        TEST_CONDITIONS: {
          ee: true,
          ce: false,
          sqle: false,
          provision: true,
          dms: false
        }
      },
      testRegex: PROVISION_TEST_FILE_RE,
      testPathIgnorePatterns: [...sharedIgnorePatterns, CE_TEST_FILE_RE]
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
