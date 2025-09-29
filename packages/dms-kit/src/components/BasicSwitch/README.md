---
group:
  title: 通用
  order: 1
---

# BasicSwitch 开关组件

## 组件介绍

BasicSwitch 是一个基于 Ant Design Switch 组件的封装，提供了统一的样式主题和交互体验。该组件主要用于状态切换场景，如开启/关闭功能、启用/禁用设置等。

## 何时使用

- **功能开关**：需要快速切换某个功能或设置的开启/关闭状态
- **权限控制**：控制用户权限、系统功能的启用状态
- **设置面板**：在配置页面中切换各种选项
- **表单控件**：作为表单中的布尔值输入控件

## 代码演示

### 基础用法

最简单的开关组件，支持点击切换状态。

<code src="./demos/basic.tsx"></code>

### 带标签的开关

为开关添加描述文字，让用户更清楚了解开关的作用。

<code src="./demos/with-label.tsx"></code>

### 不同尺寸

支持三种尺寸：small、default、large。

<code src="./demos/size.tsx"></code>

### 加载状态

在异步操作时显示加载状态，防止用户重复操作。

<code src="./demos/loading.tsx"></code>

### 禁用状态

在特定条件下禁用开关，防止用户操作。

<code src="./demos/disabled.tsx"></code>

### 自定义样式

通过 className 和 style 属性自定义开关的外观。

<code src="./demos/custom.tsx"></code>

### 表单集成

在表单中使用开关组件，支持表单验证和提交。

<code src="./demos/form.tsx"></code>

## API 文档

### BasicSwitchProps

继承自 Ant Design 的 `SwitchProps`，包含以下属性：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoFocus | 自动获取焦点 | boolean | false | - |
| checked | 指定当前是否选中 | boolean | false | - |
| checkedChildren | 选中时的内容 | ReactNode | - | - |
| className | 额外的 CSS 类名 | string | - | - |
| defaultChecked | 默认是否选中 | boolean | false | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 加载中的开关 | boolean | false | - |
| size | 开关大小，可选值：default、small | 'default' \| 'small' | 'default' | - |
| unCheckedChildren | 非选中时的内容 | ReactNode | - | - |
| onChange | 变化时回调函数 | function(checked: boolean, event: Event) | - | - |
| onClick | 点击时回调函数 | function(checked: boolean, event: Event) | - | - |

## 设计规范

### 主题配置

BasicSwitch 组件支持通过主题系统进行样式定制：

```
// 主题配置示例
const theme = {
  sharedTheme: {
    uiToken: {
      colorFill: '#f0f0f0',           // 未选中状态背景色
      colorFillSecondary: '#d9d9d9'   // 禁用状态背景色
    }
  }
};
```

### 尺寸规范

- **small**: 高度 16px，适合紧凑布局
- **default**: 高度 20px，标准尺寸
- **large**: 高度 24px，适合重要操作

### 颜色规范

- **未选中状态**: 使用主题的 `colorFill` 颜色
- **选中状态**: 使用 Ant Design 默认的成功色 `#52c41a`
- **禁用状态**: 使用主题的 `colorFillSecondary` 颜色

### 交互规范

- **点击区域**: 整个开关区域都可点击
- **状态切换**: 支持键盘操作（Space 键）
- **焦点样式**: 提供清晰的焦点指示器
- **加载状态**: 显示旋转动画，防止重复操作

## 注意事项

1. **无障碍支持**: 组件内置了完整的无障碍支持，包括 ARIA 属性和键盘导航
2. **表单集成**: 在 Form 组件中使用时，记得设置 `valuePropName="checked"`
3. **异步操作**: 在异步操作期间建议使用 `loading` 状态
4. **主题定制**: 可以通过 CSS 变量或主题配置自定义样式
5. **性能优化**: 避免在 `onChange` 回调中执行复杂操作

## 更新日志

### 1.0.0
- 初始版本发布
- 基于 Ant Design Switch 组件封装
- 支持主题系统集成
- 提供统一的样式规范
