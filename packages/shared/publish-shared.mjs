#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

function parseArgs(argv) {
  const args = { version: '', skipConfirm: false };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--version' || key === '-v') {
      args.version = val || '';
      i += 1;
    } else if (key === '--skip-confirm' || key === '-y') {
      args.skipConfirm = true;
    }
  }
  return args;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, obj) {
  const content = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(filePath, content, 'utf8');
}

function ensureFileExists(filePath, desc) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${desc} 不存在: ${filePath}`);
  }
}

function runCmd(cmd, args, cwd) {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd,
    env: process.env,
    shell: process.platform === 'win32'
  });
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} 执行失败，退出码 ${res.status}`);
  }
}

function copyDirSync(src, dest, options = {}) {
  const { filter = (p) => true, dereference = false } = options;

  const statFn = dereference ? fs.statSync : fs.lstatSync;

  const copyItem = (from, to) => {
    if (!filter(from)) return;
    const stat = statFn(from);
    if (stat.isDirectory()) {
      if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
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

function renameRootPublishEntryToIndex(distRoot) {
  const renames = [
    ['publish-entry.js', 'index.js'],
    ['publish-entry.mjs', 'index.mjs'],
    ['publish-entry.d.ts', 'index.d.ts'],
    ['publish-entry.d.mts', 'index.d.mts']
  ];
  for (const [fromName, toName] of renames) {
    const from = path.join(distRoot, fromName);
    const to = path.join(distRoot, toName);
    if (!fs.existsSync(from)) continue;
    try {
      if (fs.existsSync(to)) fs.rmSync(to, { force: true });
      fs.renameSync(from, to);
      console.log(`已重命名: ${fromName} -> ${toName}`);
    } catch (e) {
      try {
        fs.copyFileSync(from, to);
        fs.unlinkSync(from);
        console.log(`已复制并替换: ${fromName} -> ${toName}`);
      } catch {}
    }
  }
}

function showPackageStructure(tmpDir) {
  console.log('\n📦 发包产物结构预览:');
  console.log('='.repeat(50));

  function listDir(dir, prefix = '', maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const sortedEntries = entries.sort((a, b) => {
        // 目录在前，文件在后
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });

      for (const entry of sortedEntries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(tmpDir, fullPath);
        const icon = entry.isDirectory() ? '📁' : '📄';
        console.log(`${prefix}${icon} ${relativePath}`);

        if (entry.isDirectory() && currentDepth < maxDepth - 1) {
          listDir(fullPath, prefix + '  ', maxDepth, currentDepth + 1);
        }
      }
    } catch (err) {
      console.log(`${prefix}❌ 无法读取目录: ${err.message}`);
    }
  }

  listDir(tmpDir);
  console.log('='.repeat(50));
}

async function confirmPublish() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\n❓ 确认要发布这个包吗？(y/N): ', (answer) => {
      rl.close();
      const confirmed =
        answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      resolve(confirmed);
    });
  });
}

function updatePackagePublishVersion(sharedDir, version) {
  const pubPkgPath = path.join(sharedDir, 'package_publish.json');
  try {
    const pubPkgContent = readJson(pubPkgPath);
    pubPkgContent.version = version;
    writeJson(pubPkgPath, pubPkgContent);
    console.log(`✅ 已更新 package_publish.json 版本号为: ${version}`);
  } catch (err) {
    console.warn(`⚠️  更新 package_publish.json 版本号失败: ${err.message}`);
  }
}

async function main() {
  const { version, skipConfirm } = parseArgs(process.argv);
  if (!version) {
    console.error('请通过 --version 或 -v 指定版本号，例如:');
    console.error(
      '  node packages/shared/publish-shared.mjs --version 0.0.1-rc.9'
    );
    process.exit(1);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sharedDir = __dirname;

  const pubPkg = path.join(sharedDir, 'package_publish.json');
  ensureFileExists(pubPkg, '发布用 package_publish.json');

  // 保存原始版本号，用于后续还原
  const originalPubPkgContent = readJson(pubPkg);
  const originalVersion = originalPubPkgContent.version;

  const tmpBase = path.join(__dirname, '..');
  const tmpDir = fs.mkdtempSync(
    path.join(tmpBase, 'actiontech-shared-publish-')
  );

  try {
    console.log(`[1/9] 创建临时目录: ${tmpDir}`);

    console.log('[2/9] 复制整个 shared 包到临时目录');
    // 复制整个包目录，但排除一些不需要的文件
    const excludePatterns = [
      'node_modules',
      'dist',
      '.git',
      '.github',
      'coverage',
      '.nyc_output',
      '.DS_Store',
      '*.log'
    ];

    const filter = (filePath) => {
      const relativePath = path.relative(sharedDir, filePath);
      return !excludePatterns.some((pattern) => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(relativePath);
        }
        return relativePath.includes(pattern);
      });
    };

    copyDirSync(sharedDir, tmpDir, { filter });

    console.log('[3/9] 调整 package.json 配置');
    // 将 package_publish.json 重命名为 package.json
    const tmpPkgJson = path.join(tmpDir, 'package.json');
    const pubPkgContent = readJson(pubPkg);

    // 更新版本号
    pubPkgContent.version = version;

    // 移除 prepublish 脚本，避免在临时目录触发构建
    if (pubPkgContent.scripts) {
      delete pubPkgContent.scripts.prepublish;
      delete pubPkgContent.scripts.prepare;
    }

    writeJson(tmpPkgJson, pubPkgContent);

    console.log('[4/9] 安装依赖: pnpm install');
    runCmd('pnpm', ['install'], tmpDir);

    console.log('[5/9] 执行构建: pnpm build');
    runCmd('pnpm', ['build'], tmpDir);

    // 验证构建产物
    const tmpDistDir = path.join(tmpDir, 'dist');
    const tmpLibDir = path.join(tmpDir, 'lib');
    ensureFileExists(tmpDistDir, '构建产物 dist 目录');
    ensureFileExists(tmpLibDir, '原始资源代码目录');
    console.log('[6-3/9] 根入口对齐：publish-entry.* -> index.*');
    renameRootPublishEntryToIndex(tmpDistDir);

    console.log('[6-1/9] 移除 lib 目录');
    fs.rmSync(tmpLibDir, { recursive: true, force: true });
    console.log('[6-2/9] 重命名 dist 目录为 lib');
    fs.renameSync(tmpDistDir, tmpLibDir);

    // 可选: 附带 README/LICENCE
    const maybeFiles = ['README.md', 'LICENSE', 'LICENSE.md'];
    for (const f of maybeFiles) {
      const src = path.join(sharedDir, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(tmpDir, f));
      }
    }

    // 显示产物结构预览
    showPackageStructure(tmpDir);

    // 移除 @actiontech/shared 依赖
    if (pubPkgContent.dependencies['@actiontech/shared']) {
      delete pubPkgContent.dependencies['@actiontech/shared'];
      writeJson(tmpPkgJson, pubPkgContent);
    }

    // 用户确认发包
    if (!skipConfirm) {
      const confirmed = await confirmPublish();
      if (!confirmed) {
        console.log('❌ 用户取消发布');
        console.log('[9/9] 清理临时目录');
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return;
      }
    }

    console.log('[7/9] 执行发布: npm publish');
    runCmd('npm', ['publish'], tmpDir);

    console.log('[8/9] 更新 package_publish.json 版本号');
    updatePackagePublishVersion(sharedDir, version);

    console.log('[9/9] 清理临时目录');
    fs.rmSync(tmpDir, { recursive: true, force: true });

    console.log('✅ 发布完成');
  } catch (err) {
    console.error('❌ 发布流程发生错误:', err?.message || err);
    process.exitCode = 1;

    // 还原原始版本号
    try {
      const pubPkgPath = path.join(sharedDir, 'package_publish.json');
      originalPubPkgContent.version = originalVersion;
      writeJson(pubPkgPath, originalPubPkgContent);
      console.log(
        `🔄 已还原 package_publish.json 版本号为: ${originalVersion}`
      );
    } catch (restoreErr) {
      console.warn(`⚠️  还原版本号失败: ${restoreErr.message}`);
    }

    try {
      if (fs.existsSync(tmpDir)) {
        console.log('🧹 清理临时目录');
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

main();
