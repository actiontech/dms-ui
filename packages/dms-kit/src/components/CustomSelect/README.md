---
group:
  title: 自定义组件
  order: 7
---

# CustomSelect 自定义选择器

基于 Ant Design Select 封装，提供内置搜索、前缀显示和增强标签模式。

## 何时使用

- 需要带图标或文本前缀的选择器
- 需要内置搜索过滤功能
- 需要分组显示选项

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 带前缀的选择器

<code src="./demo/withPrefix.tsx"></code>

### 多选模式

<code src="./demo/tagsMode.tsx"></code>

### 分组选项

<code src="./demo/groupedOptions.tsx"></code>

## API

CustomSelect 基于 Ant Design Select 封装，继承所有 Select 属性。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefix | 选择器前缀 | `ReactNode` | - | - |
| valuePrefix | 选项值前缀 | `ReactNode` | `prefix` | - |
| searchInputRef | 搜索框引用 | `RefObject<InputRef>` | - | - |

### 常用 Select 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 选项数据 | `OptionType[]` | - | ✅ |
| mode | 选择模式 | `'multiple' \| 'tags'` | - | - |
| placeholder | 占位符 | `string \| ReactNode` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 选择器大小 | `'small' \| 'middle' \| 'large'` | `'small'` | - |
| allowClear | 支持清除 | `boolean` | `false` | - |
| onChange | 值变化回调 | `(value, option) => void` | - | - |
| onSearch | 搜索回调 | `(value: string) => void` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **内置搜索** → 自动显示搜索框，支持实时过滤，搜索框自动聚焦
3. **前缀显示** → 支持图标和文本前缀，可独立设置选项值前缀
4. **标签模式增强** → 多选模式下第一个标签显示前缀，后续标签使用分隔符
5. **分组支持** → 支持选项分组，搜索时自动在所有分组中过滤

## 前缀说明

- **prefix**：显示在选择器输入框左侧的前缀
- **valuePrefix**：显示在下拉选项中每个选项前的前缀，默认等于 `prefix`

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 搜索功能默认启用，无需额外配置
3. 默认尺寸为 `small`，可通过 `size` 属性修改
4. 分组选项时，`options` 数组中的每项包含 `label` 和 `options` 字段

## 最佳实践

1. **图标前缀**：使用语义化图标提升用户体验
2. **搜索优化**：选项较多时（>10 项），搜索功能能显著提升效率
3. **分组使用**：相关选项较多时使用分组，保持结构清晰
4. **多选提示**：多选模式下设置清晰的 placeholder 提示用户
