#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = __dirname;

function parseArgs(argv) {
  const args = { version: '', skipConfirm: false, registry: '', auth: '' };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--version' || key === '-v') {
      args.version = val || '';
      i += 1;
    } else if (key === '--skip-confirm' || key === '-y') {
      args.skipConfirm = true;
    } else if (key === '--registry' || key === '-r') {
      args.registry = val || '';
    } else if (key === '--auth' || key === '-a') {
      args.auth = val || '';
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

async function main() {
  const { skipConfirm, registry, auth } = parseArgs(process.argv);

  const version = readJson(path.join(iconsDir, 'package.json')).version;

  const pubPkg = path.join(iconsDir, 'package_publish.json');
  ensureFileExists(pubPkg, '发布用 package_publish.json');

  // 保存原始版本号，用于后续还原
  const originalPubPkgContent = readJson(pubPkg);
  const originalVersion = originalPubPkgContent.version;

  const tmpBase = path.join(__dirname, '..');
  const tmpDir = path.join(tmpBase, 'actiontech-icons-publish');

  try {
    console.log(`[1/7] 创建临时目录: ${tmpDir}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    console.log('[2/7] 复制整个 icons 包到临时目录');
    // 复制整个包目录，但排除一些不需要的文件
    const excludeTopLevel = new Set([
      'node_modules',
      'dist',
      'es',
      '.git',
      '.github',
      'coverage',
      '.nyc_output'
    ]);

    const filter = (filePath) => {
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

    copyDirSync(iconsDir, tmpDir, { filter });

    console.log('[3/7] 调整 package.json 配置');
    // 将 package_publish.json 重命名为 package.json
    const tmpPkgJson = path.join(tmpDir, 'package.json');
    const pubPkgContent = readJson(pubPkg);

    // 更新版本号
    pubPkgContent.version = version;

    // 移除 prepublishOnly 脚本，避免在临时目录触发构建
    if (pubPkgContent.scripts) {
      delete pubPkgContent.scripts.prepublishOnly;
      delete pubPkgContent.scripts.prepare;
    }

    writeJson(tmpPkgJson, pubPkgContent);

    console.log('[4/7] 安装依赖: pnpm install');
    runCmd('pnpm', ['install'], tmpDir);

    console.log('[5/7] 执行构建: pnpm build');
    runCmd('pnpm', ['build'], tmpDir);

    // 显示产物结构预览
    showPackageStructure(tmpDir);

    // 用户确认发包
    if (!skipConfirm) {
      const confirmed = await confirmPublish();
      if (!confirmed) {
        console.log('❌ 用户取消发布');
        console.log('[7/7] 清理临时目录');
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return;
      }
    }
    console.log('[6/7] 配置认证');
    runCmd('pnpm', ['config', 'set', auth], tmpDir);
    console.log('[7/7] 执行发布: pnpm publish');
    runCmd(
      'pnpm',
      ['publish', '--registry', registry, '--no-git-checks'],
      tmpDir
    );

    console.log('✅ 发布完成');
  } catch (err) {
    console.error('❌ 发布流程发生错误:', err?.message || err);
    process.exitCode = 1;

    // 还原原始版本号
    try {
      const pubPkgPath = path.join(iconsDir, 'package_publish.json');
      originalPubPkgContent.version = originalVersion;
      writeJson(pubPkgPath, originalPubPkgContent);
      console.log(
        `🔄 已还原 package_publish.json 版本号为: ${originalVersion}`
      );
    } catch (restoreErr) {
      console.warn(`⚠️  还原版本号失败: ${restoreErr.message}`);
    }
  } finally {
    console.log('[7/7] 清理临时目录');
    try {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        console.log('✅ 已清理临时目录');
      }
    } catch (cleanupErr) {
      console.warn(`⚠️  清理临时目录失败: ${cleanupErr.message}`);
    }
  }
}

main();
