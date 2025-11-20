---
group:
  title: 通用
  order: 1
---

# BasicToolTip 文字提示

基于 Ant Design Tooltip 封装，支持前缀/后缀图标和自定义宽度，用于在悬停时显示提示信息。

## 何时使用

- 为复杂操作或功能提供说明文字
- 显示按钮、链接等交互元素的用途
- 在空间有限时展示完整信息
- 解释系统状态或错误信息

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 带图标的提示

<code src="./demos/icon.tsx"></code>

### 自定义宽度

<code src="./demos/width.tsx"></code>

## API

BasicToolTip 继承 Ant Design Tooltip 的所有属性，完整 API 请参考 [Tooltip 文档](https://ant.design/components/tooltip-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefixIcon | 前缀图标，`true` 时显示默认图标 | `boolean \| ReactNode` | `false` | - |
| suffixIcon | 后缀图标，`true` 时显示默认图标 | `boolean \| ReactNode` | `false` | - |
| titleWidth | 提示框宽度 | `number` | - | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 提示内容 | `ReactNode \| (() => ReactNode)` | - | - |
| placement | 提示框出现位置 | `TooltipPlacement` | `'top'` | - |
| trigger | 触发行为 | `'hover' \| 'focus' \| 'click'` | `'hover'` | - |
| children | 触发元素 | `ReactNode` | - | ✅ |

## 组件特点

1. **图标增强** → 支持前缀/后缀图标，`true` 时自动显示默认信息图标
2. **宽度控制** → 通过 `titleWidth` 灵活控制提示框宽度
3. **空值处理** → `title` 为空时自动隐藏提示框

## 注意事项

1. `prefixIcon={true}` 时默认显示 `InfoCircleOutlined` 图标
2. 提示内容过长时建议使用 `titleWidth` 限制宽度
3. `title` 为空时组件不会渲染提示框
4. 图标会通过 `Space` 组件与子元素组合，保持合适间距

## 最佳实践

1. **简洁提示**：提示内容控制在 1-2 行，避免信息过载
2. **图标使用**：使用 `prefixIcon={true}` 快速添加信息图标
3. **自定义宽度**：长文本时设置 `titleWidth` 避免过度换行
4. **条件显示**：动态 `title` 时无需手动控制显示状态
