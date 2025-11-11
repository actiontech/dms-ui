import * as path from 'path';
import type { PackageConfig } from '../types/index';

// 项目根目录
const projectRoot = path.join(__dirname, '..', '..', '..', '..', '..');

// 包配置列表
export const packages: PackageConfig[] = [
  {
    dir: 'icons',
    distDir: path.join(projectRoot, 'packages', 'icons', 'docs-dist'),
    changelogPath: path.join(
      projectRoot,
      'packages',
      'icons',
      'docs',
      'CHANGELOG.md'
    )
  },
  {
    dir: 'dms-kit',
    distDir: path.join(projectRoot, 'packages', 'dms-kit', 'docs-dist'),
    changelogPath: path.join(
      projectRoot,
      'packages',
      'dms-kit',
      'docs',
      'CHANGELOG.md'
    )
  }
];

// 导出项目根目录
export { projectRoot };
