---
group:
  title: 通用
  order: 1
---

# BasicToolTip 文字提示组件

## 组件介绍

BasicToolTip 是一个基于 Ant Design Tooltip 组件的封装，提供了统一的样式主题和增强的功能特性。该组件主要用于在鼠标悬停时显示额外的提示信息，支持前缀图标、后缀图标、自定义宽度等特性，适用于帮助说明、操作提示、信息补充等场景。

## 何时使用

- **帮助说明**：为复杂操作或功能提供说明文字
- **操作提示**：显示按钮、链接等交互元素的用途
- **信息补充**：在空间有限时展示完整信息
- **状态说明**：解释系统状态、错误信息等
- **引导提示**：为新用户提供操作指导

## 代码演示

### 基础用法

最简单的文字提示，鼠标悬停时显示提示内容。

<code src="./demos/basic.tsx"></code>

### 带图标的提示

在提示内容前添加图标，增强视觉效果和信息传达。

<code src="./demos/icon.tsx"></code>

### 不同位置

支持 12 个不同方向的提示显示位置。

<code src="./demos/placement.tsx"></code>

### 自定义宽度

通过 `titleWidth` 属性控制提示框的宽度，适应不同长度的内容。

<code src="./demos/width.tsx"></code>

### 复杂内容提示

支持在提示中显示复杂的内容，如列表、表格等。

<code src="./demos/complex.tsx"></code>

### 条件显示提示

根据条件决定是否显示提示，或者显示不同的提示内容。

<code src="./demos/conditional.tsx"></code>

### 表单字段提示

在表单字段旁添加提示，帮助用户理解字段的含义和要求。

<code src="./demos/form.tsx"></code>

### 操作按钮提示

为操作按钮添加提示，说明按钮的功能和注意事项。

<code src="./demos/action.tsx"></code>

## API 文档

### BasicTooltipProps

继承自 Ant Design 的 `TooltipProps`，并扩展了以下属性：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 额外的 CSS 类名 | string | - | - |
| title | 提示内容 | ReactNode \| (() => ReactNode) | - | - |
| titleWidth | 提示框宽度 | number | - | - |
| prefixIcon | 前缀图标 | boolean \| ReactNode | false | - |
| suffixIcon | 后缀图标 | boolean \| ReactNode | false | - |
| placement | 提示框出现位置 | TooltipPlacement | 'top' | - |
| trigger | 触发行为 | 'hover' \| 'focus' \| 'click' | 'hover' | - |
| mouseEnterDelay | 鼠标移入后延时多少才显示 | number | 0.5 | - |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 | number | 0.1 | - |
| overlayClassName | 卡片类名 | string | - | - |
| overlayStyle | 卡片样式 | CSSProperties | - | - |
| children | 触发元素 | ReactNode | - | - |

### TooltipPlacement

提示框出现位置：

```tsx
type TooltipPlacement = 
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom';
```

## 设计规范

### 主题配置

BasicToolTip 组件支持通过主题系统进行样式定制：

```tsx
// 主题配置示例
const theme = {
  sharedTheme: {
    uiToken: {
      colorBgBase: '#ffffff',                    // 背景色
      colorBorderSecondary: '#d9d9d9',          // 边框颜色
      colorTextBase: '#000000'                   // 文字颜色
    }
  }
};
```

### 样式规范

- **背景色**: 使用主题的 `colorBgBase` 颜色
- **边框**: 1px 实线边框，使用主题的 `colorBorderSecondary` 颜色
- **圆角**: 6px 圆角，提供现代化的视觉效果
- **内边距**: 8px 12px，确保内容有足够的呼吸空间
- **最大宽度**: 默认最大宽度 640px，可通过 `titleWidth` 自定义

### 图标规范

- **默认图标**: 当 `prefixIcon={true}` 时，显示 `InfoCircleOutlined` 图标
- **图标颜色**: 默认使用警告色 `#faad14`
- **图标大小**: 14px，与文字大小保持一致
- **图标间距**: 图标与文字之间使用适当的间距

### 交互规范

- **触发方式**: 默认鼠标悬停触发，支持点击和焦点触发
- **显示延迟**: 鼠标移入后 0.5 秒显示，移出后 0.1 秒隐藏
- **箭头指示**: 默认不显示箭头，保持简洁的视觉效果
- **自动定位**: 根据位置自动调整显示方向，避免超出视口

### 内容规范

- **文字长度**: 建议提示内容控制在 100 字符以内
- **内容结构**: 可以使用标题、列表、标签等元素组织内容
- **信息层次**: 重要信息优先显示，次要信息适当弱化
- **操作指导**: 提供具体的操作步骤和注意事项

## 注意事项

1. **内容长度**: 避免提示内容过长，影响用户体验
2. **触发时机**: 合理设置触发方式，避免干扰用户操作
3. **位置选择**: 选择合适的显示位置，避免遮挡重要内容
4. **图标使用**: 合理使用图标，增强信息的可读性
5. **响应式设计**: 在不同屏幕尺寸下保持良好的显示效果
6. **无障碍支持**: 确保提示内容对屏幕阅读器友好

## 更新日志

### 1.0.0
- 初始版本发布
- 基于 Ant Design Tooltip 组件封装
- 支持前缀图标和后缀图标
- 支持自定义提示框宽度
- 集成主题系统
- 提供统一的样式规范
