---
group:
  title: 业务工具组件
  order: 13
---

# ToggleTokens 令牌切换

基于 Ant Design Space 组件封装的令牌切换组件，提供了统一的样式规范和增强的功能特性。支持单选/多选模式、复选框样式、无样式模式和标签字典，适用于多种数据筛选和选择场景。

## 何时使用

- **数据筛选场景**：需要对列表数据进行多条件筛选（如状态筛选、类型筛选等）
- **单一选择场景**：需要在互斥选项中进行选择（如状态切换、分类选择等）
- **多项选择场景**：需要同时选择多个选项（如权限配置、功能开关等）
- **复选框反馈**：需要更直观的选中状态视觉反馈
- **自定义样式**：需要完全自定义令牌样式以匹配设计系统
- **国际化支持**：需要通过标签字典实现多语言切换
- **统一设计**：需要保持与设计系统一致的令牌组件样式

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选模式


默认为单选模式，可使用multiple设置为多选模式

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
| options | 选项配置数组，支持对象数组或字符串数组 | `ToggleTokensOptionsType \| string[]` | - | - |
| value | 当前选中的值（受控） | `V \| V[]` | - | - |
| onChange | 值变化时的回调函数 | `(val: V \| V[]) => void` | - | - |
| defaultValue | 默认选中的值（非受控） | `V \| V[]` | - | - |
| multiple | 是否支持多选模式 | `boolean` | `false` | - |
| withCheckbox | 是否显示复选框图标（仅多选模式有效） | `boolean` | `false` | - |
| noStyle | 是否使用无样式模式，清空所有默认样式 | `boolean` | `false` | - |
| labelDictionary | 标签字典，用于字符串选项的标签转换（国际化） | `Record<string, string>` | - | - |
| disabled | 是否禁用所有选项 | `boolean` | `false` | - |
| className | 自定义容器类名 | `string` | - | - |

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
