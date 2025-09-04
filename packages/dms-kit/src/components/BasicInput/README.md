---
group:
  title: 通用
  order: 2
---

# BasicInput 基础输入框

基于 Ant Design Input 组件封装的基础输入框组件，提供了统一的样式规范、国际化支持和增强的功能特性。

## 何时使用

- 需要统一输入框样式规范时
- 需要支持国际化占位符文本时
- 需要自定义清除图标样式时
- 需要保持与设计系统一致的输入框组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 输入框类型

<code src="./demo/types.tsx"></code>

### 输入框尺寸

<code src="./demo/sizes.tsx"></code>

### 带前缀和后缀

<code src="./demo/affix.tsx"></code>

### 文本域

<code src="./demo/textarea.tsx"></code>

### 密码输入框

<code src="./demo/password.tsx"></code>

### 带清除功能

<code src="./demo/allowClear.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

## API

### BasicInput

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 输入框类名 | `string` | - | - |
| allowClear | 是否显示清除按钮 | `boolean \| { clearIcon: ReactNode }` | `false` | - |

### BasicInput.TextArea

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 文本域类名 | `string` | - | - |
| rows | 文本域行数 | `number` | `4` | - |
| autoSize | 自适应内容高度 | `boolean \| { minRows: number, maxRows: number }` | `false` | - |

### BasicInput.Password

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 密码输入框类名 | `string` | - | - |
| visibilityToggle | 是否显示切换密码可见性的按钮 | `boolean` | `true` | - |

### 继承属性

BasicInput 组件继承了 Ant Design Input 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 输入框类型 | `'text' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel'` | `'text'` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| placeholder | 输入框占位符 | `string` | `'请输入'` | - |
| value | 输入框的值 | `string` | - | - |
| defaultValue | 输入框的默认值 | `string` | - | - |
| prefix | 输入框前缀图标 | `ReactNode` | - | - |
| suffix | 输入框后缀图标 | `ReactNode` | - | - |
| addonBefore | 输入框前置标签 | `ReactNode` | - | - |
| addonAfter | 输入框后置标签 | `ReactNode` | - | - |
| onChange | 输入框内容变化时的回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - | - |
| onPressEnter | 按下回车键时的回调 | `(e: KeyboardEvent<HTMLInputElement>) => void` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (lg)**: `height: 40px, padding: 0 12px`
- **默认尺寸**: `height: 32px, padding: 0 11px`  
- **小尺寸 (sm)**: `height: 24px, padding: 0 7px`

### 样式特性

- 统一的圆角设计 (`border-radius: 6px`)
- 基于主题的边框和背景色
- 支持悬停、聚焦、禁用等状态样式
- 自定义清除图标样式
- 国际化占位符文本支持

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicInput = {
  default: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  textArea: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  password: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-input-wrapper`
3. 占位符文本会自动使用国际化配置
4. 清除图标使用自定义的 `CloseOutlined` 图标
5. 所有 Ant Design Input 的属性和事件都可以正常使用
6. 组件支持 `ref` 转发，可以获取原生 DOM 元素引用

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Input 封装
- 支持所有 Input 组件的属性和事件
- 新增国际化占位符文本支持
- 自定义清除图标样式
- 统一的样式规范和主题系统集成
- 支持 TextArea 和 Password 子组件
