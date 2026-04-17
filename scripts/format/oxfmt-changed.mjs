import { spawnSync } from 'node:child_process';

const allowedPrefixes = ['packages/', 'scripts/cli/'];
const allowedExtensions = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.less',
  '.scss'
]);

function runGit(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(' ')} failed`);
  }
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function isAllowedFile(file) {
  if (!allowedPrefixes.some((prefix) => file.startsWith(prefix))) {
    return false;
  }
  if (
    file.includes('/node_modules/') ||
    file.includes('/dist/') ||
    file.includes('/coverage/')
  ) {
    return false;
  }
  const dot = file.lastIndexOf('.');
  const ext = dot >= 0 ? file.slice(dot) : '';
  return allowedExtensions.has(ext);
}

const mode = process.argv.includes('--check') ? '--check' : '--write';

const changedTracked = runGit(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD']);
const changedUntracked = runGit(['ls-files', '--others', '--exclude-standard']);
const merged = [...new Set([...changedTracked, ...changedUntracked])].filter(
  isAllowedFile
);

if (merged.length === 0) {
  console.log('No changed files matched oxfmt scope.');
  process.exit(0);
}

const args = ['oxfmt', mode, ...merged];
const run = spawnSync('pnpm', args, { stdio: 'inherit' });
process.exit(run.status ?? 1);
