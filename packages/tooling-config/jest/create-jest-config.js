import path from 'node:path';

process.env.TZ = 'Asia/Shanghai';

const CE_TEST_FILE_RE = '\\.ce(\\.[^./]+)*\\.test\\.[jt]sx?$';
const SQLE_TEST_FILE_RE = '\\.sqle(\\.[^./]+)*\\.test\\.[jt]sx?$';
const PROVISION_TEST_FILE_RE = '\\.provision(\\.[^./]+)*\\.test\\.[jt]sx?$';

const PROJECT_CONDITIONS = {
  dms: {
    ee: true,
    ce: false,
    sqle: true,
    provision: true,
    dms: true
  },
  'sqle-ce': {
    ee: false,
    ce: true,
    sqle: true,
    provision: false,
    dms: false
  },
  'sqle-ee': {
    ee: true,
    ce: false,
    sqle: true,
    provision: false,
    dms: false
  },
  provision: {
    ee: true,
    ce: false,
    sqle: false,
    provision: true,
    dms: false
  }
};

function createProject(name, sharedProjectConfig, sharedIgnorePatterns) {
  if (!PROJECT_CONDITIONS[name]) {
    throw new Error(`Unsupported Jest project: ${name}`);
  }

  const config = {
    ...sharedProjectConfig,
    displayName: name,
    globals: {
      TEST_CONDITIONS: PROJECT_CONDITIONS[name]
    }
  };

  if (name === 'dms') {
    config.testPathIgnorePatterns = [
      ...sharedIgnorePatterns,
      CE_TEST_FILE_RE,
      SQLE_TEST_FILE_RE,
      PROVISION_TEST_FILE_RE
    ];
    return config;
  }

  if (name === 'sqle-ce') {
    config.testRegex = CE_TEST_FILE_RE;
    config.testPathIgnorePatterns = sharedIgnorePatterns;
    return config;
  }

  if (name === 'sqle-ee') {
    config.testRegex = SQLE_TEST_FILE_RE;
    config.testPathIgnorePatterns = [...sharedIgnorePatterns, CE_TEST_FILE_RE];
    return config;
  }

  config.testRegex = PROVISION_TEST_FILE_RE;
  config.testPathIgnorePatterns = [...sharedIgnorePatterns, CE_TEST_FILE_RE];
  return config;
}

export function createJestConfig(options) {
  const {
    packageRoot,
    collectCoverageFrom = [],
    enabledProjects = ['dms'],
    useSlowReporter = false
  } = options;

  const repoRoot = path.resolve(packageRoot, '../..');
  const sharedIgnorePatterns = ['/node_modules/', '/demo/', '/demos/'];

  const sharedProjectConfig = {
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': path.resolve(
        repoRoot,
        'scripts/jest/custom-transform.js'
      ),
      '^.+\\.(png|jpg|jpeg|css|json)$': path.resolve(
        repoRoot,
        'scripts/jest/file-transform.js'
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
      '^~/(.*)$': '<rootDir>/src/$1',
      '@ant-design/plots': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockAntDesignPlots.jsx'
      ),
      'monaco-editor': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockEditor.jsx'
      ),
      '@monaco-editor/react': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockEditor.jsx'
      ),
      '@uiw/react-md-editor': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockEditor.jsx'
      ),
      '@react-sigma/core(.*)$': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockSigmaCore.tsx'
      ),
      '@react-sigma/graph-search$': path.resolve(
        repoRoot,
        'packages/shared/lib/testUtil/mockModule/mockSigmaGraphSearch.tsx'
      ),
      '^@actiontech/(.*)$': path.resolve(packageRoot, '../$1')
    },
    collectCoverageFrom,
    setupFilesAfterEnv: [path.resolve(repoRoot, 'jest-setup.ts')]
  };

  const projects = enabledProjects.map((name) =>
    createProject(name, sharedProjectConfig, sharedIgnorePatterns)
  );

  const reporters = ['default'];
  if (useSlowReporter) {
    reporters.push([
      'jest-slow-test-reporter',
      {
        numTests: 8,
        outputDirectory: 'reports',
        outputName: 'report.xml',
        color: true,
        warnSlowerThan: 6000
      }
    ]);
  }

  return {
    projects,
    reporters
  };
}
