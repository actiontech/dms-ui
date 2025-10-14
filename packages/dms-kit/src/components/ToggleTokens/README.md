---
group:
  title: 业务工具组件
  order: 13
---

# ToggleTokens 令牌切换

基于 Ant Design Space 组件封装的令牌切换组件，提供了统一的样式规范和增强的功能特性，支持单选和多选模式，可配置复选框样式和无样式模式。

## 何时使用

- 需要令牌式选择器进行数据过滤时
- 需要支持单选和多选模式时
- 需要复选框样式的令牌时
- 需要自定义样式的令牌时
- 需要保持与设计系统一致的令牌组件样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 单选模式

<code src="./demo/singleMode.tsx"></code>

### 多选模式

<code src="./demo/multipleMode.tsx"></code>

### 复选框样式

<code src="./demo/withCheckbox.tsx"></code>

### 无样式模式

<code src="./demo/noStyle.tsx"></code>

### 标签字典支持

<code src="./demo/labelDictionary.tsx"></code>

## API

### ToggleTokens

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| options | 选项配置数组 | `ToggleTokensOptionsType \| string[]` | - | - |
| value | 当前选中的值 | `V \| V[]` | - | - |
| onChange | 值变化时的回调函数 | `(val: V \| V[]) => void` | - | - |
| defaultValue | 默认选中的值 | `V \| V[]` | - | - |
| multiple | 是否支持多选 | `boolean` | `false` | - |
| withCheckbox | 是否显示复选框样式 | `boolean` | `false` | - |
| noStyle | 是否使用无样式模式 | `boolean` | `false` | - |
| labelDictionary | 标签字典，用于字符串选项的标签转换 | `Record<string, string>` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| className | 自定义类名 | `string` | - | - |

### 类型定义

```typescript
// 选项类型
type ToggleTokensOptionsType = Array<{
  label: React.ReactNode;
  value: string | number;
  onClick?: (checked: boolean) => void;
  className?: string;
}>;

// 组件属性类型
type ToggleTokensProps<V extends string | number | null = string> =
  | (BaseToggleTokenPropsType & ToggleTokensMultipleModeProps<V>)
  | (BaseToggleTokenPropsType & ToggleTokensSingleModeProps<V>);
```

### 继承属性

ToggleTokens 组件继承了 Ant Design Space 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| size | 设置子元素间距 | `'small' \| 'middle' \| 'large'` | `'small'` | - |
| direction | 子元素的排列方向 | `'vertical' \| 'horizontal'` | `'horizontal'` | - |
| align | 子元素的对齐方式 | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | - | - |
| wrap | 是否自动换行 | `boolean` | `false` | - |

## 设计规范

### 样式特性

- 统一的圆角设计
- 基于主题的色彩系统
- 支持悬停、选中、禁用等状态样式
- 响应式布局支持
- 可选的复选框样式

### 布局规范

- 默认使用 BasicButton 组件样式
- 支持无样式模式进行完全自定义
- 响应式选项排列
- 统一的间距和对齐

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.toggleTokens = {
  // 继承 BasicButton 的主题配置
}
```

## 功能特性

### 单选和多选模式

- **单选模式**: `multiple={false}` 或不设置，只能选择一个选项
- **多选模式**: `multiple={true}`，可以选择多个选项，值类型为数组

### 复选框样式

当 `withCheckbox={true}` 时：
- 选中的令牌会显示复选框图标
- 提供更直观的选中状态反馈
- 适合需要明确选中状态的场景

### 无样式模式

当 `noStyle={true}` 时：
- 清空所有默认样式
- 用户可以通过 CSS 类进行完全自定义
- 提供最大的样式自定义自由度

### 标签字典支持

当 `options` 为字符串数组时，可以通过 `labelDictionary` 自动转换标签：

```typescript
const options = ['pending', 'approved', 'rejected'];
const labelDictionary = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
};
```

### 自定义点击事件

每个选项可以配置独立的 `onClick` 回调函数：

```typescript
const options = [
  { label: '选项A', value: 'a', onClick: (checked) => console.log('选项A:', checked) },
  { label: '选项B', value: 'b', onClick: (checked) => console.log('选项B:', checked) }
];
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 多选模式下，`value` 和 `onChange` 的类型必须为数组
3. `labelDictionary` 主要用于国际化场景，建议提供完整的字典映射
4. 当使用 `noStyle` 模式时，需要自行处理样式和交互逻辑
5. 组件会自动处理受控和非受控状态

## 最佳实践

1. **模式选择**: 根据业务需求选择合适的单选或多选模式
2. **复选框样式**: 在需要明确选中状态时使用 `withCheckbox`
3. **样式自定义**: 在需要特殊样式时使用 `noStyle` 模式
4. **标签字典**: 在需要国际化的场景下使用 `labelDictionary`
5. **事件处理**: 利用 `onClick` 回调处理选项特定的业务逻辑

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Space 封装
- 支持单选和多选模式
- 新增 `withCheckbox` 属性支持复选框样式
- 新增 `noStyle` 属性支持无样式模式
- 新增 `labelDictionary` 属性支持标签字典
- 支持自定义点击事件回调
- 统一的样式规范和主题系统集成
- 完整的 TypeScript 类型支持
