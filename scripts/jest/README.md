# 单元测试执行方案

本文档描述 dms-ui 项目的单元测试架构、执行原理及日常操作手册。

---

## 背景与问题

本项目使用 [`vite-plugin-conditional-compile`](https://github.com/KeJunMao/vite-plugin-conditional-compile) 进行条件编译，允许同一份源文件在不同构建模式下输出不同代码：

```tsx
// #if [sqle && !dms]
menus = genMenuItemsWithMenuStructTree(SQLE_ALL_MENUS, SQLE_MENU_STRUCT);
// #else
menus = genMenuItemsWithMenuStructTree(DMS_ALL_MENUS, DMS_MENU_STRUCT);
// #endif
```

条件变量包括：`ee`、`ce`、`sqle`、`provision`、`dms`、`demo`。

**核心挑战**：

1. **分支代码覆盖**：一份测试只能覆盖一种编译结果，需要多套条件分别运行
2. **条件组合多样**：条件之间可组合（如 `sqle && !dms`），单纯的 CE/EE 二分已不足够
3. **缓存污染风险**：在同一 Jest 进程内以不同条件编译同一文件，若缓存 key 相同会导致编译结果错乱

---

## 解决方案：Jest Projects

利用 Jest 的 **Projects** 特性，在一次 `jest` 调用中运行多个独立的测试配置。每个 project 拥有独立的：

- `globals.TEST_CONDITIONS`（编译条件变量）
- `testMatch` / `testPathIgnorePatterns`（测试文件归属规则）
- 独立的 transform 缓存 key（由 `custom-transform.js` 保证）

### 架构图

```
pnpm jest（包级别）
│
├── project: dms   (dms=true)       → 运行 *.test.tsx / *.ee.test.tsx
├── project: sqle-ce  (ce=true)     → 运行 *.ce.test.tsx / *.ce.sqle.test.tsx
└── project: sqle-ee  (sqle=true)   → 运行 *.sqle.test.tsx
          │
          └── 每个 project 由 custom-transform.js 用对应条件编译源代码
```

---

## Project 配置（`packages/tooling-config/jest/create-jest-config.js`）

| Project | displayName | ee | ce | sqle | provision | dms |
|---|---|---|---|---|---|---|
| EE（默认）| `dms` | ✅ | ❌ | ✅ | ✅ | ✅ |
| CE（社区版）| `sqle-ce` | ❌ | ✅ | ✅ | ❌ | ❌ |
| SQLE-only | `sqle-ee` | ✅ | ❌ | ✅ | ❌ | ❌ |
| Provision | `provision` | ✅ | ❌ | ❌ | ✅ | ❌ |

各包通过 `enabledProjects` 按需开启所需 project：

```js
// packages/base/jest.config.mjs
export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms', 'sqle-ce', 'sqle-ee'],
  collectCoverageFrom: [ ... ]
});
```

---

## 自定义 Transformer（`custom-transform.js`）

这是整个方案的核心。它负责：

1. **读取当前 project 的 `TEST_CONDITIONS`**（通过 `options.config.globals.TEST_CONDITIONS`）
2. **调用 `vitePlugin({ env: conditions }).transform`** 对源代码进行条件编译预处理
3. **生成唯一 cache key**（`md5(baseKey + JSON.stringify(conditions))`）防止不同 project 间缓存污染
4. **交给 `babel-jest`** 完成后续的 JSX/TS 转换

```
源文件 (.tsx)
    │
    ▼
vite-plugin-conditional-compile  ← 注入 TEST_CONDITIONS，移除不符合条件的代码块
    │
    ▼
babel-jest (babel-preset-react-app)  ← JSX / TypeScript 转换
    │
    ▼
Jest 可执行的 JS 代码
```

---

## 测试文件命名约定

| 文件名 | 归属 Project | 对应源码分支 |
|---|---|---|
| `Foo.test.tsx` | dms | `#else` / 默认 EE/DMS 分支 |
| `Foo.ee.test.tsx` | dms | 同上（显式标注） |
| `Foo.ce.test.tsx` | sqle-ce | `#if [ce]` / `#if [!ee]` 分支 |
| `Foo.ce.sqle.test.tsx` | sqle-ce | `#if [ce && sqle]` 组合条件分支 |
| `Foo.sqle.test.tsx` | sqle-ee | `#if [sqle && !dms]` 分支 |

**实际示例**：

```
packages/base/src/page/Nav/SideMenu/MenuList/
├── index.tsx                         # 源文件（含 #if [sqle && !dms] 分支）
├── index.test.tsx                    # dms project → dms=true，DMS 模式（空菜单）
└── index.sqle.test.tsx               # sqle-ee project → dms=false，SQLE 专属菜单
```

---

## 本地运行命令

### 根目录（全量，按包并行执行）

```bash
# 运行全部包的测试（非 watch）
pnpm test

# 全部包收集覆盖率（各包独立输出 packages/<pkg>/coverage/）
pnpm test:c
```

### 单包开发（watch 模式）

```bash
# 进入特定包目录开启 watch
pnpm --filter base test
pnpm --filter sqle test
pnpm --filter @actiontech/shared test

# 单包覆盖率
pnpm --filter base test:c
```

### 单包直接调用 jest（路径过滤、project 选择）

```bash
# 指定测试文件路径
pnpm --filter base jest -- --testPathPattern="SideMenu/MenuList"

# 指定 project
pnpm --filter base jest -- --selectProjects sqle-ee

# 指定 project + 路径
pnpm --filter base jest -- --selectProjects sqle-ee --testPathPattern="SideMenu/MenuList"
```

### 更新快照

```bash
# 在对应包目录下更新快照（需取消 CI 环境变量）
CI= pnpm --filter base jest -- --updateSnapshot --testPathPattern="MenuList/index"
CI= pnpm --filter base jest -- --selectProjects sqle-ee --updateSnapshot --testPathPattern="MenuList/index"
```

### 清理缓存

```bash
pnpm test:clean
```

---

## CI 流程（GitHub Actions）

### 执行步骤（Turbo + 按包覆盖率）

```
┌─────────────────────────────────────────────────────────┐
│  test job                                                 │
│                                                           │
│  pnpm test:ci:turbo                                       │
│      │                                                    │
│      └── turbo run test:ci --filter='./packages/*'       │
│             ├── packages/base/test:ci                    │
│             ├── packages/dms-kit/test:ci                 │
│             ├── packages/shared/test:ci                  │
│             └── packages/sqle/test:ci                    │
│                                                           │
│  每个包独立产出 coverage/report.json                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  report job (needs: test)                                 │
│                                                           │
│  下载各包 coverage artifact                                │
│  对每个包分别执行 ArtiomTr/jest-coverage-report-action    │
└─────────────────────────────────────────────────────────┘
```

---

## 各脚本对比

| 脚本 | 执行方式 | watch | 覆盖率 | 用途 |
|---|---|---|---|---|
| `pnpm test`（根目录） | pnpm 并行，按包 | ❌ | ❌ | 本地全量验证 |
| `pnpm test:c`（根目录） | pnpm 并行，按包 | ❌ | ✅ 各包独立 | 本地覆盖率报告 |
| `pnpm --filter <pkg> test` | 单包 jest | ✅ | ❌ | 开发时 watch |
| `pnpm --filter <pkg> test:c` | 单包 jest | ❌ | ✅ | 单包覆盖率 |
| `pnpm test:ci:turbo` | turbo 并行，按包 | ❌ | ✅ + json | CI 流水线 |

---

## 如何添加新的 Jest Project

当出现新的条件组合（例如需要专门覆盖 `provision=true, dms=false` 的代码分支）时：

### 第一步：在 `packages/tooling-config/jest/create-jest-config.js` 中注册 project

```javascript
const PROJECT_CONDITIONS = {
  // ... 已有 project
  'my-new-project': {
    ee: true, ce: false, sqle: false, provision: true, dms: false
  }
};
```

### 第二步：在需要的包的 `jest.config.mjs` 中启用

```js
export default createJestConfig({
  packageRoot,
  enabledProjects: ['dms', 'sqle-ce', 'my-new-project'],
  collectCoverageFrom: [ ... ]
});
```

### 第三步：按约定命名测试文件

```
Foo.my-new-project.test.tsx
```

### 第四步：验证

```bash
pnpm --filter base jest -- --selectProjects my-new-project
```

---

## 常见问题

### Q：为何在 dms project 下 MenuList 的菜单是空的？

**A**：`dms=true` 时源码走 `#else` 分支，使用 `DMS_ALL_MENUS` 和 `DMS_MENU_STRUCT`。这两个变量在本仓库中均为空数组（DMS 菜单由 `dms-ui-ee` 仓库维护）。这是预期行为，对应的 `index.test.tsx` 已验证此空菜单状态。

### Q：如何确认某个测试文件在哪个 project 下运行？

**A**：运行时 Jest 会在每行测试结果前显示 project 名，例如：

```
PASS dms packages/base/src/page/Nav/SideMenu/MenuList/index.test.tsx
PASS sqle-ee packages/base/src/page/Nav/SideMenu/MenuList/index.sqle.test.tsx
```

也可以用 `--selectProjects sqle-ee` 明确指定只运行某个 project。

### Q：更新快照时为何提示 "New snapshot was not written"？

**A**：这是因为 `CI=true` 环境变量被设置。本地更新快照时需要：

```bash
CI= pnpm --filter base jest -- --updateSnapshot --testPathPattern="<path>"
```

### Q：两个 project 能运行同一个测试文件吗？

**A**：不能，文件命名约定保证了互斥性。`dms` project 通过 `testPathIgnorePatterns` 排除了 `*.ce.test.*` 和 `*.sqle.test.*`；`sqle-ce` 和 `sqle-ee` project 通过 `testRegex` 只匹配特定命名模式。

---

## 参考文件

- [`packages/tooling-config/jest/create-jest-config.js`](../../packages/tooling-config/jest/create-jest-config.js) — Jest Projects 配置工厂函数
- [`scripts/jest/custom-transform.js`](./custom-transform.js) — 条件编译 transformer
- [`.github/workflows/main.yml`](../../.github/workflows/main.yml) — GitHub Actions CI 配置
- [`.cursor/commands/unit-testing.md`](../../.cursor/commands/unit-testing.md) — 单元测试编写规范
