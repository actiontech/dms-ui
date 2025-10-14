---
group:
  title: 通用
  order: 1
---

# BasicDatePicker 基础日期选择器组件

## 组件介绍

BasicDatePicker 是一个基于 Ant Design DatePicker 组件封装的基础日期选择器，提供了统一的样式风格、时钟图标前缀、自定义导航按钮等功能。它是 dms-kit 中常用的日期输入组件。

## 何时使用

- 需要选择单个日期时
- 需要统一的日期选择器样式风格
- 需要时钟图标前缀的日期输入框
- 需要自定义导航按钮的日期选择器

## 代码演示

### 基础用法

最简单的日期选择器用法，支持基本的日期选择功能。

<code src="./demos/basic.tsx"></code>

### 不同尺寸

支持三种尺寸：small、middle、large。

<code src="./demos/size.tsx"></code>

### 自定义格式

支持自定义日期显示格式和输入格式。

<code src="./demos/format.tsx"></code>

### 禁用状态

当不需要用户输入时，可以禁用日期选择器。

<code src="./demos/disabled.tsx"></code>

### 范围限制

可以设置日期的选择范围，限制用户只能选择特定时间段的日期。

<code src="./demos/range.tsx"></code>

### 显示超级图标

控制是否显示年份和月份的快速跳转按钮。

<code src="./demos/super-icon.tsx"></code>

### 自定义样式

通过 className 属性添加自定义样式类。

## API 文档

### BasicDatePickerProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| hideSuperIcon | 是否隐藏年份和月份的快速跳转按钮 | boolean | true | - |
| className | 自定义 CSS 类名 | string | - | - |

### 继承属性

BasicDatePicker 继承了 Ant Design DatePicker 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前选中的日期 | Dayjs | - | - |
| defaultValue | 默认选中的日期 | Dayjs | - | - |
| onChange | 日期变化回调 | (date: Dayjs \| null, dateString: string) => void | - | - |
| placeholder | 输入框提示文字 | string | - | - |
| format | 日期格式 | string | 'YYYY-MM-DD' | - |
| size | 输入框大小 | 'large' \| 'middle' \| 'small' | 'middle' | - |
| disabled | 是否禁用 | boolean | false | - |
| allowClear | 是否显示清除按钮 | boolean | true | - |
| showTime | 是否显示时间选择 | boolean \| object | false | - |
| disabledDate | 不可选择的日期 | (current: Dayjs) => boolean | - | - |
| onOpenChange | 弹出层展开/收起回调 | (open: boolean) => void | - | - |

## 设计规范

### 样式特点

- **时钟图标**: 左侧显示时钟图标，颜色为主题的四级文本色
- **统一边框**: 使用主题的二级边框色，hover 和 focus 状态有相应的边框变化
- **自定义导航**: 左右箭头按钮使用自定义图标，支持主题色配置
- **圆角设计**: 输入框和下拉面板都使用 4px 圆角

### 主题配置

BasicDatePicker 支持以下主题变量：

```less
// 日期选择器样式变量
@color-text-quaternary: #8c8c8c;
@color-border-secondary: #d9d9d9;
@color-bg-layout: #fafafa;
@color-white: #ffffff;
@color-primary: #1890ff;

// 下拉面板样式
@basic-range-picker-dropdown-icon-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
@basic-range-picker-hover-border: 1px solid #40a9ff;
@basic-range-picker-active-border: 1px solid #1890ff;
@basic-range-picker-error-border: 1px solid #ff4d4f;
@basic-range-picker-disabled-border: 1px solid #d9d9d9;
```

### 交互状态

- **默认状态**: 二级边框色，时钟图标为四级文本色
- **悬停状态**: 边框色变为主题色，有平滑的过渡动画
- **聚焦状态**: 边框色为主题色，显示聚焦轮廓
- **禁用状态**: 边框色为禁用色，背景色为禁用背景色

## 注意事项

1. **图标依赖**: 组件依赖 `@actiontech/icons` 包中的图标组件
2. **日期格式**: 默认使用 dayjs 处理日期，确保项目中已安装 dayjs
3. **主题系统**: 组件使用 MUI 的 styled 系统，需要正确的主题上下文
4. **弹出层定位**: 下拉面板的定位容器为组件本身，避免定位问题
5. **国际化**: 日期格式和文本支持国际化配置

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基础日期选择功能
- 集成时钟图标前缀
- 自定义导航按钮样式
- 支持超级图标显示控制
