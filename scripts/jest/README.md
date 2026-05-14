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
pnpm jest
│
├── project: ee   (dms=true)    → 运行 *.test.tsx / *.ee.test.tsx
├── project: ce   (ce=true)     → 运行 *.ce.test.tsx / *.ce.sqle.test.tsx
└── project: sqle (dms=false)   → 运行 *.sqle.test.tsx
          │
          └── 每个 project 由 custom-transform.js 用对应条件编译源代码
```

---

## 三个 Project 的配置

| Project | displayName | ee | ce | sqle | provision | dms | demo |
|---|---|---|---|---|---|---|---|
| EE（默认）| `ee` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| CE（社区版）| `ce` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| SQLE-only | `sqle` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

### 各 Project 的文件匹配规则

**ee project**（默认）：

- 包含：`*.test.tsx`、`*.test.ts`（所有普通测试文件）
- 排除：`*.ce.test.*`、`*.sqle.test.*`（这些由其他 project 处理）

**ce project**：

- 仅包含：`*.ce.test.{ts,tsx}`、`*.ce.sqle.test.{ts,tsx}`

**sqle project**：

- 仅包含：`*.sqle.test.{ts,tsx}`
- 排除：`*.ce.sqle.test.*`（已归属 ce project）

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

### 缓存 key 策略

```javascript
getCacheKey: (sourceText, sourcePath, options) => {
  const conditions = options?.config?.globals?.TEST_CONDITIONS ?? getDefaultConditions();
  const baseKey = babelJestConfig.getCacheKey(sourceText, sourcePath, options);
  return crypto.createHash('md5')
    .update(baseKey)
    .update(JSON.stringify(conditions))
    .digest('hex');
}
```

同一源文件在 `ee` 和 `sqle` project 下会生成**不同的缓存 key**，确保两套编译结果各自独立存储。

---

## 测试文件命名约定

| 文件名 | 归属 Project | 对应源码分支 |
|---|---|---|
| `Foo.test.tsx` | ee | `#else` / 默认 EE/DMS 分支 |
| `Foo.ee.test.tsx` | ee | 同上（显式标注） |
| `Foo.ce.test.tsx` | ce | `#if [ce]` / `#if [!ee]` 分支 |
| `Foo.ce.sqle.test.tsx` | ce | `#if [ce && sqle]` 组合条件分支 |
| `Foo.sqle.test.tsx` | sqle | `#if [sqle && !dms]` 分支 |

**实际示例**：

```
packages/base/src/page/Nav/SideMenu/MenuList/
├── index.tsx                         # 源文件（含 #if [sqle && !dms] 分支）
├── index.test.tsx                    # ee project → dms=true，DMS 模式（空菜单）
└── index.sqle.test.tsx               # sqle project → dms=false，SQLE 专属菜单
```

---

## 本地运行命令

所有命令均通过 `package.json` scripts 调用：

### 开发时监视运行

```bash
# 运行全部 projects（ee + ce + sqle）
pnpm test

# 按路径过滤（推荐：开发时只跑相关文件）
pnpm test packages/base/src/page/Nav/SideMenu/MenuList

# 指定 project + 路径（sqle / ce / ee）
pnpm test packages/base/src/page/Nav/SideMenu/MenuList sqle

# 只跑某个 project 的全部测试
pnpm test "" sqle
```

### 覆盖率报告（本地）

```bash
# 全量覆盖率
pnpm test:c

# 路径过滤
pnpm test:c packages/base/src/page/Nav/SideMenu/MenuList

# 指定 project
pnpm test:c packages/base/src/page/Nav/SideMenu/MenuList sqle
```

### 更新快照

```bash
# 更新指定文件的快照（需取消 CI 环境变量）
CI= pnpm jest --updateSnapshot --testPathPattern="MenuList/index"

# 更新指定 project 的快照
CI= pnpm jest --selectProjects sqle --updateSnapshot --testPathPattern="MenuList/index"
```

### 清理缓存

```bash
pnpm test:clean
```

---

## CI 流程（GitHub Actions）

### 执行步骤

```
┌─────────────────────────────────────────────────────────┐
│  test job (matrix: shard [1,2,3,4])                      │
│                                                           │
│  run-ci.sh $shard_index $shard_count                     │
│      │                                                    │
│      ├── pnpm test:clean                                  │
│      ├── pnpm jest --ci --shard=$i/4                     │
│      │       ├── ee project    ┐                         │
│      │       ├── ce project    ├── 全部 project 的测试    │
│      │       └── sqle project  ┘   被统一 shard          │
│      ├── coverage/report-$i.json                         │
│      └── coverage/coverage-final-$i.json                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  report job (needs: test)                                 │
│                                                           │
│  下载 4 个 shard 的 artifacts                             │
│  node merge-report-json.js                               │
│      ├── 合并 4 份 report-*.json（测试计数）              │
│      └── 合并 4 份 coverage-final-*.json（覆盖率）        │
│                                                           │
│  → coverage-merged.json（最终报告）                       │
└─────────────────────────────────────────────────────────┘
```

### Shard 机制

Jest 的 `--shard=i/N` 将**所有 project 的测试文件总集合**平均分配到 N 个 runner 上。

- 添加新的 project 会自动被纳入分片，无需修改 CI 配置
- `SHARD_COUNT` 环境变量控制 `merge-report-json.js` 的合并逻辑（默认值 4，与 matrix 一致）

### 关键脚本

| 脚本 | 用途 |
|---|---|
| `scripts/jest/run-ci.sh` | CI 单个 shard 的完整执行流程 |
| `scripts/jest/merge-report-json.js` | 合并所有 shard 的覆盖率与测试报告 |
| `scripts/jest/custom-transform.js` | 条件编译 + Babel 的自定义 transformer |
| `scripts/jest/run.sh` | 本地开发监视模式运行入口 |
| `scripts/jest/run-coverage.sh` | 本地覆盖率报告运行入口 |

---

## 如何添加新的 Jest Project

当出现新的条件组合（例如需要专门覆盖 `provision=true, dms=false` 的代码分支）时：

### 第一步：在 `jest.config.js` 中添加 project

```javascript
{
  ...sharedProjectConfig,
  displayName: 'provision',
  globals: {
    TEST_CONDITIONS: {
      ee: true, ce: false, sqle: true,
      provision: true, dms: false, demo: false
    }
  },
  testMatch: ['**/*.provision.test.{ts,tsx}'],
  testPathIgnorePatterns: sharedIgnorePatterns
}
```

### 第二步：按约定命名测试文件

```
Foo.provision.test.tsx
```

### 第三步：编写测试

测试文件无需任何特殊配置，直接按普通测试文件结构编写即可。

### 第四步：验证

```bash
pnpm test "" provision
```

---

## 常见问题

### Q：为何在 ee project 下 MenuList 的菜单是空的？

**A**：`dms=true` 时源码走 `#else` 分支，使用 `DMS_ALL_MENUS` 和 `DMS_MENU_STRUCT`。这两个变量在本仓库中均为空数组（DMS 菜单由 `dms-ui-ee` 仓库维护）。这是预期行为，对应的 `index.test.tsx` 已验证此空菜单状态。

### Q：如何确认某个测试文件在哪个 project 下运行？

**A**：运行时 Jest 会在每行测试结果前显示 project 名，例如：

```
PASS ee packages/base/src/page/Nav/SideMenu/MenuList/index.test.tsx
PASS sqle packages/base/src/page/Nav/SideMenu/MenuList/index.sqle.test.tsx
```

也可以用 `--selectProjects sqle` 明确指定只运行 sqle project。

### Q：更新快照时为何提示 "New snapshot was not written"？

**A**：这是因为 `CI=true` 环境变量被设置。本地更新快照时需要：

```bash
CI= pnpm jest --updateSnapshot --testPathPattern="<path>"
```

### Q：两个 project 能运行同一个测试文件吗？

**A**：不能，文件命名约定保证了互斥性。`ee` project 通过 `testPathIgnorePatterns` 排除了 `*.ce.test.*` 和 `*.sqle.test.*`；`ce` 和 `sqle` project 通过 `testMatch` 只匹配特定命名模式。

---

## 参考文件

- [`jest.config.js`](../../jest.config.js) — Jest Projects 完整配置
- [`scripts/jest/custom-transform.js`](./custom-transform.js) — 条件编译 transformer
- [`scripts/jest/run-ci.sh`](./run-ci.sh) — CI shard 执行脚本
- [`scripts/jest/merge-report-json.js`](./merge-report-json.js) — 报告合并脚本
- [`.github/workflows/main.yml`](../../.github/workflows/main.yml) — GitHub Actions CI 配置
- [`.cursor/commands/unit-testing.md`](../../.cursor/commands/unit-testing.md) — 单元测试编写规范
