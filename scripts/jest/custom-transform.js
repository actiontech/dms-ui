/* eslint-disable @typescript-eslint/no-var-requires */
const vitePlugin = require('vite-plugin-conditional-compile');

const testEnv = process.env?.JEST_TEST_VERSION_ENV;

const { transform } = vitePlugin({
  env: {
    sqle: true,
    provision: true,
    dms: true,
    ee: testEnv === 'ee',
    ce: testEnv === 'ce'
  }
});

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
      require.resolve('babel-preset-react-app'),
      {
        runtime: hasJsxRuntime ? 'automatic' : 'classic'
      }
    ],
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ]
});

const config = {
  ...babelJestConfig,
  process: (src, filename, options) => {
    const code = transform(src, filename);

    return babelJestConfig.process(code, filename, options);
  }
};
module.exports = config;
