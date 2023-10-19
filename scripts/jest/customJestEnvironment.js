/* eslint-disable @typescript-eslint/no-var-requires */
const Environment = require('jest-environment-jsdom');

module.exports = class CustomEnvironment extends Environment {
  constructor(config, context) {
    super(config, context);
    this.global.testPath = context.testPath;
    this.global.IS_SQLE = context.testPath.includes('/packages/sqle/');
    this.global.IS_BASE = context.testPath.includes('/packages/base/');
  }

  async setup() {
    await super.setup();
  }
};
