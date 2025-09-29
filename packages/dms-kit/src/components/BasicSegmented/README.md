---
group:
  title: 通用
  order: 1
---

# BasicSegmented 分段控制器

基于 Ant Design Segmented 组件封装的分段控制器组件，提供了统一的样式规范和主题系统集成。

## 何时使用

- 需要在一组互斥且相关的选项中进行选择时
- 需要展示不同视图或模式切换时
- 需要保持与设计系统一致的分段控制器组件时
- 需要响应式的选项切换界面时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 图标分段控制器

<code src="./demo/icon.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

### 自定义样式

<code src="./demo/custom.tsx"></code>

### 响应式选项

<code src="./demo/responsive.tsx"></code>

## API

### BasicSegmented

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 自定义类名 | `string` | - | - |

### 继承属性

BasicSegmented 组件继承了 Ant Design Segmented 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| options | 分段控制器选项 | `SegmentedOptions` | - | - |
| value | 当前选中的值 | `string \| number` | - | - |
| defaultValue | 默认选中的值 | `string \| number` | - | - |
| onChange | 选项变化时的回调 | `(value: string \| number) => void` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 分段控制器大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| block | 是否撑满父容器 | `boolean` | `false` | - |
| className | 自定义类名 | `string` | - | - |
| style | 自定义样式 | `CSSProperties` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (large)**: 适合页面级的分段控制器
- **默认尺寸 (middle)**: 适合组件内的分段控制器
- **小尺寸 (small)**: 适合紧凑布局的分段控制器

### 样式特性

- 统一的圆角设计
- 基于主题的色彩系统
- 支持悬停、激活、禁用等状态样式
- 响应式设计，支持不同屏幕尺寸
- 自动应用统一的样式类名 `basic-segmented-wrapper`

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicSegmented = {
  default: {
    background: { default, hover, active, disabled },
    color: { default, hover, active, disabled },
    border: { color, style, width }
  },
  selected: {
    background: { default, hover, active },
    color: { default, hover, active }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 所有 Ant Design Segmented 的属性和事件都可以正常使用
3. 组件会自动应用统一的样式类名
4. 支持响应式设计，在不同屏幕尺寸下自动调整
5. 可以通过 `className` 和 `style` 属性进行自定义样式调整

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Segmented 封装
- 支持所有 Segmented 组件的属性和事件
- 统一的样式规范和主题系统集成
- 响应式设计支持
- 自动样式类名应用
