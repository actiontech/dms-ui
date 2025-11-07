import * as fs from 'fs';
import * as path from 'path';
import { Client as ftpClient } from 'basic-ftp';
import { execa } from 'execa';
import { Octokit } from '@octokit/rest';
import { config, ENV, RETRY_DEPLOY_TRIGGER } from '../config/index';
import { packages, projectRoot } from '../constants/packages';
import {
  ErrorCode,
  DeployError,
  PackageInfo,
  ZipFileInfo
} from '../types/index';
import {
  stepLog,
  successLog,
  errorLog,
  warnLog,
  infoLog
} from '../utils/logger';
import { getChangelogForVersion } from '../utils/changelog';
import { compressFolder } from '../utils/compress';
import { VersionValidator } from './validator';
import { NotificationService } from './notification';
import axios from 'axios';
import { getPnpmEnv } from '../utils/exec';

/**
 * DMS UI 部署主类
 * 负责整个部署流程的协调和执行
 */
export class DmsKitPublish {
  private pkgs: PackageInfo[] = [];
  private cwd = projectRoot;
  private validator = new VersionValidator();
  private notificationService = new NotificationService();
  private currentPhase: 'preparation' | 'publishing' = 'preparation';

  /**
   * 启动部署流程
   */
  async start() {
    const startTime = Date.now();
    let zipFiles: ZipFileInfo[] = [];
    try {
      // 如果是重试部署触发模式
      if (RETRY_DEPLOY_TRIGGER) {
        infoLog('\n========================================');
        infoLog('         重试部署触发模式');
        infoLog('========================================\n');

        await this.retryDeployTrigger();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        successLog(`\n部署触发完成 (耗时: ${duration}s)`);
        process.exit(0);
      }

      infoLog('\n========================================');
      infoLog('         准备阶段');
      infoLog('========================================\n');

      // 验证必需的环境变量
      this.validateEnvironmentVariables();

      stepLog('获取包信息');
      await this.loadPkgInfo();

      if (!this.pkgs.length) {
        infoLog('未找到有效的包信息');
        return;
      }

      // 验证 FTP 连接
      await this.validateFtpConnection();

      // 构建文档
      await this.buildDocs();

      // 压缩文档
      zipFiles = await this.compressDocs();

      infoLog('\n========================================');
      infoLog('         发布阶段');
      infoLog('========================================\n');

      // 进入发布阶段
      this.currentPhase = 'publishing';

      // 发布包
      await this.publishPkg();

      // 创建并推送 Git tags
      await this.createGitTags();

      // 上传文档
      await this.uploadDocs(zipFiles);

      // 触发文档部署
      await this.triggerDocsDeploy(zipFiles);

      // 清理临时文件
      this.cleanupTempFiles(zipFiles);

      // stepLog('步骤3: 推送版本标签');
      // 没有 github token 暂不推送
      // await this.setGitRegistryTag();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      successLog(`\n所有步骤执行完成 (耗时: ${duration}s)`);

      // 发送成功通知
      const notificationContent = `环境: ${ENV}

执行步骤:
  1. ✓ 验证环境变量
  2. ✓ 获取包信息
  3. ✓ 验证 FTP 连接 (准备阶段)
  4. ✓ 构建文档 (准备阶段)
  5. ✓ 压缩文档 (准备阶段)
  6. ✓ 发布包 (发布阶段)
  7. ✓ 创建 Git Tags (发布阶段)
  8. ✓ 上传文档 (发布阶段)
  9. ✓ 触发文档部署 (发布阶段)

包列表:
${this.pkgs.map((p) => `  - ${p.name}@${p.version}`).join('\n')}

Git Tags:
${this.pkgs.map((p) => `  - ${p.dir}-v${p.version}`).join('\n')}

总耗时: ${duration}s`;

      await this.notificationService.sendEmailNotification(
        '发布成功',
        notificationContent
      );

      process.exit(0);
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      // 发送失败通知
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.notificationService.sendEmailNotification(
        '发布失败',
        `环境: ${ENV}\n错误信息:\n${errorMessage}\n耗时: ${duration}s`,
        true
      );

      this.handleError(error);
    }
  }

  /**
   * 验证必需的环境变量
   */
  private validateEnvironmentVariables() {
    const requiredVars: Array<{ name: string; value: any; env: string[] }> = [
      { name: 'NPM_REGISTRY', value: config.pnpm.registry, env: ['all'] },
      { name: 'FTP_HOST', value: config.ftpServer.host, env: ['all'] },
      {
        name: 'FTP_USER',
        value: config.ftpServer.user,
        env: ['production']
      },
      {
        name: 'FTP_PASSWORD',
        value: config.ftpServer.password,
        env: ['production']
      },
      { name: 'GITHUB_TOKEN', value: config.githubApi.token, env: ['all'] }
    ];

    const missing: string[] = [];

    for (const varCheck of requiredVars) {
      if (
        varCheck.env.includes('all') ||
        varCheck.env.includes(ENV.toLowerCase())
      ) {
        if (!varCheck.value || varCheck.value === '') {
          missing.push(varCheck.name);
        }
      }
    }

    if (missing.length > 0) {
      throw new DeployError(
        ErrorCode.ENV_VAR_MISSING,
        `缺少必需的环境变量: ${missing.join(', ')}`,
        { missing }
      );
    }

    successLog('环境变量检查通过');
  }

  /**
   * 重试部署触发
   */
  private async retryDeployTrigger() {
    stepLog('读取包信息');

    // 从 package.json 读取所有包的信息
    const allPackages: PackageInfo[] = [];
    for (const pkg of packages) {
      try {
        const packageJsonPath = path.join(
          this.cwd,
          `packages/${pkg.dir}/package.json`
        );
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf-8')
        );
        const { name, version } = packageJson;

        allPackages.push({
          ...pkg,
          name,
          version
        });

        infoLog(`  读取包信息: ${name}@${version}`);
      } catch (error: any) {
        warnLog(`跳过包 ${pkg.dir}: ${error.message}`);
      }
    }

    if (allPackages.length === 0) {
      throw new Error('未找到任何包信息');
    }

    // 连接 FTP 检查哪些版本已上传
    stepLog('检查 FTP 服务器上的文件');
    const ftp = new ftpClient();
    const existingPackages: PackageInfo[] = [];

    try {
      await ftp.access(config.ftpServer);
      const list = await ftp.list(config.ftpDir);

      for (const pkg of allPackages) {
        const zipFileName = `${pkg.dir}-v${pkg.version}.zip`;
        const exists = list.some((file) => file.name === zipFileName);

        if (exists) {
          existingPackages.push(pkg);
          successLog(`  找到已上传文件: ${zipFileName}`);
        } else {
          warnLog(`  未找到文件: ${zipFileName}`);
        }
      }
    } catch (error: any) {
      throw new DeployError(ErrorCode.FTP_UPLOAD_FAILED, 'FTP 连接失败', {
        originalError: error.message
      });
    } finally {
      ftp.close();
    }

    if (existingPackages.length === 0) {
      throw new Error('FTP 服务器上未找到任何已上传的文档包');
    }

    // 构建 zipFiles 信息
    const zipFiles: ZipFileInfo[] = existingPackages.map((pkg) => ({
      pkg,
      zipPath: path.join(this.cwd, `${pkg.dir}-v${pkg.version}.zip`)
    }));

    // 触发文档部署
    stepLog('触发文档部署');
    await this.triggerDocsDeploy(zipFiles);

    successLog(`成功触发 ${existingPackages.length} 个包的文档部署`);
  }

  /**
   * 加载包信息并验证
   */
  private async loadPkgInfo() {
    for (const pkg of packages) {
      try {
        const packageJsonPath = path.join(
          this.cwd,
          `packages/${pkg.dir}/package.json`
        );
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf-8')
        );
        const { name, version } = packageJson;

        // 验证版本号格式
        if (!this.validator.validateFormat(version)) {
          throw new DeployError(
            ErrorCode.VERSION_INVALID,
            `版本号格式不正确: ${version}`
          );
        }

        // 验证版本号递增
        const shouldPublish = await this.validator.validateIncrement(
          name,
          version
        );

        if (shouldPublish) {
          // 验证 CHANGELOG
          this.validator.validateChangelog(pkg.changelogPath, version);

          this.pkgs.push({
            ...pkg,
            name,
            version
          });

          successLog(`包信息加载成功: ${name}@${version}`);
        }
      } catch (error: any) {
        throw new DeployError(
          ErrorCode.PKG_LOAD_FAILED,
          `加载包信息失败: ${pkg.dir}`,
          { originalError: error.message }
        );
      }
    }
  }

  /**
   * 发布包到 npm 仓库
   */
  private async publishPkg() {
    for (const pkg of this.pkgs) {
      // 检查包是否已发布
      let isPublished = false;
      try {
        const { stdout } = await execa(
          'pnpm',
          [
            'info',
            `${pkg.name}@${pkg.version}`,
            '--registry',
            config.pnpm.registry
          ],
          {
            env: getPnpmEnv()
          }
        );
        if (stdout.length) {
          isPublished = true;
        }
      } catch {
        isPublished = false;
      }

      if (isPublished) {
        infoLog(`包 ${pkg.name}@${pkg.version} 已发布，跳过发布步骤`);
        continue;
      }

      try {
        stepLog(`发布包 ${pkg.name}@${pkg.version}`);
        if (pkg.dir === 'icons') {
          await this.publishIconsPackage(pkg);
          continue;
        }
        const pkgPath = path.join(this.cwd, 'packages', pkg.dir);

        // 设置 npm 认证
        await execa('pnpm', ['config', 'set', config.pnpm.auth], {
          cwd: pkgPath,
          env: getPnpmEnv()
        });

        // 发布包
        await execa(
          'pnpm',
          ['publish', '--registry', config.pnpm.registry, '--no-git-checks'],
          {
            cwd: pkgPath,
            env: getPnpmEnv()
          }
        );

        successLog(`包 ${pkg.name}@${pkg.version} 发布成功`);
      } catch (error: any) {
        throw new DeployError(
          ErrorCode.NPM_PUBLISH_FAILED,
          `包 ${pkg.name}@${pkg.version} 发布失败`,
          { originalError: error.message }
        );
      }
    }
  }

  /**
   * 创建并推送 Git Tags
   */
  private async createGitTags() {
    stepLog('创建并推送 Git Tags');

    // 初始化 Octokit 实例
    const octokit = new Octokit({
      auth: config.githubApi.token
    });

    try {
      // 1. 获取当前分支的最新 commit SHA
      const { data: refData } = await octokit.git.getRef({
        owner: config.githubApi.owner,
        repo: config.githubApi.repo,
        ref: 'heads/main'
      });

      const commitSha = refData.object.sha;
      infoLog(`  当前 commit SHA: ${commitSha}`);

      // 2. 为每个包创建 tag
      for (const pkg of this.pkgs) {
        const tagName = `${pkg.dir}-v${pkg.version}`;

        try {
          // 检查 tag 是否已存在
          try {
            await octokit.git.getRef({
              owner: config.githubApi.owner,
              repo: config.githubApi.repo,
              ref: `tags/${tagName}`
            });
            infoLog(`  Tag ${tagName} 已存在，跳过创建`);
            continue;
          } catch (error: any) {
            // tag 不存在，继续创建
            if (error.status !== 404) {
              throw error;
            }
          }

          // 3. 创建 tag 对象
          const { data: tagData } = await octokit.git.createTag({
            owner: config.githubApi.owner,
            repo: config.githubApi.repo,
            tag: tagName,
            message: `Release ${pkg.name}@${pkg.version}`,
            object: commitSha,
            type: 'commit'
          });

          // 4. 创建 tag 引用
          await octokit.git.createRef({
            owner: config.githubApi.owner,
            repo: config.githubApi.repo,
            ref: `refs/tags/${tagName}`,
            sha: tagData.sha
          });

          successLog(`  Tag ${tagName} 创建成功`);
        } catch (error: any) {
          throw new DeployError(
            ErrorCode.TAG_PUSH_FAILED,
            `创建 tag ${tagName} 失败`,
            {
              originalError: error.message,
              status: error.status
            }
          );
        }
      }

      successLog('Git Tags 创建完成');
    } catch (error: any) {
      if (error instanceof DeployError) {
        throw error;
      }
      throw new DeployError(ErrorCode.TAG_PUSH_FAILED, '获取 commit SHA 失败', {
        originalError: error.message,
        status: error.status
      });
    }
  }

  /**
   * 构建文档
   */
  private async buildDocs() {
    stepLog('构建文档');

    for (const pkg of this.pkgs) {
      stepLog(`构建文档: ${pkg.dir}`);

      // icons 包特殊处理
      if (pkg.dir === 'icons') {
        await execa('pnpm', ['docs:g'], {
          cwd: path.join(this.cwd, 'packages', 'icons'),
          env: getPnpmEnv()
        });
      }

      const dumiConfigPath = path.join(
        this.cwd,
        'packages',
        pkg.dir,
        '.dumirc.ts'
      );

      // 读取原始配置
      const originalConfig = fs.readFileSync(dumiConfigPath, 'utf-8');

      // 修改配置用于构建
      const modifiedConfig = originalConfig.replace(
        new RegExp(`/dms-docs`, 'g'),
        `/doc/${pkg.dir}-v${pkg.version.split('.')[0]}`
      );

      // 写入修改后的配置
      fs.writeFileSync(dumiConfigPath, modifiedConfig);

      try {
        // 构建文档
        await execa('pnpm', ['docs:build'], {
          cwd: path.join(this.cwd, 'packages', pkg.dir),
          env: getPnpmEnv()
        });

        // 验证构建产物
        if (!fs.existsSync(pkg.distDir)) {
          throw new DeployError(
            ErrorCode.DOCS_BUILD_FAILED,
            `构建产物不存在: ${pkg.distDir}`
          );
        }

        successLog(`文档构建完成: ${pkg.dir}`);
      } catch (error: any) {
        throw new DeployError(
          ErrorCode.DOCS_BUILD_FAILED,
          `文档构建失败: ${pkg.dir}`,
          { originalError: error.message }
        );
      } finally {
        // 恢复原始配置
        fs.writeFileSync(dumiConfigPath, originalConfig);
      }
    }
  }

  /**
   * 压缩文档
   */
  private async compressDocs(): Promise<ZipFileInfo[]> {
    stepLog('压缩文档');

    const zipFiles: ZipFileInfo[] = [];

    for (const pkg of this.pkgs) {
      const zipFileName = `${pkg.dir}-v${pkg.version}.zip`;
      const zipPath = path.join(this.cwd, zipFileName);

      await compressFolder(pkg.distDir, zipPath);

      // 验证压缩文件
      const stats = fs.statSync(zipPath);
      infoLog(`  ${pkg.dir}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

      zipFiles.push({ pkg, zipPath });
    }

    successLog('文档压缩完成');
    return zipFiles;
  }

  /**
   * 确保 FTP 目录存在（递归创建）
   */
  private async ensureFtpDir(ftp: ftpClient, dirPath: string): Promise<void> {
    infoLog(`  正在确保 FTP 目录存在: ${dirPath}`);

    try {
      // 尝试使用 basic-ftp 的 ensureDir 方法，它会自动递归创建目录
      await ftp.ensureDir(dirPath);
      infoLog(`  FTP 目录已准备就绪: ${dirPath}`);
    } catch (error: any) {
      throw new Error(`确保 FTP 目录失败 ${dirPath}: ${error.message}`);
    }
  }

  /**
   * 验证 FTP 连接
   */
  private async validateFtpConnection(): Promise<void> {
    stepLog('验证 FTP 连接');
    const ftp = new ftpClient();
    const testFileName = '.test_write_permission';
    const testFilePath = path.join(config.ftpDir, testFileName);
    const tempTestFile = path.join(this.cwd, testFileName);

    try {
      await ftp.access(config.ftpServer);

      // 确保目录存在（递归创建）
      await this.ensureFtpDir(ftp, config.ftpDir);

      // 创建临时测试文件
      fs.writeFileSync(tempTestFile, 'test');

      // 测试写权限
      const testStream = fs.createReadStream(tempTestFile);
      await ftp.uploadFrom(testStream, testFilePath);
      await ftp.remove(testFilePath);

      successLog('FTP 连接验证通过');
    } catch (error: any) {
      throw new DeployError(
        ErrorCode.FTP_UPLOAD_FAILED,
        `FTP 连接验证失败，请检查服务器配置\n目标目录: ${config.ftpDir}`,
        { originalError: error.message }
      );
    } finally {
      ftp.close();
      // 清理本地临时文件
      if (fs.existsSync(tempTestFile)) {
        fs.unlinkSync(tempTestFile);
      }
    }
  }

  /**
   * 上传文档到 FTP
   */
  private async uploadDocs(zipFiles: ZipFileInfo[]) {
    stepLog('上传文档到 FTP');
    const ftp = new ftpClient();

    try {
      await ftp.access(config.ftpServer);

      // 确保目录存在（递归创建）
      await this.ensureFtpDir(ftp, config.ftpDir);

      for (const { zipPath } of zipFiles) {
        const zipFileName = path.basename(zipPath);

        // 检查文档是否已部署
        let isDeployed = false;
        try {
          const list = await ftp.list(config.ftpDir);
          isDeployed = list.some((file) => file.name === zipFileName);
        } catch {
          isDeployed = false;
        }

        if (isDeployed) {
          infoLog(`  ${zipFileName} 已存在，跳过上传`);
          continue;
        }

        // 上传
        const readStream = fs.createReadStream(zipPath);
        await ftp.uploadFrom(readStream, path.join(config.ftpDir, zipFileName));

        successLog(`  ${zipFileName} 上传成功`);
      }

      successLog('文档上传完成');
    } catch (error: any) {
      throw new DeployError(ErrorCode.FTP_UPLOAD_FAILED, 'FTP 上传失败', {
        originalError: error.message
      });
    } finally {
      ftp.close();
    }
  }

  /**
   * 触发文档部署
   */
  private async triggerDocsDeploy(zipFiles: ZipFileInfo[]) {
    const packageList = zipFiles.map(({ pkg, zipPath }) => ({
      filepath: path.join(config.ftpDir, path.basename(zipPath)),
      name: pkg.name,
      version: pkg.version,
      changelog: getChangelogForVersion(pkg.changelogPath, pkg.version)
    }));

    if (packageList.length === 0) {
      infoLog('没有需要部署的文档');
      return;
    }

    stepLog('发送文档部署请求');
    try {
      await axios.post(
        `${config.robotSDK.baseUrl}/v1/doc-management/dmp-kit-deploy`,
        {
          package_list: packageList,
          project_id: config.githubApi.projectId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      successLog('文档部署请求发送成功');
    } catch (error: any) {
      if (RETRY_DEPLOY_TRIGGER) {
        // 在重试模式下，抛出错误
        throw new DeployError(
          ErrorCode.NOTIFICATION_FAILED,
          '文档部署请求发送失败',
          { originalError: error.message }
        );
      } else {
        // 在正常流程中，只警告不中断
        warnLog('文档部署请求发送失败，但不影响主流程');
        errorLog(error.message);
        warnLog('\n💡 提示: 如需重试文档部署触发，可使用参数:');
        infoLog('--retry-deploy-trigger\n');
      }
    }
  }

  /**
   * 清理临时文件
   */
  private cleanupTempFiles(zipFiles: ZipFileInfo[]) {
    for (const { zipPath } of zipFiles) {
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
    }
    infoLog('临时文件清理完成');
  }

  /**
   * 发布 icons 包
   */
  private async publishIconsPackage(pkg: PackageInfo) {
    const iconsDir = path.join(this.cwd, 'packages', 'icons');
    const pubPkgPath = path.join(iconsDir, 'package_publish.json');

    // 1. 验证 package_publish.json 存在
    if (!fs.existsSync(pubPkgPath)) {
      throw new DeployError(
        ErrorCode.PKG_LOAD_FAILED,
        `发布用 package_publish.json 不存在: ${pubPkgPath}`
      );
    }

    // 2. 读取原始 package_publish.json 内容（用于错误恢复）
    const originalPubPkgContent = JSON.parse(
      fs.readFileSync(pubPkgPath, 'utf-8')
    );
    const originalVersion = originalPubPkgContent.version;

    // 3. 创建临时目录
    const tmpDir = path.join(this.cwd, 'packages', 'actiontech-icons-publish');

    try {
      infoLog('  [1/7] 创建临时目录');
      fs.mkdirSync(tmpDir, { recursive: true });

      // 4. 复制 icons 包到临时目录（排除不需要的文件）
      infoLog('  [2/7] 复制 icons 包到临时目录');
      const excludeTopLevel = new Set([
        'node_modules',
        'dist',
        'es',
        '.git',
        '.github',
        'coverage',
        '.nyc_output'
      ]);

      const filter = (filePath: string) => {
        const relativePath = path.relative(iconsDir, filePath);
        if (!relativePath) return true; // 根目录
        const segments = relativePath.split(path.sep);
        const top = segments[0];
        if (excludeTopLevel.has(top)) return false;
        const base = path.basename(filePath);
        if (base === '.DS_Store') return false;
        if (base.endsWith('.log')) return false;
        return true;
      };

      this.copyDirSync(iconsDir, tmpDir, { filter });

      // 5. 调整 package.json 配置
      infoLog('  [3/7] 调整 package.json 配置');
      const tmpPkgJson = path.join(tmpDir, 'package.json');
      const pubPkgContent = JSON.parse(fs.readFileSync(pubPkgPath, 'utf-8'));

      // 更新版本号
      pubPkgContent.version = pkg.version;

      // 移除 prepublishOnly 和 prepare 脚本
      if (pubPkgContent.scripts) {
        delete pubPkgContent.scripts.prepublishOnly;
        delete pubPkgContent.scripts.prepare;
      }

      fs.writeFileSync(
        tmpPkgJson,
        JSON.stringify(pubPkgContent, null, 2) + '\n'
      );

      // 6. 安装依赖
      infoLog('  [4/7] 安装依赖: pnpm install');
      await execa('pnpm', ['install'], { cwd: tmpDir, env: getPnpmEnv() });

      // 7. 执行构建
      infoLog('  [5/7] 执行构建: pnpm build');
      await execa('pnpm', ['build'], { cwd: tmpDir, env: getPnpmEnv() });

      // 8. 配置认证
      infoLog('  [6/7] 配置认证');
      await execa('pnpm', ['config', 'set', config.pnpm.auth], {
        cwd: tmpDir,
        env: getPnpmEnv()
      });

      // 9. 执行发布
      infoLog('  [7/7] 执行发布: pnpm publish');
      await execa(
        'pnpm',
        ['publish', '--registry', config.pnpm.registry, '--no-git-checks'],
        {
          cwd: tmpDir,
          env: getPnpmEnv()
        }
      );

      successLog(`包 ${pkg.name}@${pkg.version} 发布成功`);
    } catch (error: any) {
      // 还原原始版本号
      try {
        originalPubPkgContent.version = originalVersion;
        fs.writeFileSync(
          pubPkgPath,
          JSON.stringify(originalPubPkgContent, null, 2) + '\n'
        );
        warnLog(`已还原 package_publish.json 版本号为: ${originalVersion}`);
      } catch (restoreErr: any) {
        warnLog(`还原版本号失败: ${restoreErr.message}`);
      }

      throw new DeployError(
        ErrorCode.NPM_PUBLISH_FAILED,
        `包 ${pkg.name}@${pkg.version} 发布失败`,
        { originalError: error.message }
      );
    } finally {
      // 10. 清理临时目录
      infoLog('  [清理] 清理临时目录');
      try {
        if (fs.existsSync(tmpDir)) {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
      } catch (cleanupErr: any) {
        warnLog(`清理临时目录失败: ${cleanupErr.message}`);
      }
    }
  }

  /**
   * 复制目录（支持过滤）
   */
  private copyDirSync(
    src: string,
    dest: string,
    options: {
      filter?: (filePath: string) => boolean;
      dereference?: boolean;
    } = {}
  ) {
    const { filter = () => true, dereference = false } = options;

    const statFn = dereference ? fs.statSync : fs.lstatSync;

    const copyItem = (from: string, to: string) => {
      if (!filter(from)) return;
      const stat = statFn(from);
      if (stat.isDirectory()) {
        if (!fs.existsSync(to)) {
          fs.mkdirSync(to, { recursive: true });
        }
        const entries = fs.readdirSync(from);
        for (const entry of entries) {
          copyItem(path.join(from, entry), path.join(to, entry));
        }
      } else if (stat.isSymbolicLink()) {
        const real = fs.readlinkSync(from);
        fs.symlinkSync(real, to);
      } else if (stat.isFile()) {
        fs.copyFileSync(from, to);
      }
    };

    copyItem(src, dest);
  }

  /**
   * 错误处理
   */
  private handleError(error: any) {
    infoLog('\n');
    errorLog('========================================');
    errorLog('           部署失败');
    errorLog('========================================\n');

    // 根据阶段显示不同的提示
    if (this.currentPhase === 'preparation') {
      warnLog('⚠️  当前处于准备阶段，未发布任何包');
      warnLog('   可以修复问题后直接重新运行脚本\n');
    } else {
      warnLog('⚠️  当前处于发布阶段');
      warnLog('   部分包可能已发布，可重新运行脚本继续未完成的步骤\n');
    }

    if (error instanceof DeployError) {
      errorLog(`错误代码: ${error.code}`);
      errorLog(`错误信息: ${error.message}`);

      // 根据错误类型提供解决方案
      switch (error.code) {
        case ErrorCode.ENV_VAR_MISSING:
          infoLog('\n解决方案:');
          infoLog('  1. 检查 .env 文件配置');
          infoLog('  2. 确认 GoCD 中的环境变量配置');
          infoLog('  3. 参考 .env.example 文件');
          break;

        case ErrorCode.VERSION_INVALID:
          infoLog('\n解决方案:');
          infoLog('  1. 检查 package.json 中的版本号格式');
          infoLog('  2. 确保版本号大于当前已发布版本');
          infoLog('  3. 遵循语义化版本规范 (semver)');
          break;

        case ErrorCode.CHANGELOG_MISSING:
          infoLog('\n解决方案:');
          infoLog('  1. 在 CHANGELOG.md 中添加对应版本的更新说明');
          infoLog('  2. 格式: ## 版本号');
          break;

        case ErrorCode.NPM_PUBLISH_FAILED:
          infoLog('\n可能的原因:');
          infoLog('  1. npm 认证信息过期');
          infoLog('  2. 版本号已存在');
          infoLog('  3. 网络连接问题');
          infoLog('\n解决方案:');
          infoLog('  - 检查 NPM_AUTH 环境变量');
          infoLog('  - 确认版本号是否已更新');
          break;

        case ErrorCode.DOCS_BUILD_FAILED:
          infoLog('\n可能的原因:');
          infoLog('  1. 依赖未安装');
          infoLog('  2. 文档配置错误');
          infoLog('  3. 文档源文件有语法错误');
          infoLog('\n解决方案:');
          infoLog('  - 运行 pnpm install');
          infoLog('  - 检查 .dumirc.ts 配置');
          infoLog('  - 本地运行 pnpm docs:build 测试');
          break;

        case ErrorCode.FTP_UPLOAD_FAILED:
          infoLog('\n可能的原因:');
          infoLog('  1. FTP 服务器连接失败');
          infoLog('  2. 认证失败');
          infoLog('  3. 磁盘空间不足');
          infoLog('\n解决方案:');
          infoLog('  - 检查 FTP 服务器状态');
          infoLog('  - 验证 FTP 账号密码');
          infoLog('  - 测试 FTP 连接: ftp ' + config.ftpServer.host);
          break;

        case ErrorCode.TAG_PUSH_FAILED:
          infoLog('\n可能的原因:');
          infoLog('  1. GITHUB_TOKEN 环境变量未设置或无效');
          infoLog('  2. Token 权限不足（需要 repo 或 public_repo 权限）');
          infoLog('  3. 网络连接问题');
          infoLog('  4. Tag 已存在（可能是并发创建导致）');
          infoLog('  5. 指定的分支不存在（默认为 main）');
          infoLog('\n解决方案:');
          infoLog('  - 检查 GITHUB_TOKEN 环境变量是否正确设置');
          infoLog(
            '  - 确认 Token 具有 repo 权限（Settings > Developer settings > Personal access tokens）'
          );
          infoLog('  - 验证仓库地址和分支名称是否正确');
          infoLog('  - 检查网络连接是否正常');
          infoLog('  - 如果 Tag 已存在，可以忽略此错误');
          break;
      }

      if (error.details) {
        infoLog('\n详细信息:');
        infoLog(JSON.stringify(error.details, null, 2));
      }
    } else {
      errorLog(`未知错误: ${error.message || String(error)}`);
      if (error.stack) {
        errorLog(error.stack);
      }
    }

    errorLog('\n========================================\n');
    process.exit(1);
  }
}
