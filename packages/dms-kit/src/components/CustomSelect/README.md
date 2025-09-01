---
group:
  title: 自定义组件
  order: 7
---

# CustomSelect 自定义选择器

基于 Ant Design Select 组件封装的自定义选择器组件，提供了统一的样式规范、内置搜索功能、自定义前缀显示和增强的标签模式。

## 何时使用

- 需要内置搜索功能的选择器时
- 需要自定义前缀显示的选择器时
- 需要增强标签模式的选择器时
- 需要保持与设计系统一致的选择器样式时
- 需要分组选项和复杂选项结构时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 带前缀的选择器

<code src="./demo/withPrefix.tsx"></code>

### 标签模式

<code src="./demo/tagsMode.tsx"></code>

### 分组选项

<code src="./demo/groupedOptions.tsx"></code>

### 搜索功能

<code src="./demo/searchFunction.tsx"></code>

### 表单集成

<code src="./demo/formIntegration.tsx"></code>

## API

### CustomSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefix | 选择器前缀图标或文本 | `ReactNode` | - | - |
| valuePrefix | 选项值的前缀显示 | `ReactNode` | `prefix` | - |
| searchInputRef | 搜索输入框的引用 | `RefObject<InputRef>` | - | - |

### 继承属性

CustomSelect 组件继承了 Ant Design Select 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| options | 选项数据 | `OptionType[]` | - | - |
| mode | 选择模式 | `'multiple' \| 'tags' \| undefined` | - | - |
| placeholder | 占位符文本 | `string \| ReactNode` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 选择器大小 | `'large' \| 'middle' \| 'small'` | `'small'` | - |
| value | 当前选中的值 | `string \| string[]` | - | - |
| defaultValue | 默认选中的值 | `string \| string[]` | - | - |
| onChange | 选择变化时的回调 | `(value, option) => void` | - | - |
| onSearch | 搜索时的回调 | `(value: string) => void` | - | - |
| onDropdownVisibleChange | 下拉框显示状态变化时的回调 | `(open: boolean) => void` | - | - |
| className | 选择器类名 | `string` | - | - |
| style | 选择器样式 | `CSSProperties` | - | - |

## 设计规范

### 样式特性

- 基于 Ant Design Select 组件的样式系统
- 统一的圆角设计 (`border-radius: 4px`)
- 自定义前缀样式，支持图标和文本
- 内置搜索输入框，自动聚焦
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

## 功能特性

### 内置搜索

- 自动显示搜索输入框
- 支持实时过滤选项
- 搜索输入框自动聚焦
- 支持自定义搜索逻辑

### 前缀显示

- 支持图标和文本前缀
- 选项标签中显示前缀
- 标签模式下的前缀处理
- 可自定义值前缀显示

### 标签模式增强

- 优化的标签渲染
- 支持分隔符显示
- 第一个标签显示前缀
- 后续标签使用分隔符

### 分组选项支持

- 支持选项组结构
- 组标签自定义样式
- 组内选项搜索过滤
- 保持分组层次结构

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件默认使用 `small` 尺寸，可以通过 `size` 属性覆盖
3. 搜索功能默认启用，无需额外配置
4. 所有 Ant Design Select 的属性和事件都可以正常使用
5. 组件会自动应用统一的样式类名 `custom-select-namespace`
6. 下拉框弹出层使用 `custom-select-popup-wrapper` 类名

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Select 封装
- 支持所有 Select 组件的属性和事件
- 新增内置搜索功能
- 新增前缀显示功能
- 增强标签模式支持
- 统一的样式规范和主题系统集成
- 支持分组选项和复杂选项结构
