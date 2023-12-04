/* eslint-disable @typescript-eslint/no-var-requires */
const vitePlugin = require('vite-plugin-conditional-compile');
const swcJest = require('@swc/jest');
const swcJestConfig = swcJest.createTransformer();

const isEE = process.env.testEnv?.split(',').includes('ee');
const isSQLE = process.env.testEnv?.split(',').includes('SQLE');

const { transform } = vitePlugin({
  env: { ee: isEE, ce: !isEE, sqle: isSQLE }
});

const config = {
  ...swcJestConfig,
  process: (src, filename, options) => {
    const code = transform(src, filename);
    return swcJestConfig.process(code, filename, options);
  }
};
module.exports = config;
