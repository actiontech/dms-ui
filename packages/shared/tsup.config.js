import { defineConfig } from 'tsup';
import fs from 'node:fs';
import path from 'node:path';

function generateEntriesFromPublishEntry() {
  const projectRoot = process.cwd();
  const publishEntryPath = path.resolve(projectRoot, 'lib', 'publish-entry.ts');
  let content = '';
  try {
    content = fs.readFileSync(publishEntryPath, 'utf8');
  } catch {
    return ['./lib/publish-entry.ts'];
  }

  const exportPathRegex =
    /export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"](.+?)['"];?/g;
  const includes = new Set();

  // 始终保留根入口
  includes.add('./lib/publish-entry.ts');

  let match = null;
  while ((match = exportPathRegex.exec(content)) !== null) {
    const rel = match[1];
    if (!rel || !rel.startsWith('./')) continue;
    const normalized = rel.replace(/^\.\//, '');
    const [head, second] = normalized.split('/');

    switch (head) {
      case 'components': {
        if (second) {
          includes.add(`./lib/components/${second}/**`);
        } else {
          includes.add('./lib/components/**');
        }
        break;
      }
      case 'styleWrapper':
      case 'utils':
      case 'enum':
      case 'data':
      case 'providers':
      case 'hooks':
      case 'features':
      case 'locale':
      case 'theme': {
        includes.add(`./lib/${head}/**`);
        break;
      }
      case 'types': {
        includes.add(`./lib/${normalized}.ts`);
        break;
      }
      default: {
        const abs = path.resolve(projectRoot, 'lib', normalized);
        try {
          if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
            includes.add(`./lib/${normalized}/**`);
          } else {
            includes.add(`./lib/${normalized}.ts`);
            includes.add(`./lib/${normalized}.tsx`);
          }
        } catch {
          // ignore
        }
      }
    }
  }

  const excludes = [
    '!./lib/**/__tests__/**',
    '!./lib/**/__mocks__/**',
    '!./lib/**/__snapshots__/**',
    '!./lib/**/demo/**',
    '!./lib/**/demos/**',
    '!./lib/**/*.test.ts',
    '!./lib/**/*.test.tsx',
    '!./lib/**/*.spec.ts',
    '!./lib/**/*.spec.tsx',
    '!./lib/**/*.stories.ts',
    '!./lib/**/*.stories.tsx',
    '!./lib/**/*.md',
    '!./lib/components/**/*.types.ts',
    '!./lib/components/**/*.type.ts',
    '!./lib/**/test/**'
  ];

  return [...includes, ...excludes];
}

export default defineConfig({
  // 根据 publish-entry.ts 的导出生成多入口，仅构建被导出的模块
  entry: generateEntriesFromPublishEntry(),
  tsconfig: 'tsconfig.build.json',
  bundle: false,
  format: ['cjs', 'esm'],
  dts: {
    entry: ['./lib/publish-entry.ts']
  },
  clean: true,
  sourcemap: false,
  minify: false,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  splitting: false,
  platform: 'browser'
});
