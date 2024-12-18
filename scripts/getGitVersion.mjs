import { execSync } from 'child_process';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

let version = '';

try {
  // 尝试获取当前 commit 的 tag
  const tag = execSync('git describe --exact-match --tags HEAD 2>/dev/null', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'] // 忽略错误输出
  }).trim();

  const commitId = execSync('git rev-parse --short HEAD', {
    encoding: 'utf8'
  }).trim();

  // 如果成功获取到 tag，使用 tag + commitId
  version = `${tag}   ${commitId}`;
} catch (error) {
  // 如果没有 tag，回退到使用分支名 + commitId
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8'
  }).trim();

  const commitId = execSync('git rev-parse --short HEAD', {
    encoding: 'utf8'
  }).trim();

  version = `${branch}   ${commitId}`;
}

const filePath = resolve(
  import.meta.dirname,
  '..',
  'packages',
  'base',
  'src',
  'scripts',
  'version.ts'
);

const command = `export const UI_VERSION = '${version}';\n`;

writeFileSync(filePath, command);
