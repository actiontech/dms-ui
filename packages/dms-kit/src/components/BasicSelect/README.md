---
group:
  title: 通用
  order: 4
---

# BasicSelect 基础选择器

基于 Ant Design Select 组件封装的基础选择器组件，提供了统一的样式规范、国际化支持、自定义清除图标和前缀标签功能。

## 何时使用

- 需要统一选择器样式规范时
- 需要支持国际化占位符文本时
- 需要自定义清除图标样式时
- 需要添加前缀标签时
- 需要保持与设计系统一致的选择器组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选模式

<code src="./demo/multiple.tsx"></code>

### 带前缀标签

<code src="./demo/prefix.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 搜索功能

<code src="./demo/search.tsx"></code>

### 分组选项

<code src="./demo/group.tsx"></code>

### 加载状态

<code src="./demo/loading.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

## API

### BasicSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 选择器类名 | `string` | - | - |
| allowClear | 是否显示清除按钮 | `boolean` | `false` | - |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| prefix | 选择器前缀标签 | `ReactNode` | - | - |

### 继承属性

BasicSelect 组件继承了 Ant Design Select 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| mode | 设置 Select 的模式 | `'multiple' \| 'tags' \| 'combobox'` | - | - |
| size | 选择框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| placeholder | 选择框占位符 | `string` | `'请选择'` | - |
| value | 当前选中的选项 | `string \| string[] \| number \| number[] \| LabeledValue \| LabeledValue[]` | - | - |
| defaultValue | 默认选中的选项 | `string \| string[] \| number \| number[] \| LabeledValue \| LabeledValue[]` | - | - |
| options | 数据化配置选项内容 | `{ label, value }[]` | - | - |
| showSearch | 是否支持搜索 | `boolean` | `false` | - |
| filterOption | 是否根据输入项进行筛选 | `boolean \| (input: string, option?: Option) => boolean` | `true` | - |
| onChange | 选中值发生变化时触发 | `(value: Value, option: Option \| Option[]) => void` | - | - |
| onSearch | 搜索框输入文字时触发 | `(value: string) => void` | - | - |
| onFocus | 获得焦点时触发 | `() => void` | - | - |
| onBlur | 失去焦点时触发 | `() => void` | - | - |

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
- 前缀标签样式支持

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicSelect = {
  default: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  prefix: {
    default: { color, background },
    separator: { border }
  },
  clearIcon: {
    default: { color },
    hover: { color }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-select-wrapper`
3. 占位符文本会自动使用国际化配置
4. 清除图标使用自定义的 `CloseOutlined` 图标
5. 前缀标签会显示在选择器左侧，用分隔线分隔
6. 加载状态会显示自定义的 `BasicEmpty` 组件
7. 所有 Ant Design Select 的属性和事件都可以正常使用
8. 组件支持泛型类型，可以指定选项值的类型

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Select 封装
- 支持所有 Select 组件的属性和事件
- 新增国际化占位符文本支持
- 自定义清除图标样式
- 新增前缀标签功能
- 统一的样式规范和主题系统集成
- 支持泛型类型定义
