# @actiontech/dms-kit

DMS Kit 是 ActionTech DMS 项目的共享组件库，提供了一套完整的 React 组件、工具函数、主题配置和类型定义。

## 安装

```bash
npm install @actiontech/dms-kit
# 或
pnpm add @actiontech/dms-kit
```

## 使用

### 组件导入

```typescript
import { ActionButton, BasicTable, CustomForm } from '@actiontech/dms-kit';
```

### 工具函数导入

```typescript
import { formatTime, validateEmail } from '@actiontech/dms-kit';
```

### 主题配置导入

```typescript
import { darkTheme, lightTheme } from '@actiontech/dms-kit';
```

### 类型定义导入

```typescript
import type { ThemeConfig } from '@actiontech/dms-kit';
```

## 依赖要求

- React >= 17
- React DOM >= 17
- Antd >= 5.7.3

## 开发

### 构建

```bash
pnpm build
```

### 开发模式

```bash
pnpm dev
```

## 许可证

MIT
