const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');
const baseConfig = require('./base.js');

// 读取 TypeScript 配置以获取路径映射
const {
  compilerOptions
} = require('@actiontech/dms-typescript-config/react-lib');

// 处理路径映射
const tsPaths = { ...compilerOptions.paths };
if (tsPaths['~/*']) {
  tsPaths['~/*'][0] = path.resolve(__dirname, '../../', tsPaths['~/*'][0]);
}

/**
 * React 项目的 Jest 配置
 * 继承 base 配置并添加 React 特定的配置（如路径别名）
 */
module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '@actiontech/(.*)': '<rootDir>/../../packages/$1',
    ...pathsToModuleNameMapper(tsPaths)
  }
};
