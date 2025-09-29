---
group:
  title: 工具
  order: 1
---

# CopyIcon 复制图标

一个功能完整的复制图标组件，支持文本复制、自定义复制逻辑、复制状态反馈等功能。

## 何时使用

- 需要复制文本内容到剪贴板时
- 需要显示复制操作的状态反馈时
- 需要自定义复制逻辑时
- 在代码块、配置项等场景中提供复制功能时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义复制逻辑

<code src="./demo/customCopy.tsx"></code>

### 禁用提示

<code src="./demo/noTooltip.tsx"></code>

### 自定义提示内容

<code src="./demo/customTooltip.tsx"></code>

### 复制完成回调

<code src="./demo/onCopyComplete.tsx"></code>

## API

### CopyIcon

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| text | 要复制的文本内容 | `string` | - | - |
| children | 自定义图标内容 | `ReactNode` | - | - |
| tooltips | 是否显示提示，或自定义提示内容。当为 true 时显示默认提示，当为其他值时在复制成功时显示该内容 | `boolean \| ReactNode` | `true` | - |
| onCopyComplete | 复制完成后的回调函数 | `(event?: React.MouseEvent<HTMLDivElement>) => void` | - | - |
| className | 自定义类名 | `string` | - | - |
| onCustomCopy | 自定义复制逻辑 | `(event?: React.MouseEvent<HTMLDivElement>) => void` | - | - |

## 设计规范

### 图标状态

- **默认状态**: 显示复制图标 (`CopyOutlined`)，主题色
- **复制成功状态**: 显示成功图标 (`CheckOutlined`)，成功色
- **悬停效果**: 鼠标悬停时显示提示信息

### 样式特性

- 图标大小: `14px`
- 颜色过渡: `transition: color 0.3s`
- 左边距: `margin-left: 4px`
- 鼠标指针: `cursor: pointer`

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.uiToken = {
  colorPrimary: '#1890ff',      // 默认图标颜色
  colorSuccess: '#52c41a'       // 复制成功图标颜色
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 如果不提供 `text` 属性，会尝试从 `children` 中获取文本内容
3. 复制成功后，图标会在 3 秒后自动恢复到默认状态
4. 使用 `onCustomCopy` 时，组件不会自动执行默认的复制逻辑
5. 组件会自动处理复制失败的情况，使用降级方案
6. `tooltips` 属性支持布尔值和 ReactNode，当为 true 时显示默认提示，当为其他值时在复制成功时显示该内容

## 更新日志

- **1.0.0**: 初始版本，支持基础文本复制功能
- 支持自定义复制逻辑和复制完成回调
- 支持提示信息的自定义配置
- 集成主题系统，支持主题切换
