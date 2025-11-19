---
group:
  title: 自定义组件
  order: 7
---

# CustomSelect 自定义选择器

基于 Ant Design Select 封装，提供内置搜索、自定义前缀显示和增强标签模式的选择器组件。

## 何时使用

- 需要带图标或文本前缀的选择器
- 需要内置搜索过滤功能
- 需要多选或标签模式
- 需要分组显示选项
- 需要与表单集成的选择器

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

### CustomSelect

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefix | 选择器前缀 | `ReactNode` | - | - |
| valuePrefix | 选项值前缀 | `ReactNode` | `prefix` | - |
| searchInputRef | 搜索框引用 | `RefObject<InputRef>` | - | - |
| options | 选项数据 | `OptionType[]` | - | ✅ |
| mode | 选择模式 | `'multiple' \| 'tags'` | - | - |
| placeholder | 占位符 | `string \| ReactNode` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 选择器大小 | `'small' \| 'middle' \| 'large'` | `'small'` | - |
| allowClear | 支持清除 | `boolean` | `false` | - |
| onChange | 值变化回调 | `(value, option) => void` | - | - |
| onSearch | 搜索回调 | `(value: string) => void` | - | - |

继承 Ant Design Select 的所有其他属性，详见 [Select API](https://ant.design/components/select-cn#api)

## 组件特点

1. **内置搜索** → 自动显示搜索框，支持实时过滤，搜索框自动聚焦
2. **前缀显示** → 支持图标和文本前缀，可独立设置选项值前缀
3. **标签模式增强** → 多选模式下第一个标签显示前缀，后续标签使用分隔符
4. **分组支持** → 支持选项分组，搜索时自动在所有分组中过滤
5. **表单集成** → 与 Ant Design Form 完全兼容，支持所有验证规则

## 核心功能详解

### prefix 和 valuePrefix

- `prefix`: 显示在选择器输入框左侧的前缀
- `valuePrefix`: 显示在下拉选项中每个选项前的前缀
- 默认情况下 `valuePrefix` 等于 `prefix`，可独立设置

```typescript
// 前缀和选项值前缀相同
<CustomSelect prefix={<UserOutlined />} options={userOptions} />

// 前缀和选项值前缀不同
<CustomSelect 
  prefix={<UserOutlined />} 
  valuePrefix={<TeamOutlined />}
  options={userOptions} 
/>
```

### 分组选项

支持多级分组结构，搜索功能会在所有分组中查找匹配项：

```typescript
const groupedOptions = [
  {
    label: '用户管理',
    options: [
      { label: '张三', value: 'zhangsan' },
      { label: '李四', value: 'lisi' }
    ]
  },
  {
    label: '数据库管理',
    options: [
      { label: 'MySQL', value: 'mysql' },
      { label: 'PostgreSQL', value: 'postgresql' }
    ]
  }
];
```

### 多选模式

支持 `multiple` 和 `tags` 两种多选模式：

- `multiple`: 只能选择已有选项
- `tags`: 可以输入自定义标签

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. 搜索功能默认启用，无需额外配置
3. 继承所有 Ant Design Select 属性和事件
4. 默认尺寸为 `small`，可通过 `size` 属性修改
5. 分组选项时，`options` 数组中的每项包含 `label` 和 `options` 字段

## 最佳实践

1. **图标前缀**：使用语义化图标提升用户体验（如用户选择用 UserOutlined）
2. **搜索优化**：选项较多时（>10 项），搜索功能能显著提升效率
3. **分组使用**：相关选项较多时使用分组，保持结构清晰
4. **多选提示**：多选模式下建议设置清晰的 placeholder 提示用户
5. **表单验证**：与 Form 集成时使用 `rules` 属性设置验证规则
