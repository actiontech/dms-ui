import * as os from 'os';
import * as path from 'path';

/**
 * 获取 pnpm/npm 命令的环境变量配置
 * 解决 CI/CD 环境中的缓存目录权限问题
 */
export function getPnpmEnv(): Record<string, string> {
  const tempDir = os.tmpdir();
  const npmCacheDir = path.join(tempDir, '.npm-cache');
  const pnpmCacheDir = path.join(tempDir, '.pnpm-store');
  const npmrcPath = path.join(tempDir, '.npmrc');

  return {
    ...process.env,
    npm_config_cache: npmCacheDir,
    NPM_CONFIG_CACHE: npmCacheDir,
    PNPM_HOME: pnpmCacheDir,
    npm_config_userconfig: npmrcPath,
    NPM_CONFIG_USERCONFIG: npmrcPath,
    npm_config_globalconfig: '/dev/null',
    NPM_CONFIG_GLOBALCONFIG: '/dev/null',
    npm_config_prefer_offline: 'false'
  } as Record<string, string>;
}
