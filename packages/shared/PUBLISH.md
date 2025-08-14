## @actiontech/shared 发包流程（临时目录发布）

### 背景

在工作区内直接将 `package_publish.json` 改名为 `package.json` 再构建/发布，会影响同一 monorepo 里的其他包（如 `base`）对 `@actiontech/shared` 的类型解析：此时 `types` 指向 `./dist/index.d.ts`，但构建尚未产出 `dist`，从而触发 IDE/tsc 报错。

为消除对工作区的干扰，采用“临时目录发布”：构建在工作区完成，发布动作在系统临时目录执行，工作区不进行任何切换。

### 目录与关键文件

- `packages/shared/publish-shared.mjs`: 发布脚本（临时目录发布）
- `packages/shared/package_publish.json`: 发布版 `package.json` 模板（含 `main/module/types/exports/files/publishConfig`）
- `packages/shared/tsup.config.ts`: 构建配置（`entry`, `tsconfig`, `dts`, `outDir` 等）
- `packages/shared/tsconfig.build.json`: 构建 tsconfig（可覆盖 `noEmit/isolatedModules` 等）

### 前置条件

- Node.js、pnpm、npm 可用
- 已配置正确的 npm registry（见 `package_publish.json.publishConfig`）
- 工作区可成功执行 `pnpm -C packages/shared build`

### 发布步骤（脚本自动化完成）

1. 在工作区执行构建（产出 `dist`）
2. 在系统临时目录创建发布用目录，仅复制 `dist` 与必要文件（如 `README.md`、`LICENSE`）
3. 将 `package_publish.json` 复制为临时目录内的 `package.json`，写入指定版本号
4. 在临时目录执行 `npm publish`
5. 清理临时目录

整个过程不修改工作区的 `package.json`，不会影响其它包/IDE 的类型解析。

### 使用方法

- 正常发布：

```bash
node packages/shared/publish-shared.mjs --version 0.0.1-rc.9
```

- 演练（不真正发布，建议先试）：

```bash
npm_config_dry_run=true node packages/shared/publish-shared.mjs --version 0.0.0-test.0
```

### 版本号建议

- 遵循 semver：`MAJOR.MINOR.PATCH[-PRERELEASE]`
- 示例：`1.2.3`、`1.2.3-rc.1`

### 常见问题（FAQ）

- 为什么之前会出现 “Could not find a declaration file for module '@actiontech/shared'”？
  - 旧流程在工作区切换为发布版 `package.json` 时，`types` 指向未产出的 `dist`，导致消费者包的 IDE/tsc 找不到类型声明而报错。现在改为临时目录发布，工作区不切换，问题消除。

- 我在 `tsconfig.build.json` 里 `exclude` 了相关目录，为什么仍有类型报错？
  - `exclude` 仅作用于以该 tsconfig 为入口的 tsc 编译；对 tsup 的 dts 生成（基于入口追踪）和其他包/IDE 的类型解析不生效。根因是工作区被切换为发布形态导致解析到未产出的 `dist`，与 `exclude` 无关。

- 发布后包内为何不能使用 `@actiontech/shared/lib/...` 深路径导入？
  - 发布包通常只包含 `dist`，不存在 `lib` 源码路径。请统一从包顶层导出使用（`import { X } from '@actiontech/shared'`），并确保在 `lib/publish-entry.ts` 中导出所需符号。

### 最佳实践

- 统一从包顶层导出，避免 `@actiontech/shared/lib/...` 深路径导入
- 确保 `package_publish.json` 正确指向 `dist`：
  - `main`, `module`, `types` 与 `exports` 的 `types`/`default`
  - `files` 仅包含需要发布的目录（建议只包含 `dist`）
  - `publishConfig` 指向正确的 registry，`access` 设置符合私库/公库需求
- 如需更稳健的类型生成，可在 `tsconfig.build.json` 明确覆盖：
  - `"noEmit": false`
  - `"isolatedModules": false`

### 触发命令示例（CI/CD）

```bash
# 假设已在仓库根目录
node packages/shared/publish-shared.mjs --version "$VERSION"
```

### 备注

- 发布脚本会在临时目录禁用可能触发二次构建的生命周期脚本（如 `prepublish/prepare/build`）
- 失败时会打印错误并清理临时目录；如清理失败需手动检查
