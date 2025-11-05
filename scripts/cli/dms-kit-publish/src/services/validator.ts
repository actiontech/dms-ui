import * as fs from 'fs';
import { execa } from 'execa';
import semver from 'semver';
import { config } from '../config/index';
import { ErrorCode, DeployError } from '../types/index';
import { successLog, warnLog } from '../utils/logger';

/**
 * 版本校验器
 * 负责验证版本号格式、递增和 CHANGELOG 一致性
 */
export class VersionValidator {
  /**
   * 验证版本号格式
   * @param version 版本号
   * @returns 是否有效
   */
  validateFormat(version: string): boolean {
    return semver.valid(version) !== null;
  }

  /**
   * 验证版本号递增
   * @param pkgName 包名
   * @param newVersion 新版本号
   * @returns 是否应该发布（版本号大于当前版本）
   */
  async validateIncrement(
    pkgName: string,
    newVersion: string
  ): Promise<boolean> {
    try {
      console.log(config.pnpm.registry, 'config.pnpm.registry');
      const { stdout } = await execa('pnpm', [
        'view',
        pkgName,
        'version',
        '--registry',
        config.pnpm.registry
      ]);

      const currentVersion = stdout.trim();

      // 比较版本号
      if (semver.lt(newVersion, currentVersion)) {
        throw new DeployError(
          ErrorCode.VERSION_INVALID,
          `新版本 ${newVersion} 必须大于当前版本 ${currentVersion}`
        );
      }

      if (semver.eq(newVersion, currentVersion)) {
        warnLog(
          `包 ${pkgName} 版本 ${newVersion} 与已发布版本相同，将跳过发布。`
        );
        return false;
      }

      // 检查版本跳跃是否合理
      const diff = semver.diff(currentVersion, newVersion);
      if (diff === 'major') {
        warnLog(`⚠️  检测到主版本号升级: ${currentVersion} → ${newVersion}`);
        warnLog('   请确认这是一个包含破坏性更改的版本');
      }

      successLog(`版本号校验通过: ${currentVersion} → ${newVersion}`);
      return true;
    } catch (error: any) {
      // 如果包还未发布，跳过检查
      if (error.message && error.message.includes('404')) {
        console.log(`包 ${pkgName} 首次发布`);
        return true;
      }
      throw error;
    }
  }

  /**
   * 验证版本号与 CHANGELOG 一致
   * @param changelogPath CHANGELOG 文件路径
   * @param version 版本号
   * @returns 是否一致
   */
  validateChangelog(changelogPath: string, version: string): boolean {
    const content = fs.readFileSync(changelogPath, 'utf-8');
    const hasVersion = new RegExp(`^## ${version}`, 'm').test(content);

    if (!hasVersion) {
      throw new DeployError(
        ErrorCode.CHANGELOG_MISSING,
        `CHANGELOG.md 中未找到版本 ${version} 的更新说明`
      );
    }

    return true;
  }
}
