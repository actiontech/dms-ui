---
group:
  title: 自定义组件
  order: 12
---

# CustomSegmentedFilter 自定义分段过滤器

基于 Ant Design Segmented 组件封装的自定义分段过滤器组件，提供了统一的样式规范和增强的功能特性，包括标签字典、全部选项支持和自定义样式模式。

## 何时使用

- 需要分段选择器进行数据过滤时
- 需要支持标签字典进行国际化时
- 需要自动添加"全部"选项时
- 需要自定义样式或使用无样式模式时
- 需要保持与设计系统一致的分段选择器样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 标签字典支持

<code src="./demo/labelDictionary.tsx"></code>

### 全部选项配置

<code src="./demo/withAll.tsx"></code>

### 无样式模式

<code src="./demo/noStyle.tsx"></code>

### 复杂选项配置

<code src="./demo/complexOptions.tsx"></code>



## API

### CustomSegmentedFilter

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前选中的值 | `V` | - | - |
| onChange | 值变化时的回调函数 | `(val: V) => void` | - | - |
| defaultValue | 默认选中的值 | `V` | - | - |
| labelDictionary | 标签字典，用于字符串选项的标签转换 | `Record<string, string>` | - | - |
| options | 选项配置数组 | `CustomSegmentedFilterDefaultOptionsType<V> \| string[]` | - | - |
| withAll | 是否添加"全部"选项 | `boolean \| CustomSegmentedFilterWithAllConfig<V>` | `false` | - |
| noStyle | 是否清空样式 | `boolean` | `false` | - |
| className | 自定义类名 | `string` | - | - |
| style | 自定义样式 | `CSSProperties` | - | - |

### 类型定义

```typescript
// 基础值类型
type CustomSegmentedFilterBaseValue = string | number | null;

// 全部选项配置
type CustomSegmentedFilterWithAllConfig<V> = {
  label: ReactNode;
  value: V;
};

// 选项类型
type CustomSegmentedFilterDefaultOptionsType<V> = Array<{
  label: ReactNode;
  value: V;
}>;
```

### 继承属性

CustomSegmentedFilter 组件继承了 Ant Design Segmented 组件的所有属性，当 `noStyle` 为 `false` 时。

## 设计规范

### 样式特性

- 统一的圆角设计
- 基于主题的色彩系统
- 支持悬停、选中、禁用等状态样式
- 响应式布局支持
- 可选的样式自定义

### 布局规范

- 默认使用 BasicSegmented 组件样式
- 支持无样式模式进行完全自定义
- 响应式选项排列
- 统一的间距和对齐

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicSegmented = {
  // 继承 BasicSegmented 的主题配置
}
```

## 功能特性

### 标签字典支持

当 `options` 为字符串数组时，可以通过 `labelDictionary` 自动转换标签：

```typescript
const options = ['failed', 'finished'];
const labelDictionary = {
  failed: '执行失败',
  finished: '执行结束'
};

// 自动渲染为：
// [
//   { label: '执行失败', value: 'failed' },
//   { label: '执行结束', value: 'finished' }
// ]
```

### 全部选项支持

通过 `withAll` 属性可以自动添加"全部"选项：

- `withAll: true` - 使用默认配置，label为"全部"，value为null
- `withAll: { label: '自定义', value: 'all' }` - 自定义配置
- `withAll: false` - 不显示全部选项

### 无样式模式

当 `noStyle` 为 `true` 时：
- 清空所有默认样式
- 用户可以使用 StyleWrapper 进行包裹
- 或自行添加 Class 来处理样式
- 提供最大的样式自定义自由度

### 响应式支持

- 自动适应容器宽度
- 选项自动换行
- 支持不同屏幕尺寸
- 保持良好的用户体验

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `labelDictionary` 主要用于国际化场景，建议提供完整的字典映射
3. `withAll` 选项的 value 类型需要与 options 中的 value 类型保持一致
4. 当使用 `noStyle` 模式时，需要自行处理样式和交互逻辑
5. 组件会自动处理受控和非受控状态

## 最佳实践

1. **标签字典**: 在需要国际化的场景下使用 `labelDictionary`
2. **全部选项**: 根据业务需求合理配置 `withAll` 选项
3. **样式自定义**: 在需要特殊样式时使用 `noStyle` 模式
4. **类型安全**: 使用泛型确保类型安全
5. **响应式设计**: 考虑不同屏幕尺寸下的显示效果

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Segmented 封装
- 支持所有 Segmented 组件的属性和事件
- 新增 `labelDictionary` 属性支持标签字典
- 新增 `withAll` 属性支持全部选项
- 新增 `noStyle` 属性支持无样式模式
- 统一的样式规范和主题系统集成
- 完整的 TypeScript 类型支持
