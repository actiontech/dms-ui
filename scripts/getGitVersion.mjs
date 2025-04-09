import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const edition = process.argv[2] ?? 'ce';

let version = '';

try {
  // 获取当前 commit hash
  const currentCommit = execSync('git rev-parse HEAD', {
    encoding: 'utf8'
  }).trim();

  // 获取所有 tag 并按创建时间倒序排序
  const tags = execSync(
    'git tag --sort=-creatordate -l --format="%(objectname) %(refname:short)"',
    {
      encoding: 'utf8'
    }
  )
    .trim()
    .split('\n')
    .filter(Boolean); // 过滤空行

  // 找到所有与当前 commit 关联的 tag
  const matchingTags = tags.filter((t) =>
    t.split(' ')[0].startsWith(currentCommit)
  );

  if (matchingTags.length === 0) {
    throw new Error('No tag found for current commit');
  }

  const selectedTag = matchingTags[matchingTags.length - 1] || matchingTags[0];

  const formattedTag = selectedTag.split(' ')[1].replace(/^v/i, '');
  const commitId = execSync('git rev-parse --short HEAD', {
    encoding: 'utf8'
  }).trim();

  // 如果成功获取到 tag，使用 tag + commitId
  version = `${formattedTag}-${edition}   ${commitId}`;
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
  // import.meta.dirname 需要 node v20 +
  __dirname,
  '..',
  'packages',
  'base',
  'src',
  'scripts',
  'version.ts'
);

const command = `export const UI_VERSION = '${version}';\n`;

writeFileSync(filePath, command);
