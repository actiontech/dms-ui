---
group:
  title: 通用
  order: 1
---

# BasicInfoList 信息列表

基于 Ant Design Card 组件封装的信息列表组件，提供了统一的信息展示布局和错误状态处理。

## 何时使用

- 需要展示结构化信息列表时
- 需要响应式网格布局时
- 需要统一的错误状态和空状态处理时
- 需要可配置列数的信息展示时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义列数

<code src="./demo/columns.tsx"></code>

### 错误状态处理

<code src="./demo/error.tsx"></code>

### 加载状态

<code src="./demo/loading.tsx"></code>

### 空数据状态

<code src="./demo/empty.tsx"></code>

### 复杂内容展示

<code src="./demo/complex.tsx"></code>

## API

### BasicInfoList

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| data | 信息数据数组 | `BasicInfoDataType[]` | - | - |
| columnNumber | 列数配置 | `number` | `3` | - |
| errorInfo | 错误信息 | `string \| ReactNode` | - | - |
| errorTitle | 错误标题 | `string \| ReactNode` | - | - |
| loading | 加载状态 | `boolean` | `false` | - |

### BasicInfoDataType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 信息标签 | `ReactNode` | - | - |
| value | 信息值 | `ReactNode` | - | - |

### 继承属性

BasicInfoList 组件继承了 Ant Design Card 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 卡片标题 | `ReactNode` | - | - |
| className | 卡片类名 | `string` | - | - |
| style | 卡片样式 | `CSSProperties` | - | - |
| size | 卡片尺寸 | `'default' \| 'small'` | `'default'` | - |

## 设计规范

### 布局规范

- **默认列数**: 3列网格布局
- **响应式设计**: 自动计算最后一行的列宽
- **间距统一**: 使用 Card.Grid 的内置间距
- **悬停效果**: 禁用默认悬停效果，保持简洁

### 样式特性

- 统一的卡片网格布局
- 自动列宽计算，最后一行动态调整
- 支持加载、错误、空数据等状态
- 基于主题的色彩系统
- 响应式设计，支持不同列数配置

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicInfoList = {
  infoItem: {
    title: { color, fontSize, fontWeight },
    value: { color, fontSize },
    background: { default, hover }
  },
  grid: {
    border: { color, style, width },
    background: { default, hover }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `columnNumber` 建议设置为 2-4 之间的值，以获得最佳显示效果
3. 当数据为空或出现错误时，会自动显示 `BasicEmpty` 组件
4. 最后一行的列宽会自动调整，确保布局美观
5. 所有 Ant Design Card 的属性和事件都可以正常使用

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Card 封装
- 支持响应式网格布局
- 集成 BasicEmpty 组件处理各种状态
- 支持自定义列数配置
- 统一的样式规范和主题系统集成
