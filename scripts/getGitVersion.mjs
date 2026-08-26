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

// 长分支名单行会触发 prettier printWidth，拆成多行避免 docker_build_ee 失败
const command = `export const UI_VERSION =\n  '${version}';\n`;
writeFileSync(filePath, command);
