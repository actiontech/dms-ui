---
group:
  title: 自定义组件
  order: 12
---

# CustomSegmentedFilter 自定义分段过滤器

基于 Ant Design Segmented 封装，提供标签字典、全部选项支持和样式自定义的分段过滤器组件。

## 何时使用

- 需要分段选择器进行数据过滤
- 需要标签字典进行国际化
- 需要自动添加"全部"选项
- 需要自定义样式或无样式模式

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 标签字典

<code src="./demo/labelDictionary.tsx"></code>

### 全部选项

<code src="./demo/withAll.tsx"></code>

## API

### CustomSegmentedFilter

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 当前选中的值 | `V` | - | - |
| onChange | 值变化回调 | `(val: V) => void` | - | - |
| defaultValue | 默认选中的值 | `V` | - | - |
| options | 选项配置 | `Array<{label: ReactNode, value: V}> \| string[]` | - | ✅ |
| labelDictionary | 标签字典 | `Record<string, string>` | - | - |
| withAll | 全部选项配置 | `boolean \| {label: ReactNode, value: V}` | `false` | - |
| noStyle | 是否清空样式 | `boolean` | `false` | - |
| className | 自定义类名 | `string` | - | - |
| style | 自定义样式 | `CSSProperties` | - | - |

继承 Ant Design Segmented 的所有其他属性（当 `noStyle` 为 `false` 时），详见 [Segmented API](https://ant.design/components/segmented-cn#api)

## 组件特点

1. **标签字典** → 支持字符串选项自动转换标签，适合国际化场景
2. **全部选项** → 自动添加"全部"选项，支持自定义标签和值
3. **灵活配置** → 支持字符串数组或对象数组两种选项格式
4. **样式自定义** → 支持无样式模式，完全控制组件外观
5. **类型安全** → 完整的 TypeScript 泛型支持

## 核心功能详解

### labelDictionary（标签字典）

当 `options` 为字符串数组时，通过 `labelDictionary` 自动转换显示标签：

```typescript
// 字符串选项
const options = ['failed', 'finished', 'cancelled'];

// 标签字典
const labelDictionary = {
  failed: '执行失败',
  finished: '执行结束',
  cancelled: '已取消'
};

// 自动转换为：
// [
//   { label: '执行失败', value: 'failed' },
//   { label: '执行结束', value: 'finished' },
//   { label: '已取消', value: 'cancelled' }
// ]
```

### withAll（全部选项）

支持三种配置方式：

```typescript
// 1. 默认配置（label: '全部', value: null）
<CustomSegmentedFilter options={options} withAll={true} />

// 2. 自定义配置
<CustomSegmentedFilter 
  options={options} 
  withAll={{ label: '所有类型', value: 'all' }}
/>

// 3. 禁用全部选项
<CustomSegmentedFilter options={options} withAll={false} />
```

### noStyle（无样式模式）

启用无样式模式后，可完全自定义组件样式：

```typescript
<CustomSegmentedFilter
  options={options}
  noStyle={true}
  className="custom-filter"
  style={{ padding: '8px', backgroundColor: '#f5f5f5' }}
/>
```

配合 CSS 类实现自定义样式：

```css
.custom-filter .custom-segmented-filter-item {
  /* 自定义未选中状态 */
}

.custom-filter .custom-segmented-filter-item-checked {
  /* 自定义选中状态 */
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. `labelDictionary` 仅在 `options` 为字符串数组时生效
3. `withAll` 选项的 value 类型需与 options 中的 value 类型一致
4. `noStyle` 模式下需自行处理样式和交互
5. 组件自动处理受控和非受控状态

## 最佳实践

1. **国际化场景**：使用字符串数组 + `labelDictionary` 实现国际化
2. **全部选项**：数据过滤场景下建议启用 `withAll`，value 设为 `null` 表示不过滤
3. **类型安全**：使用泛型明确指定 value 类型，如 `CustomSegmentedFilter<string | null>`
4. **样式定制**：需要特殊样式时使用 `noStyle` 模式，配合 CSS 类实现
5. **选项格式**：简单场景用字符串数组，复杂场景（如带图标）用对象数组
