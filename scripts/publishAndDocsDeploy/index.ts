// 从 package.json 中获取对应包名称和版本
// `[包]@[版本]`未发布时，发布包
// 构建文档和部署文档
// 推送 tag

import * as fs from 'fs';
import * as path from 'path';
import { Client as ftpClient } from 'basic-ftp';
import archiver from 'archiver';
import axios from 'axios';
import { execa } from 'execa';
import chalk from 'chalk';
import { ServerSDK } from '@actiontech/robot-server-sdk';

// 配置
const config = {
  pnpm: {
    registry: 'http://10.186.18.19:4873/',
    name: '@actiontech:registry',
    preCom: '@actiontech',
    auth: '//10.186.18.19:4873/:_auth="cHVibGlzaGVyOnB1Ymxpc2hlcg=="'
  },
  ftpServer: {
    host: '10.186.18.90',
    user: 'ftpadmin',
    password: 'KFQsB9g0aut7'
  },
  ftpDir: path.join('/actiontech-dms-ui', 'docs'),
  githubApi: {
    owner: 'actiontech', // GitHub 用户名或组织名
    repo: 'dms-ui', // GitHub 仓库名
    baseUrl: 'https://api.github.com', // GitHub API 基础 URL
    projectId: 706476902
  }
};

// 包配置
const packages = [
  {
    dir: 'icons',
    distDir: path.join(process.cwd(), 'packages/icons/docs-dist'),
    changelogPath: path.join(process.cwd(), 'packages/icons/docs/CHANGELOG.md')
  },
  {
    dir: 'dms-kit',
    distDir: path.join(process.cwd(), 'packages/dms-kit/docs-dist'),
    changelogPath: path.join(
      process.cwd(),
      'packages/dms-kit/docs/CHANGELOG.md'
    )
  }
];

// 日志工具
const stepLog = (msg: string) => console.log(chalk.magenta(`>> ${msg}`));
const successLog = (msg: string) => console.log(chalk.green(msg));
const errorLog = (msg: string) => console.log(chalk.red(msg));

const robotSDK = new ServerSDK({ baseUrl: 'http://10.186.18.19:8000' });

interface PackageInfo {
  name: string;
  version: string;
  dir: string;
  distDir: string;
  changelogPath: string;
}

class DmsUiDeploy {
  private pkgs: PackageInfo[] = [];
  private cwd = process.cwd();

  async start() {
    try {
      stepLog('获取包信息');
      await this.loadPkgInfo();

      if (!this.pkgs.length) {
        console.log('未找到有效的包信息');
        return;
      }

      // stepLog('步骤1: 发布包');
      // await this.publishPkg();

      stepLog('步骤2: 部署文档');
      await this.deployDocs();

      // stepLog('步骤3: 推送版本标签');
      // 没有 github token 暂不推送
      // await this.setGitRegistryTag();

      successLog('所有步骤执行完成');
      process.exit(0);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loadPkgInfo() {
    // 检查 Git 状态
    // const { stdout: unSubmitted } = await execa('git', [
    //   'status',
    //   '--porcelain'
    // ]);
    // if (unSubmitted || !this.cwd.endsWith('/app')) {
    //   errorLog('禁止手动执行该脚本');
    //   process.exit(1);
    // }

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

        this.pkgs.push({
          ...pkg,
          name,
          version
        });
      } catch (error) {
        errorLog(`加载包信息失败: ${pkg.dir} - ${error}`);
        throw error;
      }
    }
  }

  private async publishPkg() {
    for (const pkg of this.pkgs) {
      // 检查包是否已发布
      let isPublished = false;
      try {
        const { stdout } = await execa('pnpm', [
          'info',
          `${pkg.name}@${pkg.version}`,
          '--registry',
          config.pnpm.registry
        ]);
        if (stdout.length) {
          isPublished = true;
        }
      } catch {
        isPublished = false;
      }

      if (isPublished) {
        console.log(`包 ${pkg.name}@${pkg.version} 已发布，跳过发布步骤`);
        continue;
      }

      try {
        stepLog(`发布包 ${pkg.name}@${pkg.version}`);
        if (pkg.dir === 'icons') {
          await execa(
            'node',
            ['packages/icons/publish-icons.mjs', '--skip-confirm'],
            {
              cwd: path.join(this.cwd, 'packages', 'icons')
            }
          );
          return;
        }
        const pkgPath = path.join(this.cwd, 'packages', pkg.dir);

        // 设置 npm 认证
        await execa('pnpm', ['config', 'set', config.pnpm.auth], {
          cwd: pkgPath
        });

        // 发布包
        const tag = pkg.version.includes('beta') ? 'beta' : 'latest';
        await execa(
          'pnpm',
          [
            'publish',
            '--registry',
            config.pnpm.registry,
            '--tag',
            tag,
            '--no-git-checks'
          ],
          { cwd: pkgPath }
        );

        successLog(`包 ${pkg.name}@${pkg.version} 发布成功`);
      } catch (error) {
        errorLog(`包 ${pkg.name}@${pkg.version} 发布失败`);
        this.handleError(error);
      }
    }
  }

  private async deployDocs() {
    stepLog('上传文档到 FTP 服务器');
    const ftp = new ftpClient();

    try {
      await ftp.access(config.ftpServer);

      const packageList: Array<{
        filepath: string;
        name: string;
        version: string;
        changelog: string;
      }> = [];

      for (const pkg of this.pkgs) {
        const zipFileName = `${pkg.dir}-v${pkg.version}.zip`;

        // 检查文档是否已部署
        let isDeployed = false;
        try {
          await ftp.ensureDir(config.ftpDir);
          const list = await ftp.list(config.ftpDir);
          isDeployed = list.some((file) => file.name === zipFileName);
        } catch {
          isDeployed = false;
        }

        if (isDeployed) {
          console.log(`文档 ${zipFileName} 已存在，跳过上传`);
          continue;
        }

        stepLog(`构建并上传文档: ${pkg.dir}`);
        if (pkg.dir === 'icons') {
          await execa('pnpm', ['docs:g'], {
            cwd: path.join(this.cwd, 'packages', 'icons')
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
        const modifiedConfig = originalConfig.replaceAll(
          '/dms-docs',
          `/doc/${pkg.dir}-v${pkg.version.split('.')[0]}`
        );

        // 写入修改后的配置
        fs.writeFileSync(dumiConfigPath, modifiedConfig);

        try {
          // 构建文档
          await execa('pnpm', ['docs:build'], {
            cwd: path.join(this.cwd, 'packages', pkg.dir)
          });

          // 压缩文档
          await this.compressFolder(
            pkg.distDir,
            path.join(this.cwd, zipFileName)
          );

          // 上传到 FTP
          const readStream = fs.createReadStream(
            path.join(this.cwd, zipFileName)
          );
          await ftp.uploadFrom(
            readStream,
            path.join(config.ftpDir, zipFileName)
          );

          // 清理临时文件
          fs.unlinkSync(path.join(this.cwd, zipFileName));
          packageList.push({
            filepath: path.join(config.ftpDir, zipFileName),
            name: pkg.name,
            version: pkg.version,
            changelog: getChangelogForVersion(pkg.changelogPath, pkg.version)
          });

          successLog(`${zipFileName} 已上传至 FTP 服务器`);
        } finally {
          // 恢复原始配置
          fs.writeFileSync(dumiConfigPath, originalConfig);
        }
      }

      successLog('文档网站产物传输成功');
      // 发送部署请求
      if (packageList.length) {
        stepLog('发送文档部署请求');
        await robotSDK.docManagement.dmpKitDeploy({
          body: {
            package_list: packageList,
            project_id: config.githubApi.projectId
          }
        });
        successLog('文档部署请求发送成功');
      }
    } catch (err) {
      errorLog('文档部署失败');
      this.handleError(err);
    } finally {
      ftp.close();
    }
  }

  private async setGitRegistryTag() {
    const { stdout: tagShell } = await execa('git', ['tag']);
    const githubToken = (
      await robotSDK.project.getProject({
        params: { id: config.githubApi.projectId }
      })
    ).data.data?.token;

    for (const pkg of this.pkgs) {
      const tag = `v${pkg.version}@${pkg.dir}`;

      if (tagShell.includes(tag)) {
        console.log(`标签 ${tag} 已存在，跳过推送`);
        continue;
      }

      try {
        const { stdout: localCommit } = await execa('git', [
          'rev-parse',
          'HEAD'
        ]);

        const tagUrl = `${config.githubApi.baseUrl}/repos/${config.githubApi.owner}/${config.githubApi.repo}/git/refs`;

        await axios.post(
          tagUrl,
          {
            ref: `refs/tags/${tag}`,
            sha: localCommit
          },
          {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'dms-ui-deploy-script'
            }
          }
        );

        successLog(`Git 仓库标签 ${tag} 添加成功`);
      } catch (error) {
        errorLog(`Git 仓库标签 ${tag} 添加失败`);
        this.handleError(error);
      }
    }
  }

  private async compressFolder(
    sourceDir: string,
    outputZipPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const outputStream = fs.createWriteStream(outputZipPath);

      outputStream.on('close', resolve);
      outputStream.on('error', reject);

      archive.pipe(outputStream);
      archive.directory(sourceDir, path.basename(sourceDir));
      archive.finalize();
    });
  }

  private handleError(error: any) {
    console.error(error);
    process.exit(1);
  }
}

// 运行部署
new DmsUiDeploy().start();

function getChangelogForVersion(changelogPath: string, version: string) {
  try {
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');

    // 构建版本标题的正则表达式
    // 匹配 ## version 后面的内容，直到下一个 ## 或文件结尾
    const versionPattern = new RegExp(
      `## ${version}(?:\\s+[^\\n]*)?\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
      'i'
    );
    const match = changelogContent.match(versionPattern);

    if (match && match[1]) {
      // 清理内容，移除多余的空行和缩进
      const content = match[1]
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');

      return content;
    }

    console.log(`未找到版本 ${version} 的 changelog`);
    return `未找到版本 ${version} 的 changelog`;
  } catch (error) {
    console.error('读取 changelog.md 文件失败:', error);
    return `读取 changelog.md 文件失败: ${error}`;
  }
}
