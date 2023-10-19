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

const command = `export const UI_VERSION = '${version}';\n`;
writeFileSync(filePath, command);
