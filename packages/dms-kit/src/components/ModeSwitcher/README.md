---
group:
  title: 交互组件
  order: 19
---

# ModeSwitcher 模式切换器

基于 Ant Design Row/Col 组件封装的模式切换器组件，提供了统一的样式规范和交互体验，支持图标、文本和自定义布局，适用于不同模式或视图之间的切换。

## 何时使用

- 需要在不同模式或视图之间切换时
- 需要显示当前选中状态和切换选项时
- 需要支持图标和文本组合的模式选择时
- 需要保持与设计系统一致的切换器样式时
- 需要自定义布局的模式切换时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 图标模式

<code src="./demo/iconMode.tsx"></code>

### 自定义布局

<code src="./demo/customLayout.tsx"></code>



### 集成使用

<code src="./demo/integration.tsx"></code>

## API

### ModeSwitcher

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| options | 模式选项数组 | `ModeSwitcherOptionsType \| Array<string>` | - | - |
| value | 当前选中的模式值 | `V` | - | - |
| onChange | 模式切换的回调函数 | `(val: V) => void` | - | - |
| defaultValue | 默认选中的模式值 | `V` | - | - |
| className | 自定义类名 | `string` | - | - |
| rowProps | Row 组件的属性 | `RowProps` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |

### ModeSwitcherOptionsType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 模式选项的标签文本 | `ReactNode` | - | - |
| value | 模式选项的值 | `string \| number` | - | - |
| icon | 模式选项的图标 | `ReactNode` | - | - |
| colProps | Col 组件的属性 | `ColProps` | - | - |

### 类型定义

```typescript
// 泛型类型，支持 string 或 number 类型的值
type ModeSwitcherProps<V extends string | number = string> = {
  options: ModeSwitcherOptionsType | Array<string>;
  value?: V;
  onChange?: (val: V) => void;
  defaultValue?: V;
  className?: string;
  rowProps?: RowProps;
  disabled?: boolean;
};

// 模式选项类型
type ModeSwitcherOptionsType = Array<{
  label: ReactNode;
  value: string | number;
  icon?: ReactNode;
  colProps?: ColProps;
}>;
```

### 继承属性

ModeSwitcher 组件继承了 Ant Design Row 组件的所有属性，通过 rowProps 进行配置。

## 设计规范

### 样式特性

- 统一的模式切换器样式
- 基于主题的色彩系统
- 支持图标和文本组合
- 响应式布局支持
- 清晰的选中状态指示

### 布局规范

- 基于 Row/Col 栅格系统
- 支持自定义列属性配置
- 自动处理选项间距
- 自定义列数配置
- 统一的选项高度

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.modeSwitcher = {
  // 继承自定义样式的主题配置
}
```

## 功能特性

### 模式切换

- 支持受控和非受控模式
- 自动处理选中状态
- 支持图标和文本组合
- 可配置的切换回调

### 布局控制

- 基于 Ant Design 栅格系统
- 支持自定义列属性
- 灵活布局配置
- 灵活的选项排列

### 状态管理

- 使用 useControllableValue 管理状态
- 支持默认值设置
- 自动处理内部状态
- 支持禁用状态

### 交互反馈

- 清晰的选中状态指示
- 平滑的切换动画
- 支持禁用状态
- 鼠标悬停效果

## 使用场景

### 视图模式切换

在应用的不同视图模式之间切换，如列表视图、网格视图、卡片视图等。

### 功能模式选择

选择不同的功能模式，如编辑模式、预览模式、只读模式等。

### 主题模式切换

在明暗主题、色彩主题等不同主题模式之间切换。

### 布局模式调整

调整页面的布局模式，如紧凑模式、宽松模式、自定义模式等。

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `options` 数组必须包含有效的 `label` 和 `value` 属性
3. 当使用字符串数组时，字符串既作为标签也作为值
4. `colProps` 可以用于控制每个选项的列宽和响应式行为
5. 组件会自动处理选中状态的样式和交互

## 最佳实践

1. **选项设计**: 保持选项数量适中，避免过多选项影响用户体验
2. **图标使用**: 为每个模式选择有意义的图标，提升识别性
3. **布局配置**: 使用 `colProps` 配置列宽和布局属性
4. **状态管理**: 合理使用受控和非受控模式，根据业务需求选择
5. **样式定制**: 通过主题系统保持与整体设计的一致性

## 更新日志

- **1.0.0**: 初始版本，基于 Row/Col 组件封装
- 支持模式切换和状态管理
- 集成图标和文本显示
- 统一的样式规范和主题系统集成
- 响应式布局和自定义配置支持
- 完整的 TypeScript 类型支持
- 支持受控和非受控模式
- 基于 useControllableValue 的状态管理
