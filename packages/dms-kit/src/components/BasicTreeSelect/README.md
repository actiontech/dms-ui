---
group:
  title: 通用
  order: 1
---

# BasicTreeSelect 基础树形选择器

基于 Ant Design TreeSelect 组件封装的基础树形选择器组件，提供了统一的样式规范和额外的功能特性。

## 何时使用

- 需要从树形结构中选择一个或多个节点时
- 需要展示层级数据的选择器时
- 需要保持与设计系统一致的树形选择器组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选模式

<code src="./demo/multiple.tsx"></code>

### 搜索功能

<code src="./demo/search.tsx"></code>

### 自定义图标

<code src="./demo/customIcon.tsx"></code>

### 加载状态

<code src="./demo/loading.tsx"></code>

### 表单集成

<code src="./demo/form.tsx"></code>

## API

### BasicTreeSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否显示清除按钮 | `boolean` | `true` | - |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| placeholder | 选择框默认文字 | `string` | `'请选择'` | - |

### 继承属性

BasicTreeSelect 组件继承了 Ant Design TreeSelect 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 指定当前选中的条目 | `string \| string[] \| number \| number[]` | - | - |
| defaultValue | 指定默认选中的条目 | `string \| string[] \| number \| number[]` | - | - |
| treeData | 树形数据 | `TreeNode[]` | `[]` | - |
| multiple | 是否支持多选 | `boolean` | `false` | - |
| treeCheckable | 显示 checkbox | `boolean` | `false` | - |
| showSearch | 是否支持搜索 | `boolean` | `false` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 选择框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| className | 选择框类名 | `string` | - | - |
| style | 选择框样式 | `CSSProperties` | - | - |
| onChange | 选择变化时触发 | `(value, labelList, extra) => void` | - | - |
| onSearch | 搜索时触发 | `(value: string) => void` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (lg)**: `height: 40px`
- **默认尺寸**: `height: 32px`  
- **小尺寸 (sm)**: `height: 24px`

### 样式特性

- 统一的圆角设计 (`border-radius: 4px`)
- 基于主题的色彩系统
- 自定义的展开/收起图标
- 支持悬停、聚焦、禁用等状态样式
- 统一的清除按钮样式

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicTreeSelect = {
  default: {
    borderColor,
    backgroundColor,
    color
  },
  hover: {
    borderColor
  },
  focus: {
    borderColor,
    boxShadow
  },
  disabled: {
    backgroundColor,
    color,
    borderColor
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-tree-select-wrapper`
3. 所有 Ant Design TreeSelect 的属性和事件都可以正常使用
4. 组件集成了国际化支持，placeholder 会自动使用当前语言
5. 当 `loading` 为 true 时，会显示加载状态的空状态组件

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design TreeSelect 封装
- 支持所有 TreeSelect 组件的属性和事件
- 新增自定义展开/收起图标
- 集成 BasicEmpty 组件支持加载状态
- 统一的样式规范和主题系统集成
