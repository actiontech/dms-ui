/* eslint-disable @typescript-eslint/no-var-requires */
const vitePlugin = require('vite-plugin-conditional-compile');
const swcJest = require('@swc/jest');

const swcJestConfig = swcJest.createTransformer();

const testEnv = process.env?.JEST_TEST_VERSION_ENV;

const { transform } = vitePlugin({
  env: {
    sqle: process.env.JEST_TEST_PROD_VERSION_ENV === 'sqle',
    ee: testEnv === 'ee',
    ce: testEnv === 'ce'
  }
});

const config = {
  ...swcJestConfig,
  process: (src, filename, options) => {
    const code = transform(src, filename);

    return swcJestConfig.process(code, filename, options);
  }
};
module.exports = config;
