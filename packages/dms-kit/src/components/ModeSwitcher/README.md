---
group:
  title: 交互组件
  order: 19
---

# ModeSwitcher 模式切换器

基于 Ant Design Row/Col 封装的模式切换器，支持图标、文本和自定义布局。

## 何时使用

- 需要在不同模式或视图之间切换
- 需要显示当前选中状态和切换选项
- 需要图标和文本组合的模式选择
- 需要自定义布局的模式切换

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 配合图标

<code src="./demo/iconMode.tsx"></code>

### 自定义布局

<code src="./demo/customLayout.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

## API

ModeSwitcher 基于 Ant Design Row/Col 封装，通过 `rowProps` 配置 Row 属性。

### 组件属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 模式选项数组 | `ModeSwitcherOptionsType \| string[]` | - | ✅ |
| value | 当前选中的模式值 | `string \| number` | - | - |
| onChange | 模式切换回调 | `(val: string \| number) => void` | - | - |
| defaultValue | 默认选中的模式值 | `string \| number` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| rowProps | Row 组件属性 | [RowProps](https://ant.design/components/grid-cn#row) | - | - |
| className | 自定义类名 | `string` | - | - |

### ModeSwitcherOptionsType

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| label | 选项标签 | `ReactNode` | - | ✅ |
| value | 选项值 | `string \| number` | - | ✅ |
| icon | 选项图标 | `ReactNode` | - | - |
| colProps | Col 组件属性 | [ColProps](https://ant.design/components/grid-cn#col) | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **灵活布局** → 基于 Row/Col 栅格系统，支持自定义列属性
3. **图标支持** → 支持图标和文本组合，提升识别性
4. **状态管理** → 使用 useControllableValue 支持受控和非受控模式

## 布局配置

通过 `rowProps` 和 `colProps` 实现自定义布局：

- **rowProps**：配置 Row 组件属性（gutter、align、justify 等），详见 [Row API](https://ant.design/components/grid-cn#row)
- **colProps**：配置每个选项的 Col 组件属性（span、offset、flex 等），详见 [Col API](https://ant.design/components/grid-cn#col)

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `options` 数组必须包含有效的 `label` 和 `value` 属性
3. 当使用字符串数组时，字符串既作为标签也作为值
4. `colProps` 可用于控制每个选项的列宽和响应式行为

## 最佳实践

1. **选项设计**：保持选项数量适中（2-5 个），避免过多选项影响体验
2. **图标使用**：为每个模式选择有意义的图标，提升识别性
3. **布局配置**：使用 `colProps` 配置列宽，确保不同屏幕下的良好显示
4. **状态管理**：根据业务需求选择受控或非受控模式
