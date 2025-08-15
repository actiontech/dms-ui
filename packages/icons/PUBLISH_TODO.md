# Icons 包发布临时处理方案（PUBLISH_TODO）

## 背景

`packages/icons` 目录下存在两个配置文件：

- `package.json`：供 DMS 项目本地/开发运行时使用，入口为源码 `src/index.ts`。
- `package_publish.json`：供发版时使用，入口为构建产物（如 `es/index.js`、`dist/index.js`，并包含类型文件）。

之所以采用“双配置”方案，是为了在日常开发中保持 DMS 工程对源码入口的稳定依赖，同时在发版时切换到产物入口，避免对 DMS 运行造成影响。

## 何时需要发布

- 新增/更新图标资源（`svg/`）并已同步生成 React 组件（`src/`）。
- 变更了打包或导出行为，需要产出新的 `es/` 或 `dist/`。
- 修复线上问题并需要对外发版。

## 发布前检查清单

- 版本号：在 `packages/icons/package_publish.json` 中按语义化版本更新 `version`。
- 入口与导出：确认 `main/module/types/exports` 指向构建产物（当前为 `es/` 与 `dist/`）。
- 发布范围：`files` 至少包含 `es`；如需提供 CJS（`require`）消费，确保发布包中包含 `dist`（见 FAQ）。
- 脚本：`prepublishOnly` 会自动构建（`pnpm build`）。
- Registry：`publishConfig.registry` 指向私有仓库 `http://10.186.18.19:4873/`，无需额外指定。
