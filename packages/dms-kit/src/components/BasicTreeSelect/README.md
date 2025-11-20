---
group:
  title: 通用
  order: 1
---

# BasicTreeSelect 基础树形选择器

基于 Ant Design TreeSelect 封装的树形选择器，提供统一的样式和图标，支持加载状态。

## 何时使用

- 需要从树形结构中选择节点
- 需要展示层级数据的选择器
- 需要统一的选择器样式和交互

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选模式

<code src="./demo/multiple.tsx"></code>

### 搜索功能

<code src="./demo/search.tsx"></code>

### 加载状态

<code src="./demo/loading.tsx"></code>

## API

BasicTreeSelect 继承 Ant Design TreeSelect 的所有属性，完整 API 请参考 [TreeSelect 文档](https://ant.design/components/tree-select-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示加载状态 | `boolean` | `false` |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 树形数据 | `TreeNode[]` | `[]` |
| value | 当前选中的值 | `string \| string[] \| number \| number[]` | - |
| onChange | 选择变化时触发 | `(value) => void` | - |
| placeholder | 选择框默认文字 | `string` | `'请选择'` |
| allowClear | 是否显示清除按钮 | `boolean` | `true` |
| showSearch | 是否支持搜索 | `boolean` | `false` |
| multiple | 是否支持多选 | `boolean` | `false` |
| treeCheckable | 显示 checkbox | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

## 组件特点

- **统一图标**：自定义展开/收起图标和清除图标
- **加载状态**：支持 loading 属性显示加载中状态
- **空状态**：集成 BasicEmpty 组件显示空数据
- **国际化**：placeholder 自动支持多语言

## 注意事项

- 组件会自动应用 `basic-tree-select-wrapper` 样式类名
- `loading` 为 true 时会在下拉框中显示加载状态

## 最佳实践

- 使用 `treeDefaultExpandAll` 默认展开所有节点以提升用户体验
- 对于大数据量场景，配合 `showSearch` 和 `filterTreeNode` 实现搜索功能
- 多选场景建议使用 `treeCheckable` 配合 `multiple` 以获得更好的交互体验
