---
group:
  title: 通用
  order: 3
---

# BasicInputNumber 基础数字输入框

基于 Ant Design InputNumber 组件封装的基础数字输入框组件，提供了统一的样式规范和增强的功能特性。

## 何时使用

- 需要统一数字输入框样式规范时
- 需要输入数字、金额、百分比等数值时
- 需要限制数字范围或精度时
- 需要保持与设计系统一致的数字输入框组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 数字范围限制

<code src="./demo/range.tsx"></code>

### 精度控制

<code src="./demo/precision.tsx"></code>

### 格式化显示

<code src="./demo/formatter.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 带前缀和后缀

<code src="./demo/affix.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

## API

### BasicInputNumber

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 数字输入框类名 | `string` | - | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'large'` | - |

### 继承属性

BasicInputNumber 组件继承了 Ant Design InputNumber 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前值 | `number \| string` | - | - |
| defaultValue | 默认值 | `number \| string` | - | - |
| min | 最小值 | `number` | `-Infinity` | - |
| max | 最大值 | `number` | `Infinity` | - |
| step | 每次改变步数 | `number \| string` | `1` | - |
| precision | 数值精度 | `number` | - | - |
| decimalSeparator | 小数点 | `string` | `.` | - |
| formatter | 指定输入框展示值的格式 | `(value: number \| string, info: { userTyping: boolean, input: string }) => string` | - | - |
| parser | 指定从 formatter 里转换回数字的方法 | `(string) => number` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| placeholder | 输入框占位符 | `string` | - | - |
| addonBefore | 输入框前置标签 | `ReactNode` | - | - |
| addonAfter | 输入框后置标签 | `ReactNode` | - | - |
| prefix | 输入框前缀图标 | `ReactNode` | - | - |
| suffix | 输入框后缀图标 | `ReactNode` | - | - |
| onChange | 变化回调 | `(value: number \| string \| null, info: { type: 'up' \| 'down' \| 'input' \| 'blur' \| 'focus' }) => void` | - | - |
| onPressEnter | 按下回车键时的回调 | `(e: KeyboardEvent<HTMLInputElement>) => void` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (lg)**: `height: 40px, padding: 0 12px` (默认)
- **默认尺寸**: `height: 32px, padding: 0 11px`  
- **小尺寸 (sm)**: `height: 24px, padding: 0 7px`

### 样式特性

- 统一的圆角设计 (`border-radius: 6px`)
- 基于主题的边框和背景色
- 支持悬停、聚焦、禁用等状态样式
- 自定义上下箭头按钮样式
- 支持前缀和后缀标签

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicInputNumber = {
  default: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  controls: {
    default: { background, border, color },
    hover: { background },
    active: { background }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-inputNumber-wrapper`
3. 默认尺寸设置为 `large`，与其他基础组件保持一致
4. 支持所有 Ant Design InputNumber 的属性和事件
5. 数值精度控制需要同时设置 `precision` 和 `step` 属性
6. 格式化显示时注意 `formatter` 和 `parser` 的对应关系

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design InputNumber 封装
- 支持所有 InputNumber 组件的属性和事件
- 统一的样式规范和主题系统集成
- 默认大尺寸设计，提升用户体验
- 支持数值范围限制和精度控制
- 支持格式化显示和自定义样式
