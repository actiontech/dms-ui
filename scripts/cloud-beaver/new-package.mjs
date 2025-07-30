#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取包名参数
const packageName = process.argv[2];

if (!packageName) {
  console.error('❌ 错误：请提供包名');
  console.log('用法: node new-package.js <包名>');
  process.exit(1);
}

// 验证包名格式
if (!/^[a-z0-9-]+$/.test(packageName)) {
  console.error('❌ 错误：包名只能包含小写字母、数字和连字符');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '../../');
const cloudBeaverDir = path.join(projectRoot, 'cloud-beaver');
const packagesDir = path.join(cloudBeaverDir, 'packages');
const packageDir = path.join(packagesDir, packageName);

// 检查目录是否已存在
if (fs.existsSync(packageDir)) {
  console.error(`❌ 错误：包 "${packageName}" 已经存在`);
  process.exit(1);
}

console.log(`🚀 正在创建新的 cloud-beaver 功能包: ${packageName}`);

// 创建包目录
fs.mkdirSync(packageDir, { recursive: true });

// 创建 package.json (功能包版本)
const packageJson = {
  name: `@cloudbeaver/${packageName}`,
  private: true,
  type: 'module',
  version: '0.0.1',
  exports: {
    '.': './src/index.ts'
  },
  scripts: {},
  dependencies: {},
  devDependencies: {}
};

fs.writeFileSync(
  path.join(packageDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
);

// 创建 tsconfig.json (移除 vite/client 类型)
const tsConfig = {
  extends: '../../tsconfig.base.json',
  include: ['**/*.ts', '**/*.tsx']
};

fs.writeFileSync(
  path.join(packageDir, 'tsconfig.json'),
  JSON.stringify(tsConfig, null, 2) + '\n'
);

// 创建 src 目录
const srcDir = path.join(packageDir, 'src');
fs.mkdirSync(srcDir, { recursive: true });

// 创建 src/index.ts (空文件)
fs.writeFileSync(path.join(srcDir, 'index.ts'), '');

// 创建基础的 README.md
const readme = `# ${packageName}

这是一个 CloudBeaver 功能包。

## 描述

请在这里添加包的功能描述。

## 使用方式

\`\`\`typescript
import { } from '@cloudbeaver/${packageName}';
\`\`\`

## 开发

在 \`src/index.ts\` 中导出您的功能模块。
`;

fs.writeFileSync(path.join(packageDir, 'README.md'), readme);

console.log('✅ 功能包创建成功！');
console.log(`📁 位置: cloud-beaver/packages/${packageName}`);
console.log('\n📋 包含文件:');
console.log('- package.json');
console.log('- tsconfig.json');
console.log('- src/index.ts');
console.log('- README.md');
console.log('\n📝 后续步骤:');
console.log(`1. 在 src/index.ts 中添加您的功能代码`);
console.log(`2. 更新 README.md 中的描述信息`);
console.log('\n🎉 开始开发功能模块吧！');
