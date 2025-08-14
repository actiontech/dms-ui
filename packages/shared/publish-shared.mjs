#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import os from 'node:os';

function parseArgs(argv) {
  const args = { version: '' };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--version' || key === '-v') {
      args.version = val || '';
      i += 1;
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

function main() {
  const { version } = parseArgs(process.argv);
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

  const distDir = path.join(sharedDir, 'dist');

  const tmpBase = os.tmpdir();
  const tmpDir = fs.mkdtempSync(
    path.join(tmpBase, 'actiontech-shared-publish-')
  );

  try {
    console.log('[1/8] 在工作区内执行构建: pnpm build');
    runCmd('pnpm', ['build'], sharedDir);
    ensureFileExists(distDir, '构建产物 dist 目录');

    console.log(`[2/8] 将 dist 复制到临时目录: ${tmpDir}`);
    const tmpDist = path.join(tmpDir, 'lib');
    copyDirSync(distDir, tmpDist);

    console.log('[3/7] 根入口对齐：publish-entry.* -> index.*');
    renameRootPublishEntryToIndex(tmpDist);

    const tmpDevPkg = path.join(tmpDir, 'package.json');
    console.log('[4/7] 生成发布 package.json');
    fs.copyFileSync(pubPkg, tmpDevPkg);

    console.log(`[5/7] 更新版本号: ${version}`);
    const nextPkgJson = readJson(tmpDevPkg);
    nextPkgJson.version = version;
    // 避免在临时目录触发 prepublish/build 等生命周期脚本
    if (nextPkgJson.scripts) {
      delete nextPkgJson.scripts.prepublish;
      delete nextPkgJson.scripts.prepare;
      delete nextPkgJson.scripts.build;
    }
    writeJson(tmpDevPkg, nextPkgJson);

    // 可选: 附带 README/LICENCE
    const maybeFiles = ['README.md', 'LICENSE', 'LICENSE.md'];
    for (const f of maybeFiles) {
      const src = path.join(sharedDir, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(tmpDir, f));
      }
    }

    console.log('[6/7] 执行发布: npm publish');
    runCmd('npm', ['publish'], tmpDir);

    console.log('[7/7] 清理临时目录');
    fs.rmSync(tmpDir, { recursive: true, force: true });

    console.log('发布完成');
  } catch (err) {
    console.error('发布流程发生错误:', err?.message || err);
    process.exitCode = 1;
    try {
      if (fs.existsSync(tmpDir)) {
        console.log('清理临时目录');
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

main();
