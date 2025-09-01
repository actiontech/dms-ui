---
group:
  title: 通用
  order: 1
---

# BasicButton 基础按钮

基于 Ant Design Button 组件封装的基础按钮组件，提供了统一的样式规范和额外的功能特性。

## 何时使用

- 需要统一按钮样式规范时
- 需要无边框图标按钮时
- 需要保持与设计系统一致的按钮组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 按钮类型

<code src="./demo/types.tsx"></code>

### 按钮尺寸

<code src="./demo/sizes.tsx"></code>

### 图标按钮

<code src="./demo/icon.tsx"></code>

### 无边框图标按钮

<code src="./demo/noBorderIcon.tsx"></code>

### 按钮状态

<code src="./demo/states.tsx"></code>

## API

### BasicButton

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| noBorderIcon | 是否为无边框图标按钮 | `boolean` | `false` | - |

### 继承属性

BasicButton 组件继承了 Ant Design Button 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'ghost' \| 'dashed' \| 'link' \| 'text' \| 'default'` | `'default'` | - |
| size | 按钮大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| loading | 是否加载中 | `boolean \| { delay: number }` | `false` | - |
| icon | 设置按钮的图标组件 | `ReactNode` | - | - |
| children | 按钮内容 | `ReactNode` | - | - |
| className | 按钮类名 | `string` | - | - |
| style | 按钮样式 | `CSSProperties` | - | - |
| onClick | 点击按钮时的回调 | `(event) => void` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (lg)**: `padding: 0 16px`
- **默认尺寸**: `padding: 0 12px`  
- **小尺寸 (sm)**: `padding: 0 8px`

### 样式特性

- 统一的圆角设计 (`border-radius: 4px`)
- 无边框设计 (`border: 0`)
- 居中对齐的图标和文字
- 基于主题的色彩系统
- 支持悬停、激活、禁用等状态样式

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicButton = {
  default: {
    default: { background, color, boxShadow },
    hover: { background },
    active: { background },
    disabled: { background, color }
  },
  primary: {
    default: { background, color, boxShadow },
    hover: { background },
    active: { background },
    disabled: { background, color }
  },
  dashed: {
    default: { border }
  },
  dangerous: {
    default: { color },
    disabled: { color }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `noBorderIcon` 属性主要用于创建无边框的图标按钮
3. 所有 Ant Design Button 的属性和事件都可以正常使用
4. 组件会自动应用统一的样式类名 `basic-button-wrapper`

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Button 封装
- 支持所有 Button 组件的属性和事件
- 新增 `noBorderIcon` 属性支持无边框图标按钮
- 统一的样式规范和主题系统集成
