/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require('crypto');
const vitePlugin = require('vite-plugin-conditional-compile');
const babelJest = require('babel-jest');

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

const babelJestConfig = babelJest.createTransformer({
  presets: [
    [
      'babel-preset-react-app',
      {
        runtime: hasJsxRuntime ? 'automatic' : 'classic'
      }
    ]
  ],
  babelrc: false,
  configFile: false
});

// Cache transform instances per condition set to avoid recreating on each file
const transformCache = new Map();

function getTransform(conditions) {
  const key = JSON.stringify(conditions);
  if (!transformCache.has(key)) {
    const { transform } = vitePlugin({ env: conditions });
    transformCache.set(key, transform);
  }
  return transformCache.get(key);
}

function getDefaultConditions() {
  // Backward compatibility: fall back to process.env when not running via Jest Projects
  const testEnv = process.env?.JEST_TEST_VERSION_ENV;
  return {
    sqle: true,
    dms: true,
    provision: true,
    demo: false,
    ee: testEnv !== 'ce',
    ce: testEnv === 'ce'
  };
}

const config = {
  ...babelJestConfig,

  // Include TEST_CONDITIONS in the cache key so CE and EE projects
  // never share cached transform results for the same source file.
  // Note: in Jest 29 TransformOptions, globals lives at options.config.globals,
  // not at options.globals directly.
  getCacheKey: (sourceText, sourcePath, options) => {
    const conditions =
      options?.config?.globals?.TEST_CONDITIONS ?? getDefaultConditions();
    const baseKey = babelJestConfig.getCacheKey(sourceText, sourcePath, options);
    return crypto
      .createHash('md5')
      .update(baseKey)
      .update(JSON.stringify(conditions))
      .digest('hex');
  },

  process: (src, filename, options) => {
    const conditions =
      options?.config?.globals?.TEST_CONDITIONS ?? getDefaultConditions();
    const transform = getTransform(conditions);
    const code = transform(src, filename);
    return babelJestConfig.process(code, filename, options);
  }
};

module.exports = config;
