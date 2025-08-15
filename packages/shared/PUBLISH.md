## @actiontech/shared 发包流程（临时目录发布）

### 背景

在工作区内直接将 `package_publish.json` 改名为 `package.json` 再构建/发布，会影响同一 monorepo 里的其他包（如 `base`）对 `@actiontech/shared` 的类型解析：此时 `types` 指向 `./dist/index.d.ts`，但构建尚未产出 `dist`，从而触发 IDE/tsc 报错。

为消除对工作区的干扰，采用"临时目录发布"：**先在临时目录中复制整个包，然后安装依赖、构建，最后发布**，工作区不进行任何切换，构建过程完全隔离。

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

1. **创建临时目录**：在项目上级目录创建唯一的发布目录
2. **复制整个包**：将 shared 包复制到临时目录，智能排除不需要的文件（`node_modules`、`dist`、`.git` 等）
3. **调整配置**：将 `package_publish.json` 转换为 `package.json`，更新版本号，移除生命周期脚本
4. **安装依赖**：在临时目录中执行 `pnpm install`
5. **执行构建**：在临时目录中执行 `pnpm build`，产出 `dist` 目录
6. **目录结构调整**：
   - 重命名 `publish-entry.*` 为 `index.*`
   - 移除 `lib` 目录（原始源码）
   - 将 `dist` 重命名为 `lib`（符合发布包结构）
7. **产物预览**：显示完整的发包产物结构，供用户确认
8. **用户确认**：提示用户确认是否发包（可跳过）
9. **执行发布**：在临时目录执行 `npm publish`
10. **版本号更新**：发包成功后自动更新 `package_publish.json` 的版本号
11. **清理资源**：删除临时目录

整个过程不修改工作区的 `package.json`，不会影响其它包/IDE 的类型解析，构建过程完全在隔离环境中进行。

### 使用方法

- **正常发布**：

```bash
node packages/shared/publish-shared.mjs --version 0.0.1-rc.9
```

- **跳过确认直接发布**：

```bash
node packages/shared/publish-shared.mjs --version 0.0.1-rc.9 --skip-confirm
# 或使用简写
node packages/shared/publish-shared.mjs --version 0.0.1-rc.9 -y
```

- **演练（不真正发布，建议先试）**：

```bash
npm_config_dry_run=true node packages/shared/publish-shared.mjs --version 0.0.0-test.0
```

### 新增功能特性

#### 🎯 **发包前确认机制**

- **产物结构预览**：发包前显示完整的目录结构，让用户确认产物内容
- **交互式确认**：提示用户输入确认发包，避免误操作
- **跳过确认选项**：支持 `--skip-confirm` 或 `-y` 参数，适用于自动化场景

#### 🔄 **智能版本号管理**

- **发包成功后**：自动更新 `package_publish.json` 的版本号为发包版本
- **发包失败时**：自动还原 `package_publish.json` 的版本号为原始版本
- **版本号持久化**：确保发包成功后版本号得到正确更新

#### 🏗️ **优化的构建流程**

- **完全隔离**：构建过程在临时目录中进行，不影响工作区
- **依赖管理**：在临时目录中安装依赖，避免工作区依赖冲突
- **智能文件过滤**：自动排除 `node_modules`、`dist`、`.git` 等不需要的文件

### 版本号建议

- 遵循 semver：`MAJOR.MINOR.PATCH[-PRERELEASE]`
- 示例：`1.2.3`、`1.2.3-rc.1`

### 常见问题（FAQ）

- **为什么之前会出现 "Could not find a declaration file for module '@actiontech/shared'"？**
  - 旧流程在工作区切换为发布版 `package.json` 时，`types` 指向未产出的 `dist`，导致消费者包的 IDE/tsc 找不到类型声明而报错。现在改为临时目录发布，工作区不切换，问题消除。

- **我在 `tsconfig.build.json` 里 `exclude` 了相关目录，为什么仍有类型报错？**
  - `exclude` 仅作用于以该 tsconfig 为入口的 tsc 编译；对 tsup 的 dts 生成（基于入口追踪）和其他包/IDE 的类型解析不生效。根因是工作区被切换为发布形态导致解析到未产出的 `dist`，与 `exclude` 无关。

- **发布后包内为何不能使用 `@actiontech/shared/lib/...` 深路径导入？**
  - 发布包通常只包含 `dist`，不存在 `lib` 源码路径。请统一从包顶层导出使用（`import { X } from '@actiontech/shared'`），并确保在 `lib/publish-entry.ts` 中导出所需符号。

- **新增的确认机制会影响自动化发布吗？**
  - 不会。可以使用 `--skip-confirm` 或 `-y` 参数跳过确认，适用于 CI/CD 等自动化场景。

- **版本号管理是如何工作的？**
  - 发包成功后，脚本会自动更新 `package_publish.json` 的版本号；如果发包失败，会自动还原为原始版本号，确保版本号的一致性。

### 触发命令示例（CI/CD）

```bash
# 假设已在仓库根目录
# 自动化发布（跳过确认）
node packages/shared/publish-shared.mjs --version "$VERSION" --skip-confirm

# 手动发布（需要确认）
node packages/shared/publish-shared.mjs --version "$VERSION"
```

### 遗留事项

- **组件导出暂存（与 react-router 强关联）**：
  - 目前在 `lib/publish-entry.ts` 依然导出了 `TypedRouter`、`ActionButton`、`ActiontechTable` 等与 `react-router` 依赖强关联的组件。
  - 原因：部分组件依赖 `ActiontechTable` 文件中提供的工具方法；同时 `ActiontechTable` 本身需要导出。考虑到本次不做较大重构，故临时保留相关导出。
  - 后续计划：将 `ActiontechTable` 中的通用工具方法拆分为独立模块，逐步去除对 `react-router` 强耦合组件的顶层导出。

- **README 遗留**：
  - 发布包内的 README 仍为遗留项，后续补充使用说明、导出清单、迁移指南等文档。
