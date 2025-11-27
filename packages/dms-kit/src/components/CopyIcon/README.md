---
group:
  title: 工具
  order: 1
---

# CopyIcon 复制图标

复制图标组件，支持文本复制和复制状态反馈。

## 何时使用

- 需要复制文本内容到剪贴板
- 需要显示复制操作的状态反馈
- 在代码块、配置项等场景中提供复制功能
- 需要自定义复制逻辑

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义配置

<code src="./demo/customCopy.tsx"></code>

## API

### CopyIcon

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| text | 要复制的文本内容 | `string` | - | - |
| children | 自定义图标内容 | `ReactNode` | - | - |
| tooltips | 是否显示提示或自定义提示内容 | `boolean \| ReactNode` | `true` | - |
| onCopyComplete | 复制完成回调 | `(event?: React.MouseEvent<HTMLDivElement>) => void` | - | - |
| onCustomCopy | 自定义复制逻辑 | `(event?: React.MouseEvent<HTMLDivElement>) => void` | - | - |
| className | 自定义类名 | `string` | - | - |

## 组件特点

1. **一键复制** → 点击图标即可复制文本到剪贴板
2. **状态反馈** → 复制成功后显示 CheckOutlined 图标，3 秒后恢复
3. **智能提示** → 支持自定义提示内容或禁用提示
4. **自定义逻辑** → 支持通过 `onCustomCopy` 自定义复制行为

## 图标状态

- **默认状态**：显示复制图标（CopyOutlined），主题色
- **复制成功**：显示成功图标（CheckOutlined），成功色
- **悬停效果**：鼠标悬停时显示提示信息

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 如果不提供 `text` 属性，会尝试从 `children` 中获取文本内容
3. 复制成功后，图标会在 3 秒后自动恢复到默认状态
4. 使用 `onCustomCopy` 时，组件不会自动执行默认的复制逻辑

## 最佳实践

1. **代码块复制**：配合代码展示组件使用，方便用户复制代码
2. **配置项复制**：在配置页面中，为密钥、token 等提供复制功能
3. **自定义提示**：使用 `tooltips` 属性自定义提示文案，提升用户体验
4. **复制回调**：使用 `onCopyComplete` 配合 Message 组件显示复制成功提示
