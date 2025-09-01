---
group:
  title: 自定义组件
  order: 7
---

# CustomInput 自定义输入框

基于 Ant Design Input 组件和 BasicInput 组件封装的自定义输入框组件，提供了统一的样式规范和自定义的回车键处理功能。

## 何时使用

- 需要自定义回车键处理逻辑时
- 需要保持与设计系统一致的输入框样式时
- 需要前缀图标或文本的输入框时
- 需要继承 BasicInput 所有功能的自定义输入框时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 带前缀的输入框

<code src="./demo/withPrefix.tsx"></code>

### 自定义回车处理

<code src="./demo/customEnter.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 表单集成

<code src="./demo/formIntegration.tsx"></code>

## API

### CustomInput

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onCustomPressEnter | 自定义回车键处理函数 | `(value: string) => void` | - | - |
| prefix | 输入框前缀图标或文本 | `ReactNode` | - | - |

### 继承属性

CustomInput 组件继承了 Ant Design Input 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| placeholder | 输入框提示文本 | `string` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'small'` | - |
| value | 输入框的值 | `string` | - | - |
| defaultValue | 输入框的默认值 | `string` | - | - |
| onChange | 输入框值变化时的回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - | - |
| onBlur | 输入框失去焦点时的回调 | `(e: FocusEvent<HTMLInputElement>) => void` | - | - |
| onFocus | 输入框获得焦点时的回调 | `(e: FocusEvent<HTMLInputElement>) => void` | - | - |
| className | 输入框类名 | `string` | - | - |
| style | 输入框样式 | `CSSProperties` | - | - |

## 设计规范

### 样式特性

- 基于 BasicInput 组件的样式系统
- 统一的圆角设计 (`border-radius: 4px`)
- 自定义前缀样式，支持图标和文本
- 响应式的悬停和聚焦效果
- 支持清除图标功能

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.customSelect = {
  border: string;
  content: {
    prefixColor: string;
  };
  focusBackGroundColor: string;
  hoverBackgroundColor: string;
}
```

### 尺寸规范

- **小尺寸 (small)**: 默认尺寸，适合大多数场景
- **中尺寸 (middle)**: 通过 size 属性设置
- **大尺寸 (large)**: 通过 size 属性设置

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `onCustomPressEnter` 属性是必需的，用于处理回车键事件
3. 组件默认使用 `small` 尺寸，可以通过 `size` 属性覆盖
4. 所有 Ant Design Input 的属性和事件都可以正常使用
5. 组件会自动应用统一的样式类名 `custom-input-namespace`

## 更新日志

- **1.0.0**: 初始版本，基于 BasicInput 和 Ant Design Input 封装
- 支持所有 Input 组件的属性和事件
- 新增 `onCustomPressEnter` 属性支持自定义回车处理
- 统一的样式规范和主题系统集成
- 继承 BasicInput 的所有功能和样式
