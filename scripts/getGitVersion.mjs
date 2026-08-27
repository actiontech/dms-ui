import { execSync } from 'child_process';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

let version = '';
const branch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8'
});
const commitId = execSync('git rev-parse --short HEAD', {
  encoding: 'utf8'
});
version = `${branch.split('\n')[0]}   ${commitId.split('\n')[0]}`;
const filePath = resolve(process.cwd(), './src/scripts/version.ts');

// 与 .eslintrc.json prettier/prettier.printWidth 保持一致：
// 短分支名单行即可；超过 80 才拆行。一律拆行会在短分支上触发 Delete ⏎。
const PRINT_WIDTH = 80;
const oneLine = `export const UI_VERSION = '${version}';`;
const command =
  oneLine.length > PRINT_WIDTH
    ? `export const UI_VERSION =\n  '${version}';\n`
    : `${oneLine}\n`;
writeFileSync(filePath, command);
