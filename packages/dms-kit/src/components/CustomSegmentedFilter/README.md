---
group:
  title: 自定义组件
  order: 12
---

# CustomSegmentedFilter 自定义分段过滤器

基于 Ant Design Segmented 封装，提供标签字典、全部选项支持和样式自定义。

## 何时使用

- 需要分段选择器进行数据过滤
- 需要标签字典进行国际化
- 需要自动添加"全部"选项

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 标签字典

<code src="./demo/labelDictionary.tsx"></code>

### 全部选项

<code src="./demo/withAll.tsx"></code>

## API

CustomSegmentedFilter 基于 Ant Design Segmented 封装，继承所有 Segmented 属性（当 `noStyle` 为 `false` 时）。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 选项配置 | `Array<{label: ReactNode, value: V}> \| string[]` | - | ✅ |
| labelDictionary | 标签字典（用于国际化） | `Record<string, string>` | - | - |
| withAll | 全部选项配置 | `boolean \| {label: ReactNode, value: V}` | `false` | - |
| noStyle | 是否清空样式 | `boolean` | `false` | - |
| value | 当前选中的值 | `V` | - | - |
| onChange | 值变化回调 | `(val: V) => void` | - | - |
| defaultValue | 默认选中的值 | `V` | - | - |
| className | 自定义类名 | `string` | - | - |
| style | 自定义样式 | `CSSProperties` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **标签字典** → 支持字符串选项自动转换标签，适合国际化场景
3. **全部选项** → 自动添加"全部"选项，支持自定义标签和值
4. **灵活配置** → 支持字符串数组或对象数组两种选项格式
5. **样式自定义** → 支持无样式模式，完全控制组件外观

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `labelDictionary` 仅在 `options` 为字符串数组时生效
3. `withAll` 选项的 value 类型需与 options 中的 value 类型一致
4. `noStyle` 模式下需自行处理样式和交互

## 最佳实践

1. **国际化场景**：使用字符串数组 + `labelDictionary` 实现国际化
2. **全部选项**：数据过滤场景下建议启用 `withAll`，value 设为 `null` 表示不过滤
3. **类型安全**：使用泛型明确指定 value 类型，如 `CustomSegmentedFilter<string | null>`
4. **选项格式**：简单场景用字符串数组，复杂场景（如带图标）用对象数组
